import "./resetPassword.scss";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const verified = password && confirmPassword && password === confirmPassword;

	const { resetToken } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return toast.error("Passwords do not match", { theme: "colored" });
		}

		try {
			const res = await axios.put(
				`https://bank-app-uqei.onrender.com/api/auth/resetpassword/${resetToken}`,
				{ password, resetToken }
			);
			if (res.status === 200) {
				toast.success(res.data.data, { theme: "colored" });
				navigate("/login");
			}
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	return (
		<div className="resetPassword">
			<div className="resetPasswordContainer">
				<h2>Reset Password</h2>
				<form onSubmit={handleSubmit}>
					<div className="formInput">
						<input
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<input
							type="password"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<button
						disabled={!verified}
						className={verified ? "btn verified" : "btn"}
						type="submit"
					>
						Reset
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
