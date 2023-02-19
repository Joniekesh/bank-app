import "./footer.scss";
import { Link } from "react-router-dom";
import { AiOutlineSend } from "react-icons/ai";
import { BsArrowLeftRight } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authRedux";
import { clearUser } from "../../redux/userRedux";

const Footer = () => {
	const { loggedinUser } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearUser());
	};

	return (
		<div className="footer">
			{!user ? (
				<ul>
					<Link
						to="/register"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<li>Register</li>
					</Link>
					<Link
						to="/login"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<li>Login</li>
					</Link>
				</ul>
			) : (
				<ul>
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<li>Overview</li>
					</Link>
					<Link
						to="/sendtransaction"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<li>
							<AiOutlineSend style={{ fontSize: "20px" }} />
						</li>
					</Link>
					<Link
						to="/transactions"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<li>
							<BsArrowLeftRight style={{ fontSize: "20px" }} />
						</li>
					</Link>
					<Link
						to="/login"
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<li onClick={handleLogout}>
							<IoMdLogOut style={{ fontSize: "20px" }} />
						</li>
					</Link>
				</ul>
			)}
		</div>
	);
};

export default Footer;
