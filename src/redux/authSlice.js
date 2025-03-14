import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post("/login", payload);
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg || "loi";
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const Profile = createAsyncThunk("user/Profile", async (thunkAPI) => {
  try {
    const response = await axios.get("/profile");
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg || "lõi";
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const LogOut = createAsyncThunk("user/LogOut", async () => {
  await axios.post("/logout");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Get User Login
    builder.addCase(Profile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(Profile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(Profile.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    // Log Out
    builder.addCase(LogOut.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(LogOut.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = null;
    });
    builder.addCase(LogOut.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
