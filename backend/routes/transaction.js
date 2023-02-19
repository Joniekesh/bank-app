import express from "express";
const router = express.Router();
import Transaction from "../models/transaction.js";
import { check, validationResult } from "express-validator";
import { isAuthenticated } from "../middleware/auth.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// @desc  Create  transaction
// @route  POST /api/transactions
// @access Private
router.post(
	"/",
	[
		check("receiverId", "Receiver account number is required").notEmpty(),
		check("amount", "Amount is required").notEmpty(),
		check("description", "Transaction description is required").notEmpty(),
		check("PIN", "Transaction PIN is required").notEmpty(),
	],
	isAuthenticated,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { amount, description, receiverId, PIN } = req.body;

		try {
			const user = await User.findById(receiverId);

			const currentUser = await User.findById(req.user.id);

			// Match user transaction PIN with what is in the DB
			const isPINmatch = await bcrypt.compareSync(
				PIN,
				currentUser.transactionPIN
			);

			if (!isPINmatch) {
				return res.status(400).json({ errors: [{ msg: "Incorrect PIN." }] });
			}

			if (currentUser._id.toString() === receiverId) {
				return res.status(400).json({
					errors: [
						{
							msg: "Sorry, you can not transfer to yourself from your account.",
						},
					],
				});
			}

			if (user._id !== receiverId) {
				return res.status(400).json({
					errors: [
						{
							msg: "Icorrect account number.",
						},
					],
				});
			}

			// Check if the sender's account balance is enough to execute the transaction
			if (amount > currentUser.balance) {
				return res.status(400).json({
					errors: [
						{
							msg: "Sorry, you do not have sufficient balance to execute this transaction.",
						},
					],
				});
			} else {
				// Calc sender's and receivers net account balances
				const netSenderBalance = (currentUser.balance =
					Number(currentUser.balance) - Number(amount));
				const netReceiverBalance = (user.balance =
					Number(user.balance) + Number(amount));

				await User.findByIdAndUpdate(
					currentUser._id,
					{ ...currentUser, netSenderBalance },
					{ new: true }
				);

				await User.findByIdAndUpdate(
					user._id,
					{ ...user, netReceiverBalance },
					{ new: true }
				);

				// Initialize transaction object
				const transaction = new Transaction({
					accounts: [req.user.id, user._id],
					sender: currentUser,
					receiverId: user._id,
					amount,
					description,
					PIN,
				});

				const savedTransaction = await transaction.save();

				// Structure the transaction response to be returned to the client
				const sructuredTransaction = {
					_id: savedTransaction._id,
					accounts: savedTransaction.accounts,
					sender: {
						senderAccount: savedTransaction.sender._id,
						firstName: savedTransaction.sender.firstName,
						lastName: savedTransaction.sender.lastName,
					},
					receiverAccount: savedTransaction.receiverId,
					receiverFirstname: user.firstName,
					receiverLastname: user.lastName,
					amountSent: savedTransaction.amount,
					balanceRemaining: netSenderBalance,
					description: savedTransaction.description,
					createdAt: transaction.createdAt,
					updatedAt: transaction.updatedAt,
				};

				res.status(200).json({ transaction: sructuredTransaction });
			}
		} catch (err) {
			if (err.kind == "ObjectId") {
				return res
					.status(400)
					.json({ errors: [{ msg: "Incorrect account number." }] });
			}
			res.status(500).json("Server Error!");
		}
	}
);

// @desc   Get Transaction By ID
// @route  GET /api/transactions/find/:id
// @access Private
router.get("/find/:id", isAuthenticated, async (req, res) => {
	try {
		const transaction = await Transaction.findById(req.params.id);

		if (!transaction) {
			return res.status.json("Transactions not found.");
		}

		const { PIN, ...others } = transaction._doc;

		res.status(200).json(others);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
});

// @desc   Get logged in user transactions
// @route  GET /api/transactions/me
// @access Private
router.get("/", isAuthenticated, async (req, res) => {
	try {
		const transactions = await Transaction.find({
			accounts: { $in: [req.user.id] },
		});

		if (!transactions) {
			return res.status(404).json("Transactions not found.");
		}

		const structuredTransactions = transactions.map((transaction) => {
			return {
				_id: transaction._id,
				accounts: transaction.accounts,
				sender: transaction.sender,
				receiverId: transaction.receiverId,
				amount: transaction.amount,
				createdAt: transaction.createdAt,
			};
		});
		res.status(200).json(structuredTransactions);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
});

export default router;
