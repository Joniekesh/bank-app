import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			if (!token) {
				return res.status(401).json("No token! Authorization denied.");
			}

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const user = await User.findById(decoded.id);

			req.user = user;

			next();
		} catch (error) {
			res.status(500).json("Server Error!");
		}
	}
};
