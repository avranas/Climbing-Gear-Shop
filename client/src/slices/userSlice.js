import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      userEmail: null,
      firstName: null,
      lastName: null,
      homeAddress: null,
      rewardsPoints: null,
      loggedIn: false
    },
  },
  reducers: {
    loadUserData(state, action){
      const payload = action.payload;
      const user = state.user;
      user.userEmail = payload.userEmail;
      user.firstName = payload.firstName;
      user.lastName = payload.lastName;
      user.homeAddress = payload.homeAddress;
      user.rewardsPoints = payload.rewardsPoints;
    },
    eraseUserData(state, action){
      const user = state.user;
      user.userEmail = null;
      user.firstName = null;
      user.lastName = null;
      user.homeAddress = null;
      user.rewardsPoints = null;
    },
    logIn(state, action){
      state.user.loggedIn = true;

    },
    logOut(state, action){
      state.user.loggedIn = false;
    }
  },
});

export const selectUser = (state) => state.user.user;
export const { loadUserData, eraseUserData, logIn, logOut } = userSlice.actions;
export default userSlice.reducer;