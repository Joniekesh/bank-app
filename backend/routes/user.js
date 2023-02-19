import express from "express";
import User from "../models/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { check, validationResult } from "express-validator";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// @desc   Update user
// @route  POST /api/users/me
// @access Private
router.put("/me", isAuthenticated, async (req, res) => {
	const { email, phone, password } = req.body;

	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json("User not found.");
		}

		user.email = email || user.email;
		user.phone = phone || user.phone;
		if (password) {
			user.password = password;
		}

		const updatedUser = await user.save();

		res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
});

// @desc   Get all users
// @route  GET /api/users
// @access Private
router.get("/", isAuthenticated, async (req, res) => {
	try {
		const users = await User.find();

		if (!users) return res.status(404).json("Users not found.");

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
});

// @desc   Get user by ID
// @route  GET /api/users/find/:id
// @access Private
router.get("/find/:id", isAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (user) return res.status(404).json("User not found.");

		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
});

// @desc   Create transaction PIN
// @route  PUT /api/users/pin
// @access Private
router.put(
	"/pin",
	[
		check("email", "Email is required").isEmail(),
		check(
			"transactionPIN",
			"Transaction PIN of 4 digits is required!"
		).notEmpty(),
	],
	isAuthenticated,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, transactionPIN } = req.body;

		try {
			const user = await User.findById(req.user.id);

			const salt = await bcrypt.genSaltSync(10);
			const hashedpIN = bcrypt.hashSync(transactionPIN, salt);
			const PIN = (user.transactionPIN = hashedpIN);

			if (transactionPIN.length < 4 || transactionPIN.length > 4) {
				return res.status(400).json("Transaction PIN of 4 digits is required.");
			}

			if (user.email !== email) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Wrong email provided." }] });
			}

			const updatedUser = await User.findByIdAndUpdate(
				req.user.id,
				{
					...user,
					PIN,
				},
				{ new: true }
			);

			res.status(200).json(updatedUser);
		} catch (error) {
			console.log(error);
		}
	}
);

// @desc   Forgot Pin
// @route  POST /api/users/forgotpin
// @access Public
router.post(
	"/forgotpin",
	[check("email", "Email is required.").isEmail()],
	isAuthenticated,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			if (user.email !== email)
				return res.status(400).json({
					errors: [
						{ msg: `No user with email: ${email} found in the database.` },
					],
				});

			// Reset token generated and add hashed version to the database
			const resetPinToken = user.getResetPinToken();

			await user.save();

			// Create Reset URL to email to provided email address
			const resetUrl = `https://bank-app-uqei.onrender.com/resetpin/${resetPinToken}`;

			//HTML Message
			const message = `
		<h1>You have requested for a transaction PIN reset.</h1>
      <p>Please reset your PIN using the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`;

			try {
				await sendEmail({
					to: user.email,
					subject: "Transaction PIN Reset Request.",
					text: message,
				});

				res
					.status(200)
					.json("Email sent. Please check your inbox for a reset link.");
			} catch (error) {
				res.status(500).json(error);

				user.resetPinToken = undefined;
				user.resetPinExpire = undefined;

				await user.save();
			}
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

// @desc   Reset Pin
// @route  PUT /api/users/:resetToken
// @access Public
router.put("/resetpin/:resetPinToken", isAuthenticated, async (req, res) => {
	const { transactionPIN } = req.body;

	const salt = await bcrypt.genSaltSync(10);
	const hashedpIN = bcrypt.hashSync(transactionPIN, salt);

	// Compare token in url to hashed token
	const resetPinToken = crypto
		.createHash("sha256")
		.update(req.body.resetPinToken)
		.digest("hex");

	try {
		const user = await User.findOne({
			resetPinToken,
			resetPinExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json("Invalid/expired token. Please resend Reset Request.");
		}

		user.transactionPIN = user.transactionPIN = hashedpIN;
		user.resetPinToken = undefined;
		user.resetPinExpire = undefined;

		await user.save();

		res.status(200).json({
			data: "PIN Update Success!",
			user,
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
