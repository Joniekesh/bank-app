import "./login.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import ForgotPassword from "../../components/forgotPassword/ForgotPassword";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authApiCall";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isForgotPassword, setIsForgotPassword] = useState(false);

	const verify = email && password.length >= 6;

	const dispatch = useDispatch();

	const { loading } = useSelector((state) => state.auth);

	const handleSubmit = async (e) => {
		e.preventDefault();

		dispatch(login({ email, password }));
	};

	return (
		<div className="login">
			<div className="container">
				<div className="left">
					<h1>Welcome Back</h1>
					<h2>Login</h2>
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
						<button
							disabled={!email || password.length < 6}
							type="submit"
							className={verify ? "btn verify" : "btn"}
						>
							{loading ? <Loader /> : "Login"}
						</button>
					</form>
					<span className="forgot" onClick={() => setIsForgotPassword(true)}>
						Forgot Password?
					</span>
					<div className="noAccount">
						Don't have an account? <br />
						<span>
							<Link to="/register">Create account</Link>
						</span>
					</div>
				</div>
			</div>
			{isForgotPassword && (
				<ForgotPassword setIsForgotPassword={setIsForgotPassword} />
			)}
		</div>
	);
};

export default Login;
