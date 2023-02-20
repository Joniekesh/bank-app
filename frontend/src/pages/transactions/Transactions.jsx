import axios from "axios";
import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import "./transactions.scss";

const Transactions = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);

	const { currentUser } = useSelector((state) => state.auth);

	const { loggedinUser } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					`https://bank-app-uqei.onrender.com/api/transactions`,
					config
				);
				setTransactions(res.data);
				setLoading(false);
			} catch (err) {
				toast.error(err.response.data);
				setLoading(false);
			}
		};
		fetchTransactions();
	}, []);

	return (
		<div className="transactions">
			<div className="container">
				<h2>All Transactions</h2>
				{loading ? (
					<Loader />
				) : transactions.length > 0 ? (
					<div className="responsiveTable">
						<table>
							<thead>
								<tr>
									<th>Transaction ID</th>
									<th>Sender</th>
									<th>Amount</th>
									<th>Date</th>
									<th>Receiver</th>
									<th>Action</th>
								</tr>
							</thead>

							<tbody>
								{transactions.map((transaction) => (
									<tr
										key={transaction._id}
										style={{
											borderLeft:
												user?._id === transaction?.sender
													? "4px solid red"
													: "4px solid green",
										}}
									>
										<td>{transaction._id.slice(0, 10)}...</td>
										<td>{transaction.sender}</td>
										<td
											style={{
												color:
													user?._id === transaction?.sender
														? "crimson"
														: "green",
												fontWeight: "bold",
											}}
										>
											{transaction.amount.toFixed(2)}
										</td>
										<td>
											{new Date(transaction.createdAt).toLocaleDateString()}
										</td>
										<td>{transaction.receiverId}</td>
										<td
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<Link
												to={`/transactions/${transaction._id}`}
												style={{ color: "inherit", textDecoration: "none" }}
											>
												<FiEye
													style={{
														border:
															user?._id === transaction?.sender
																? "1px solid crimson"
																: "1px solid green",
														fontSize: "20px",
														height: "20px",
														width: "30px",
														cursor: "pointer",
													}}
												/>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<span className="empty">No transaction yet!</span>
				)}
			</div>
		</div>
	);
};

export default Transactions;
