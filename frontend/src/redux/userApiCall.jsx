import axios from "axios";
import { toast } from "react-toastify";
import {
	createPINFailure,
	createPINRequest,
	createPINSuccess,
	getUser,
	getUsers,
	updateUserFailure,
	updateUserRequest,
	updateUserSuccess,
} from "./userRedux";

export const loadUser = () => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axios.get(
			"https://bank-app-uqei.onrender.com/api/auth/me",
			config
		);
		dispatch(getUser(res.data));
	} catch (error) {
		console.log(error);
	}
};

export const getAllUsers = () => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axios.get(
			"https://bank-app-uqei.onrender.com/api/users",
			config
		);
		dispatch(getUsers(res.data));
	} catch (error) {
		console.log(error);
	}
};

export const createTransactionPin = (data) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};
	dispatch(createPINRequest());
	try {
		const res = await axios.put(
			"https://bank-app-uqei.onrender.com/api/users/pin",
			data,
			config
		);
		if (res.status === 200) {
			dispatch(loadUser());
			dispatch(createPINSuccess(res.data));
			toast.success("PIN Successfully generated.", { theme: "colored" });
		}
	} catch (err) {
		dispatch(createPINFailure(err.response.data.errors));
		const errors = err.response.data.errors;
		if (errors) {
			errors.forEach((error) => {
				return toast.error(error.msg, { theme: "colored" });
			});
		}
	}
};

export const updateUser = (data) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};
	dispatch(updateUserRequest());
	try {
		const res = await axios.put(
			"https://bank-app-uqei.onrender.com/api/users/me",
			data,
			config
		);
		if (res.status === 200) {
			dispatch(loadUser());
			dispatch(updateUserSuccess(res.data));
			toast.success("User updated.", { theme: "colored" });
		}
	} catch (err) {
		dispatch(updateUserFailure(err.response.data));
		toast.error(err.response.data, { theme: "colored" });
	}
};
