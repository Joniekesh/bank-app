import "./register.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import Loader from "../../components/loader/Loader";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
	const [phone, setPhone] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		firstName: "",
		lastName: "",
		otherName: "",
		email: "",
		password: "",
		confirmPassword: "",
		birthday: "",
		address: "",
		city: "",
		state: "",
		country: "",
		balance: "",
	});

	const {
		firstName,
		lastName,
		otherName,
		email,
		password,
		confirmPassword,
		birthday,
		address,
		city,
		state,
		country,
		balance,
	} = inputs;

	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axios.post(
				"https://bank-app-uqei.onrender.com/api/auth",
				{
					...inputs,
					phone,
				}
			);

			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
				setInputs({});
				setPhone("");
				navigate("/login");
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
		<div className="register">
			<div className="container">
				<div className="regLeft">
					<h2>Create Account</h2>
					<form>
						<div className="formInput">
							<input
								type="text"
								placeholder="First name"
								name="firstName"
								value={firstName}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="Last name"
								name="lastName"
								value={lastName}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="Other name"
								name="otherName"
								value={otherName}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="email"
								placeholder="Email"
								name="email"
								value={email}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<div className="formInputContainer">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									name="password"
									value={password}
									onChange={handleChange}
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
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<PhoneInput
								initialValueFormat="national"
								defaultCountry="NG"
								placeholder="Enter phone number"
								international
								countryCallingCodeEditable={false}
								value={phone}
								onChange={setPhone}
								required
							/>
						</div>
						<div className="formInput">
							<input
								type="date"
								placeholder="Date of birth"
								name="birthday"
								value={birthday}
								onChange={handleChange}
								style={{ cursor: "pointer" }}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="Address"
								name="address"
								value={address}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="City"
								name="city"
								value={city}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="State"
								name="state"
								value={state}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<input
								type="text"
								placeholder="Country"
								name="country"
								value={country}
								onChange={handleChange}
							/>
						</div>
						<div className="formInput">
							<select
								name="balance"
								type="number"
								value={balance}
								onChange={handleChange}
								style={{ cursor: "pointer" }}
							>
								<option>select amount</option>
								<option value="1000">1000</option>
								<option value="2000">2000</option>
								<option value="3000">3000</option>
								<option value="4000">4000</option>
								<option value="5000">5000</option>
							</select>
						</div>
						<button onClick={handleSubmit}>
							{loading ? <Loader /> : "Create account"}
						</button>
					</form>
					Already have an account?{" "}
					<span>
						<Link to="/login">Login</Link>
					</span>
				</div>
				<div className="regRight">
					<img src="/assets/bank-logo1.jpg" alt="" />
				</div>
			</div>
		</div>
	);
};

export default Register;
