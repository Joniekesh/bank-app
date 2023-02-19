import "./app.scss";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/navbar/Navbar";
import Transactions from "./pages/transactions/Transactions";
import SingleTransaction from "./pages/singleTransaction/SingleTransaction";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import ResetTransactionPin from "./pages/resetTransactionPin/ResetTransactionPin";
import SendTransaction from "./pages/sendTransaction/SendTransaction";
import Summary from "./components/summary/Summary";
import Footer from "./components/footer/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, loadUser } from "./redux/userApiCall";

const App = () => {
	const [forgotPin, setForgotPin] = useState(false);
	const [isChangePin, setIsChangePin] = useState(false);

	const { currentUser } = useSelector((state) => state.auth);
	const user = currentUser?.user;
	const PrivateRoute = ({ children }) => {
		return user ? children : <Navigate to="/login" />;
	};

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadUser());
		dispatch(getAllUsers());
	}, [user]);

	return (
		<div className="app">
			<div>
				<ToastContainer />
			</div>
			<Router>
				<Navbar />
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute>
								<Dashboard
									setForgotPin={setForgotPin}
									forgotPin={forgotPin}
									isChangePin={isChangePin}
									setIsChangePin={setIsChangePin}
								/>
							</PrivateRoute>
						}
					></Route>
					<Route
						path="/transactions"
						element={
							<PrivateRoute>
								<Transactions />
							</PrivateRoute>
						}
					></Route>
					<Route
						path="/transactions/:id"
						element={
							<PrivateRoute>
								<SingleTransaction />
							</PrivateRoute>
						}
					></Route>
					<Route
						path="/sendtransaction"
						element={
							<PrivateRoute>
								<SendTransaction
									forgotPin={forgotPin}
									setForgotPin={setForgotPin}
									isChangePin={isChangePin}
									setIsChangePin={setIsChangePin}
								/>
							</PrivateRoute>
						}
					></Route>

					<Route
						path="/register"
						element={user ? <Dashboard /> : <Register />}
					></Route>
					<Route
						path="/login"
						element={user ? <Dashboard /> : <Login />}
					></Route>
					<Route
						path="/resetpassword/:resetToken"
						element={<ResetPassword />}
					></Route>
					<Route
						path="/resetpin/:resetPinToken"
						element={
							<PrivateRoute>
								<ResetTransactionPin />
							</PrivateRoute>
						}
					></Route>
					<Route
						path="/summary"
						element={
							<PrivateRoute>
								<Summary />
							</PrivateRoute>
						}
					></Route>
				</Routes>
				<Footer />
			</Router>
		</div>
	);
};

export default App;
