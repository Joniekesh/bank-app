import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {
		loading: false,
		error: null,
		loggedinUser: null,
		allUsers: [],
	},
	reducers: {
		getUser: (state, action) => {
			state.loading = false;
			state.error = null;
			state.loggedinUser = action.payload;
		},
		getUsers: (state, action) => {
			state.loading = false;
			state.error = null;
			state.allUsers = action.payload;
		},
		createPINRequest: (state) => {
			state.loading = true;
		},
		createPINSuccess: (state, action) => {
			state.loading = false;
			state.loggedinUser = action.payload;
		},
		createPINFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		updateUserRequest: (state) => {
			state.loading = true;
		},
		updateUserSuccess: (state, action) => {
			state.loading = false;
			state.loggedinUser = action.payload;
		},
		updateUserFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearUser: (state) => {
			state.loading = false;
			state.error = null;
			state.loggedinUser = null;
		},
	},
});

export const {
	getUser,
	getUsers,
	createPINRequest,
	createPINSuccess,
	createPINFailure,
	updateUserRequest,
	updateUserSuccess,
	updateUserFailure,
	clearUser,
} = userSlice.actions;
export default userSlice.reducer;
