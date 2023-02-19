import "./dashboard.scss";
import { AiOutlineLock } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { useEffect, useState } from "react";
import ChangePin from "../../components/changePin/ChangePin";
import EditProfile from "../../components/editProfile/EditProfile";
import { useSelector } from "react-redux";
import ForgotPin from "../../components/forgotPin/ForgotPin";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { Link } from "react-router-dom";

const Dashboard = ({
	forgotPin,
	setForgotPin,
	isChangePin,
	setIsChangePin,
}) => {
	const [showBalance, setShowBalance] = useState(true);

	const [isEditProfile, setIsEditProfile] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(false);

	const [pinExists, setPinExists] = useState(false);

	const { currentUser } = useSelector((state) => state.auth);

	const { loggedinUser } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const latestTransactions = transactions
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	useEffect(() => {
		if (user?.transactionPIN) {
			setPinExists(true);
		}
	}, [user?.transactionPIN]);

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
					"https://bank-app-uqei.onrender.com/api/transactions",
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

	const handleClick = () => {
		if (pinExists) {
			setForgotPin(true);
		} else {
			setIsChangePin(true);
		}
	};

	return (
		<div className="dashboard">
			<div className="details">
				<div className="detailsTop">
					<div className="accN">
						<span>Account Number:</span>
						<h1>{user?._id}</h1>
					</div>
					<div className="userInfo">
						<span>Account Name:</span>
						<h2 style={{ color: "rgb(0, 63, 0)" }}>
							{user?.firstName} {user?.lastName}{" "}
							{user?.otherName && user.otherName}
						</h2>
					</div>
					<div className="accBalance">
						<span>Accoun Balance:</span>
						<div className="balanceDiv">
							<h2 className="balance">
								$ {showBalance && <span>{user?.balance.toFixed(2)}</span>}
							</h2>
							<div
								className={showBalance ? "outerDiv" : "outerDiv notShow"}
								onClick={() => setShowBalance(!showBalance)}
							>
								<span
									className={showBalance ? "innerDiv" : "innerDiv notShow"}
								></span>
							</div>
						</div>
					</div>
				</div>
				<hr />

				<div className="item">
					<span className="itemTitle">Address:</span>
					<span className="itemDesc">{user?.address}</span>
				</div>
				<div className="item">
					<span className="itemTitle">Phone Number:</span>
					<span className="itemDesc">{user?.phone}</span>
				</div>
				<div className="item">
					<span className="itemTitle">Email:</span>
					<span className="itemDesc">{user?.email}</span>
				</div>
				<div className="item">
					<span className="itemTitle">Date of Birth:</span>
					<span className="itemDesc">
						{new Date(user?.birthday).toLocaleDateString()}
					</span>
				</div>
				<div className="item">
					<span className="itemTitle">City:</span>
					<span className="itemDesc">{user?.city}</span>
				</div>
				<div className="item">
					<span className="itemTitle">State:</span>
					<span className="itemDesc">{user?.state}</span>
				</div>
				<div className="item">
					<span className="itemTitle">Country:</span>
					<span className="itemDesc">{user?.country}</span>
				</div>
				<div className="edit">
					<div className="pinEdit" onClick={handleClick}>
						<AiOutlineLock />
						<span>{pinExists ? "Change PIN" : "Generate PIN"}</span>
					</div>
					<div className="profileEdit" onClick={() => setIsEditProfile(true)}>
						<BsPencilSquare />
						<span>Edit Profile</span>
					</div>
				</div>
			</div>

			<div className="latestTransactions">
				<h2>Latest Transactions</h2>
				{loading ? (
					<Loader />
				) : latestTransactions.length > 0 ? (
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
								{latestTransactions.map((transaction) => (
									<tr
										key={transaction._id}
										style={{
											borderLeft:
												user?._id === transaction?.sender
													? "4px solid crimson"
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
					<span>No transaction yet!</span>
				)}
			</div>
			{isChangePin && <ChangePin setIsChangePin={setIsChangePin} />}
			{forgotPin && <ForgotPin setForgotPin={setForgotPin} />}
			{isEditProfile && (
				<EditProfile setIsEditProfile={setIsEditProfile} user={user} />
			)}
		</div>
	);
};

export default Dashboard;
