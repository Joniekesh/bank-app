import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(
	PORT,
	console.log(
		`SERVER running in ${process.env.NODE_ENV} MODE on PORT ${PORT}.`.yellow
			.bold.underline
	)
);
