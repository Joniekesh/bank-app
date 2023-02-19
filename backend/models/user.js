import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		otherName: {
			type: String,
			trim: true,
		},
		profilPic: {
			type: String,
			default:
				"http://res.cloudinary.com/joniekesh/image/upload/v1657122047/upload/qw8fkm9pirbdlmyeeefp.jpg",
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},

		birthday: {
			type: Date,
			required: true,
		},

		address: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
		},
		transactionPIN: {
			type: String,
			default: "",
		},
		resetPasswordToken: {
			type: String,
		},
		resetPasswordExpire: {
			type: String,
		},
		resetPinToken: {
			type: String,
		},
		resetPinExpire: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await bcrypt.genSaltSync(10);

	this.password = bcrypt.hashSync(this.password, salt);

	next();
});

UserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");

	// Hash token (private key) and save to database
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// Set token expire date
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

	return resetToken;
};

UserSchema.methods.getResetPinToken = function () {
	const resetPinToken = crypto.randomBytes(20).toString("hex");

	// Hash token (private key) and save to database
	this.resetPinToken = crypto
		.createHash("sha256")
		.update(resetPinToken)
		.digest("hex");

	// Set token expire date (Ten Minutes)
	this.resetPinExpire = Date.now() + 10 * (60 * 1000);

	return resetPinToken;
};

export default mongoose.model("User", UserSchema);
