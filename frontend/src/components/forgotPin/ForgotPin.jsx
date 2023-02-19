import "./forgotPin.scss";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";

const ForgotPin = ({ setForgotPin }) => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const verified = email;

	const { currentUser } = useSelector((state) => state.auth);
	const user = currentUser?.user;

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (user.email !== email) {
			return toast.error(
				"Incorrect Email address. Please provide the email you registerd to this site.",
				{ theme: "colored" }
			);
		}

		setLoading(true);
		try {
			const res = await axios.post(
				"http://localhost:5000/api/users/forgotpin",
				{ email },
				config
			);
			setLoading(false);
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
			}
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
		<div className="forgotPin">
			<div className="forgotPinContainer">
				<h2>Forgot PIN</h2>
				<span onClick={() => setForgotPin(false)}>
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
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<button
						disabled={!verified}
						className={verified ? "btn verified" : "btn"}
						type="submit"
					>
						{loading ? <Loader /> : "Send"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPin;
