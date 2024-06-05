import { combineReducers } from "@reduxjs/toolkit";

import userSlice from "./userSlice";
import themSlice from "./theme";
import postSlice from "./postSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themSlice,
  posts: postSlice,
});

export { rootReducer };
