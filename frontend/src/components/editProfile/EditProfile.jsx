import "./editProfile.scss";
import { MdCancel } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/userApiCall";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfile = ({ setIsEditProfile, user }) => {
	const [email, setEmail] = useState(user?.email);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [phone, setPhone] = useState(user?.phone);
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return toast.error("Passwords do not match", { theme: "colored" });
		}

		dispatch(updateUser({ email, password, phone }));
		navigate("/");
		setIsEditProfile(false);
	};

	return (
		<div className="editProfile">
			<div className="editProfileContainer">
				<h2>Update your Info</h2>
				<span onClick={() => setIsEditProfile(false)}>
					<MdCancel />
				</span>
				<form onSubmit={handleSubmit}>
					<div className="formInput">
						<input
							type="email"
							placeholder="Email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<input
							type="text"
							placeholder="Phone"
							name="phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<div className="formInputContainer">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<AiOutlineEye
								style={{
									fontWeight: "bold",
									cursor: "pointer",
									fontSize: "18px",
								}}
								onClick={() => setShowPassword(!showPassword)}
							/>
						</div>
					</div>
					<div className="formInput">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Confirm Password"
							name="confirmPassword"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<button type="submit" className="btn">
						Update
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
