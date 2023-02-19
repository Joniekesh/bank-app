import express from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { sendSms } from "../twilio.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// @desc   Get logged in  user
// @route  GET /api/auth/me
// @access Private
router.get("/me", isAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		const { password, ...others } = user._doc;

		res.status(200).json({ user: others });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

// @desc   Create user
// @route  POST /api/auth
// @access Public
router.post(
	"/",
	[
		check("firstName", "First name is required").notEmpty(),
		check("lastName", "Last name is required").notEmpty(),
		check("email", "Email is required").isEmail(),
		check(
			"password",
			"A password of 6 or more characters is required"
		).isLength({ min: 6 }),
		check("phone", "Phone is required").notEmpty(),
		check("birthday", "Birthday is required").notEmpty(),
		check("address", "Address is required").notEmpty(),
		check("city", "City is required").notEmpty(),
		check("state", "State is required").notEmpty(),
		check("country", "Country is required").notEmpty(),
		check("balance", "Balance is required to open an account.").notEmpty(),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			firstName,
			lastName,
			otherName,
			email,
			password,
			phone,
			birthday,
			address,
			city,
			state,
			country,
			balance,
		} = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({
					errors: [{ msg: `A user with email:${user.email} alrady exist.` }],
				});
			}

			user = new User({
				firstName,
				lastName,
				otherName,
				email,
				password,
				phone,
				birthday,
				address,
				city,
				state,
				country,
				balance,
			});

			await user.save();

			const successMessage = `Account Succesfully created.Account name:${user.firstName} ${user.lastName}. Account number:${user._id}`;

			sendSms(user.phone, successMessage);

			res
				.status(200)
				.json(
					"Account created successfully.Kindly check your phone for your account details."
				);
		} catch (error) {
			console.log(error);
			res.status(500).json("Server Error");
		}
	}
);

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
router.post(
	"/login",
	[
		check("email", "Email is required").isEmail(),
		check(
			"password",
			"A password of 6 or more characters is required"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(404)
					.json({ errors: [{ msg: "Invalid Credentials." }] });
			}

			const isMatch = await bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!isMatch) {
				return res
					.status(401)
					.json({ errors: [{ msg: "Invalid Credentials." }] });
			}

			const { password, ...others } = user._doc;

			res.status(200).json({
				user: others,
				token: generateToken(user._id),
			});
		} catch (error) {
			console.log(error);
			res.status(500).json("Server Error");
		}
	}
);

// @desc   Forgot Password
// @route  POST /api/auth/forgotpassword
// @access Public
router.post(
	"/forgotpassword",
	[check("email", "Email is required.").isEmail()],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email } = req.body;

		try {
			const user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: "User not found!" }] });
			}

			if (user.email !== email) {
				return res.status(404).json({
					errors: [
						{ msg: `No user with email: ${email} found in the database.` },
					],
				});
			}

			// Reset token generated and add hashed version to database
			const resetToken = user.getResetPasswordToken();

			await user.save();

			// Create Reset URL to email to provided email address
			const resetUrl = `https://bank-app-uqei.onrender.com/api/resetpassword/${resetToken}`;

			//HTML Message
			const message = `
		<h1>You have requested for a password reset.</h1>
      <p>Please reset your password using the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
		`;

			try {
				await sendEmail({
					to: user.email,
					subject: "Password Reset Request.",
					text: message,
				});

				res
					.status(200)
					.json("Email sent. Please check your inbox for a reset link.");
			} catch (error) {
				res.status(500).json(error);

				user.resetPasswordToken = undefined;
				user.resetPasswordExpire = undefined;

				await user.save();
			}
		} catch (error) {
			res.status(500).json(error);
		}
	}
);

// @desc   Reset Password
// @route  POST /api/auth/:resetToken
// @access Public
router.put("/resetpassword/:resetToken", async (req, res) => {
	// Compare token in url to hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.body.resetToken)
		.digest("hex");

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json("Invalid/expired token. Please resend Reset Request.");
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			data: "Password Update Success! You can now login.",
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json(error);
	}
});

export default router;
