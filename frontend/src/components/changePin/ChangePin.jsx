import "./changePin.scss";
import { MdCancel } from "react-icons/md";
import { AiTwotoneLock, AiOutlineMail } from "react-icons/ai";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransactionPin } from "../../redux/userApiCall";
import { toast } from "react-toastify";

const ChangePin = ({ setIsChangePin }) => {
	const [email, setEmail] = useState("");
	const [transactionPIN, setTransactionPIN] = useState("");
	const [confirmPin, setConfirmPin] = useState("");

	const {
		loggedinUser: { user },
	} = useSelector((state) => state.user);

	const verify =
		email &&
		transactionPIN?.length === 4 &&
		confirmPin?.length === 4 &&
		transactionPIN === confirmPin;

	const dispatch = useDispatch();
	const newPin = {
		email,
		transactionPIN,
		confirmPin,
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (user.email !== email) {
			return toast.error("Wrong email provided.", { theme: "colored" });
		}

		dispatch(createTransactionPin(newPin));
		setIsChangePin(false);
	};

	const handleClick = () => {
		setIsChangePin(false);
	};

	return (
		<div className="changePin">
			<div className="changePinContainer">
				<h2>Generate PIN</h2>
				<span onClick={handleClick}>
					<MdCancel />
				</span>
				<form onSubmit={handleSubmit}>
					<div className="formInput">
						<AiOutlineMail />
						<input
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="formInput">
						<AiTwotoneLock />
						<input
							type="text"
							placeholder="Enter 4 digit PIN"
							value={transactionPIN}
							onChange={(e) => setTransactionPIN(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<AiTwotoneLock />
						<input
							type="text"
							placeholder="Confirm 4 digits PIN"
							value={confirmPin}
							onChange={(e) => setConfirmPin(e.target.value)}
						/>
					</div>
					<button
						disabled={!verify}
						type="submit"
						className={verify ? "btn verify" : "btn"}
					>
						Generate PIN
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChangePin;
