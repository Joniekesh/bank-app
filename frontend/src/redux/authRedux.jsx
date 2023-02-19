import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		loading: false,
		error: null,
		currentUser: null,
	},
	reducers: {
		loginRequest: (state) => {
			state.loading = true;
			state.error = null;
			state.currentUser = null;
		},
		loginSuccess: (state, action) => {
			state.loading = false;
			state.error = null;
			state.currentUser = action.payload;
		},
		loginFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
			state.currentUser = null;
		},
		logout: (state) => {
			state.loading = false;
			state.error = null;
			state.currentUser = null;
		},
	},
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
	authSlice.actions;
export default authSlice.reducer;
