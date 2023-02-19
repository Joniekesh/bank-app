import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
	{
		accounts: {
			type: [String],
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		receiverId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		PIN: {
			type: String,
			required: true,
			default: "",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);
