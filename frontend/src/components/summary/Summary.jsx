import "./summary.scss";
import { useLocation, useNavigate } from "react-router-dom";

const Summary = () => {
	const {
		state: { accountNo, amount, description, user },
	} = useLocation();
	console.log({ accountNo, amount, description, user });

	const navigate = useNavigate();

	return (
		<div className="summary">
			<div className="container">
				<div className="top">
					<h2>Transaction Summary</h2>
				</div>
				<div className="bottom">
					<div className="item">
						<span className="key">Receiver name:</span>
						<span className="value">
							{user.firstName} {user.lastName}
						</span>
					</div>
					<div className="item">
						<span className="key">Account number:</span>
						<span className="value">{accountNo}</span>
					</div>
					<div className="item">
						<span className="key">Amount:</span>
						<span className="value">$ {amount}</span>
					</div>
					<div className="item">
						<span className="key">Description:</span>
						<span className="value">{description}</span>
					</div>
				</div>
				<div className="buttons">
					<button className="cancel" onClick={() => navigate(-1)}>
						CANCEL
					</button>
					<button className="send">SEND</button>
				</div>
			</div>
		</div>
	);
};

export default Summary;
