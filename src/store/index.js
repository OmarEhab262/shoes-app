// src/store/index.js (or wherever your store is configured)

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import your user slice

const store = configureStore({
  reducer: {
    user: userReducer, // Add your user reducer here
  },
});

export default store;
