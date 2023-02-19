import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/authRedux";
import { clearUser } from "../../redux/userRedux";
import "./menu.scss";

const Menu = ({ setOpenMenu }) => {
	const { loggedinUser } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearUser());
		setOpenMenu(false);
	};
	const handleClose = () => {
		setOpenMenu(false);
	};

	return (
		<div className="menu">
			<div className="container">
				<div className="top">
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<h3 onClick={handleClose}>apexBank</h3>
					</Link>
				</div>
				<div className="bottom">
					{!user ? (
						<ul>
							<Link
								to="/register"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleClose}>Register</li>
							</Link>
							<Link
								to="/login"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleClose}>Login</li>
							</Link>
						</ul>
					) : (
						<ul>
							<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
								<li onClick={handleClose}>Account Overview</li>
							</Link>
							<Link
								to="/sendtransaction"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleClose}>Send Transaction</li>
							</Link>
							<Link
								to="/transactions"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleClose}>Transactions</li>
							</Link>
							<Link
								to="/login"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleLogout} style={{ color: "crimson" }}>
									Logout
								</li>
							</Link>
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Menu;
