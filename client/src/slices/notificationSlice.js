import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
//A notification pops up on the screen for a few seconds, and then disappears

export const notificationDuration = 5000;

export const createNotification = (dispatch, message) => {
  const newId = uuidv4();
  dispatch({
    type: "notifications/beginNotification",
    payload: { message: message, id: newId },
  });
  setTimeout(() => {
    dispatch({ type: "notifications/endNotification", payload: { id: newId } });
  }, notificationDuration);
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    beginNotification(state, action) {
      //action.payload comes with a message, and time on screen in ms
      const payload = action.payload;
      state.notifications.push(payload);
    },
    //This function removes the notification from storage, it does not end the
    //animation
    endNotification(state, action) {
      state.notifications = state.notifications.filter(
        (i) => i.id !== action.payload.id
      );
    },
  },
});

export const selectNotifications = (state) => state.notifications.notifications;
export const { beginNotification, endNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
