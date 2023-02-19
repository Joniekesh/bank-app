import "./navbar.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authRedux";
import { clearUser } from "../../redux/userRedux";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import Menu from "../menu/Menu";

const Navbar = () => {
	const [openMenu, setOpenMenu] = useState(false);

	const dispatch = useDispatch();

	const { loggedinUser } = useSelector((state) => state.user);
	const user = loggedinUser?.user;

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearUser());
	};

	return (
		<div className="navbar">
			<div className="navbarContainer">
				<div className="navLeft">
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<h2>apexBank</h2>
					</Link>
				</div>
				<div className="navRight">
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
								<li>Account Info</li>
							</Link>
							<Link
								to="/sendtransaction"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li>Send Transaction</li>
							</Link>
							<Link
								to="/transactions"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li>Transactions</li>
							</Link>
							<Link
								to="/login"
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<li onClick={handleLogout}>Logout</li>
							</Link>
						</ul>
					)}
				</div>
				<span className="hamburger" onClick={() => setOpenMenu(!openMenu)}>
					<GiHamburgerMenu />
				</span>
				{openMenu && <Menu setOpenMenu={setOpenMenu} />}
			</div>
		</div>
	);
};

export default Navbar;
