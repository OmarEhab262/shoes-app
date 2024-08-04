import { createSlice } from "@reduxjs/toolkit";

const isLogged = JSON.parse(localStorage.getItem("isLogged"));
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  email: user ? user.email : null,
  password: user ? user.password : null,
  name: user ? user.name : null,
  isLogged,
  id: user ? user.id : null, // Add id to initialState if it is part of user
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const { id, email, password, name, isLogged } = action.payload;
      state.email = email;
      state.password = password;
      state.name = name;
      state.isLogged = isLogged;
      state.id = id;
    },
    clearUser(state) {
      state.email = null;
      state.password = null;
      state.name = null;
      state.isLogged = false;
      state.id = null; // Add id to clearUser as well
      // Correctly remove userId from local storage
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
