import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const GetUserById = createAsyncThunk(
  "user/GetUserById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg || "loi";
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(GetUserById.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(GetUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Get User Login
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
