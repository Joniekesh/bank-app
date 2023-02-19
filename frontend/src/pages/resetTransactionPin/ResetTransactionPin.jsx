import "./resetTransactionPin.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetTransactionPin = () => {
	const [transactionPIN, setTransactionPIN] = useState("");
	const [confirmPin, setConfirmPin] = useState("");

	const navigate = useNavigate();
	const { resetPinToken } = useParams();
	const { currentUser } = useSelector((state) => state.auth);

	const verified =
		transactionPIN.length === 4 &&
		confirmPin.length === 4 &&
		transactionPIN === confirmPin;

	const handleSubmit = async (e) => {
		e.preventDefault();

		const config = {
			headers: {
				Authorization: `Bearer ${currentUser?.token}`,
			},
		};

		if (transactionPIN !== confirmPin) {
			return toast.error("PINs do not match", { theme: "colored" });
		}

		try {
			const res = await axios.put(
				`http://localhost:5000/api/users/resetpin/${resetPinToken}`,
				{ transactionPIN, resetPinToken },
				config
			);
			if (res.status === 200) {
				toast.success(res.data.data, { theme: "colored" });
				navigate("/");
			}
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	return (
		<div className="resetTtransaction">
			<div className="container">
				<h2>Reset PIN</h2>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={transactionPIN}
						onChange={(e) => setTransactionPIN(e.target.value)}
						placeholder="Enter 4 digits PIN"
					/>
					<input
						type="text"
						value={confirmPin}
						onChange={(e) => setConfirmPin(e.target.value)}
						placeholder="Confirm PIN"
					/>
					<button
						disabled={!verified}
						className={verified ? "btn verified" : "btn"}
						type="submit"
					>
						RESET
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetTransactionPin;
