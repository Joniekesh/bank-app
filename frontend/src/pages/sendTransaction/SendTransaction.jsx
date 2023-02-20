import "./sendTransaction.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForgotPin from "../../components/forgotPin/ForgotPin";
import Loader from "../../components/loader/Loader";
import Confirmation from "../../components/confirmation/Confirmation";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loadUser } from "../../redux/userApiCall";
import ChangePin from "../../components/changePin/ChangePin";

const SendTransaction = ({
	forgotPin,
	setForgotPin,
	isChangePin,
	setIsChangePin,
}) => {
	const [receiverId, setReceiverId] = useState("");
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [PIN, setPIN] = useState("");
	const [confirm, setConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [transaction, setTransaction] = useState(null);

	const verified = receiverId && amount && description && PIN.length === 4;

	const { currentUser } = useSelector((state) => state.auth);

	const { loggedinUser, allUsers } = useSelector((state) => state.user);
	const user = loggedinUser?.user;
	const guestUser = allUsers.find((user) => user._id === receiverId);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newTransaction = {
			sender: user,
			receiverId: guestUser._id,
			amount,
			description,
			PIN,
		};

		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${currentUser?.token}`,
			},
		};
		setLoading(true);
		try {
			const res = await axios.post(
				"https://bank-app-uqei.onrender.com/api/transactions",
				newTransaction,
				config
			);
			if (res.status === 200) {
				toast.success("Transaction Successfully created.", {
					theme: "colored",
				});
				dispatch(loadUser());
				setTransaction(res.data);
				navigate("/");
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
		<div className="sendTransaction">
			<div className="container">
				<h1>Send Transaction</h1>
				<form>
					<div className="formInput">
						<label>To:Destination Account</label>
						<input
							type="text"
							placeholder="Enter destination account"
							value={receiverId}
							onChange={(e) => setReceiverId(e.target.value)}
						/>
					</div>
					{guestUser?._id === receiverId && (
						<span style={{ fontWeight: "bold", color: "green" }}>
							{guestUser?.firstName} {guestUser?.lastName}
						</span>
					)}
					<div className="formInput">
						<label>Amount:</label>
						<input
							type="number"
							placeholder="Enter amount"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							min="1"
						/>
					</div>
					<div className="formInput">
						<label>Description:</label>
						<input
							type="text"
							placeholder="Enter transaction description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<label>PIN:</label>
						<input
							type="text"
							placeholder="Enter transaction PIN"
							value={PIN}
							onChange={(e) => setPIN(e.target.value)}
						/>
					</div>
					<button
						disabled={!verified}
						className={verified ? "btn verify" : "btn"}
						onClick={handleSubmit}
					>
						{loading ? <Loader /> : "CONTINUE"}
					</button>
				</form>
				{user?.transactionpIN == "" ? (
					<span className="forgot" onClick={() => setIsChangePin(true)}>
						Generate PIN
					</span>
				) : (
					<span className="forgot" onClick={() => setForgotPin(true)}>
						Forgot PIN?
					</span>
				)}
				{confirm && (
					<Confirmation setConfirm={setConfirm} transaction={transaction} />
				)}
			</div>
			{forgotPin && <ForgotPin setForgotPin={setForgotPin} />}
			{isChangePin && <ChangePin setIsChangePin={setIsChangePin} />}
		</div>
	);
};

export default SendTransaction;
