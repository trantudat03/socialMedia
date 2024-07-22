import { combineReducers } from "@reduxjs/toolkit";

import themSlice from "./theme";
import postSlice from "./postSlice";
import commentSlice from "./commentSlice";
import replySlice from "./replySlice";
import authSlice from "./authSlice";
import userSlice from "./userSlice";
import searchSlice from "./searchSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themSlice,
  post: postSlice,
  comment: commentSlice,
  reply: replySlice,
  user: userSlice,
  search: searchSlice,
});

export { rootReducer };
