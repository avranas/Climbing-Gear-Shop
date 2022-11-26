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
  },
});

export const selectUser = (state) => state.user.user;
export const { loadUserData, eraseUserData } = userSlice.actions;
export default userSlice.reducer;

//TODO: Order success screen - make it better
//TODO: Profile page
  //View orders
  //Update profile with name, address and shit -- address will automatically be entered in checkout

//Add more items in stock path
//TODO: I need a precheckout method. Check to make sure everything looks good before charging the customer
  //quantity < amountInStock
  //
