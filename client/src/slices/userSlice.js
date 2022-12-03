import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userEmail: "",
    name: "",
    homeAddress: "",
    rewardsPoints: ""
  },
  reducers: {
    loadUserData(state, action){
      const payload = action.payload;
      state.userEmail = payload.userEmail;
      state.name = payload.name;
      state.homeAddress = payload.homeAddress;
      state.rewardsPoints = payload.rewardsPoints;
    },
    eraseUserData(state, action){
      state.userEmail = "";
      state.name = "";
      state.homeAddress = "";
      state.rewardsPoints = "";
    },
  },
});

export const selectUser = (state) => state.user;
export const { loadUserData, eraseUserData } = userSlice.actions;
export default userSlice.reducer;


//TODO NEXT: Oauth
