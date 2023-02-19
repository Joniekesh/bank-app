import "./confirmation.scss";
import { MdCancel } from "react-icons/md";

const Confirmation = ({ setConfirm, transaction }) => {
	const handleClick = () => {
		setConfirm(false);
		window.location.replace("/");
	};

	return (
		<div className="confirmation">
			<div className="container">
				<h2>SUCCESS!</h2>
				<span className="icon" onClick={() => setConfirm(false)}>
					<MdCancel />
				</span>
				<p>Transaction Successfully completed with the following details:</p>
				<div className="items">
					<div className="item">
						<span className="key">Transaction Date:</span>
						<span className="value">
							{new Date(transaction?.transaction.createdAt).toLocaleString()}
						</span>
					</div>
					<div className="item">
						<span className="key">Amount:</span>
						<span className="value">
							$ {transaction?.transaction.amountSent}
						</span>
					</div>
					<div className="item">
						<span className="key">Source Acc no:</span>
						<span className="value">
							{transaction?.transaction.sender.senderAccount}
						</span>
					</div>
					<div className="item">
						<span className="key">Source Acc name:</span>
						<span className="value">
							{transaction?.transaction.sender.firstName}
							{""}
							{transaction?.transaction.sender.lastName}
						</span>
					</div>

					<div className="item">
						<span className="key">Beneficiary Acc no:</span>
						<span className="value">
							{transaction?.transaction.receiverAccount}
						</span>
					</div>
					<div className="item">
						<span className="key">Beneficiary Acc name:</span>
						<span className="value">
							{transaction?.transaction.receiverFirstname}
							{""}
							{transaction?.transaction.receiverLastname}
						</span>
					</div>

					<div className="item">
						<span className="key">Desc:</span>
						<span className="value">Description</span>
					</div>
				</div>
				<div className="buttons">
					<button onClick={() => setConfirm(false)} className="cancel">
						CANCEL
					</button>
					<button onClick={handleClick} className="save">
						SAVE
					</button>
				</div>
			</div>
		</div>
	);
};

export default Confirmation;
