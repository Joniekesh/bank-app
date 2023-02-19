import "./forgotPassword.scss";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";

const ForgotPassword = ({ setIsForgotPassword }) => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"http://localhost:5000/api/auth/forgotpassword",
				{ email }
			);
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
			}
			setLoading(false);
		} catch (err) {
			setLoading(false);
			const errors = err.response.data.errors;

			if (errors) {
				errors.forEach((error) => {
					return toast.error(error.msg, { theme: "colored" });
				});
			}
		}
	};

	return (
		<div className="forgotPassword">
			<div className="forgotPasswordContainer">
				<h2>Forgot Password</h2>
				<span onClick={() => setIsForgotPassword(false)}>
					<MdCancel />
				</span>
				<p>
					Please provide the email address you registered with. We will send you
					a reset link.
				</p>
				<form onSubmit={handleSubmit}>
					<div className="formInput">
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button
						disabled={!email}
						className={email ? "btn verified" : "btn"}
						type="submit"
					>
						{loading ? <Loader /> : "Send"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
