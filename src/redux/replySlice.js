import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  replies: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const GetReplyByCmt = createAsyncThunk(
  "reply/GetReplyByCmt",
  async (cmtId, thunkAPI) => {
    try {
      const response = await axios.get(`/reply/${cmtId}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// .post(`/replyPostComment/${id}`

export const SendReply = createAsyncThunk(
  "reply/SendReply",
  async ({ cmtId, payload }, thunkAPI) => {
    try {
      const response = await axios.post(`/replyPostComment/${cmtId}`, payload);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetReplyByCmt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetReplyByCmt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.replies = action.payload;
        state.isError = false;
      })
      .addCase(GetReplyByCmt.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // gui reply
      .addCase(SendReply.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SendReply.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.replies = action.payload; // Assuming action.payload contains the new reply
      })
      .addCase(SendReply.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = replySlice.actions;

export default replySlice.reducer;
