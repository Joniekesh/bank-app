import nodemailer from "nodemailer";

export const sendEmail = (options) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		auth: {
			user: process.env.EMAIL_USER_NAME,
			pass: process.env.EMAIL_USER_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER_NAME,
		to: options.to,
		subject: options.subject,
		html: options.text,
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
};
