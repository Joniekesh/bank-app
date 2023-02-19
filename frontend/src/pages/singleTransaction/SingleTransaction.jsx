import "./singleTransaction.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";

const SingleTransaction = () => {
	const [transaction, setTransaction] = useState(null);
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	const { currentUser } = useSelector((state) => state.auth);
	const token = currentUser?.token;

	const { loggedinUser, allUsers } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const receiverAccountUser = allUsers.find(
		(user) => user._id === transaction?.receiverId
	);

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	useEffect(() => {
		const fetchTransaction = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`http://localhost:5000/api/transactions/find/${id}`,
					config
				);
				if (res.status === 200) {
					setTransaction(res.data);
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		};
		fetchTransaction();
	}, [id]);

	return (
		<div className="singleTransaction">
			{loading ? (
				<Loader />
			) : (
				<div
					className={
						transaction?.sender === user?._id ? "container red" : "container"
					}
				>
					<div className="titleContainer">
						<span>devsBank</span>
						<h2>
							{transaction?.sender === user?._id ? "Debit" : "Credit"} Alert
						</h2>
					</div>
					<div
						className={transaction?.sender === user?._id ? "top red" : "top"}
					>
						<span>{new Date(transaction?.createdAt).toDateString()} </span>
					</div>
					<div className="middle">
						<div className="item">
							<span className="key">Transaction Date:</span>
							<span className="value">
								{new Date(transaction?.createdAt).toLocaleString()}
							</span>
						</div>
						<div className="item">
							<span className="key">Debit Account:</span>
							<span className="value">
								{transaction?.sender.slice(0, 8)}******
								{transaction?.sender.slice(transaction?.sender.length - 8)}
							</span>
						</div>
						<div className="item">
							<span className="key">Credit Account:</span>
							<span className="value">{transaction?.receiverId}</span>
						</div>
						<div className="item">
							<span className="key">Beneficiary:</span>
							<span className="value">
								{receiverAccountUser?.firstName} {receiverAccountUser?.lastName}{" "}
								{receiverAccountUser?.otherName}
							</span>
						</div>
						<div className="item">
							<span className="key">Description:</span>
							<span className="value">{transaction?.description}</span>
						</div>
						<div className="item">
							<span className="key">Status:</span>
							<span
								className="value"
								style={{ color: "green", fontWeight: "bold" }}
							>
								Success
							</span>
						</div>
						<div className="item">
							<span className="key">Amount:</span>
							<span className="value">$ {transaction?.amount.toFixed(2)}</span>
						</div>
					</div>
					<div className="bottom">
						<button className="save">SAVE</button>
						<button className="cancel" onClick={() => navigate(-1)}>
							CANCEL
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default SingleTransaction;
