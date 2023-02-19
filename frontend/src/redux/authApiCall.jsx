import { loginFailure, loginRequest, loginSuccess } from "./authRedux";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllUsers, loadUser } from "./userApiCall";

export const login =
	({ email, password }) =>
	async (dispatch) => {
		dispatch(loginRequest());
		try {
			const res = await axios.post("http://localhost:5000/api/auth/login", {
				email,
				password,
			});

			dispatch(loadUser());
			dispatch(getAllUsers());
			if (res.status === 200) {
				dispatch(loginSuccess(res.data));
				toast.success("Login SUCCESS", { theme: "colored" });
			}
		} catch (err) {
			dispatch(loginFailure(err.response.data));
			const errors = err.response.data.errors;
			if (errors) {
				errors.forEach((error) => {
					return toast.error(error.msg, { theme: "colored" });
				});
			}
		}
	};
