import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  comments: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const GetAllComments = createAsyncThunk(
  "comment/GetAllComments",
  async (postId, thunkAPI) => {
    try {
      const response = await axios.get(`/comment/${postId}`);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk để gửi bình luận mới
export const SendComment = createAsyncThunk(
  "comment/SendComment",
  async ({ idPost, payload }, thunkAPI) => {
    try {
      const response = await axios.post("/comment", { idPost, ...payload });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAllComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
        state.isError = false;
        state.message = "";
      })
      .addCase(GetAllComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // gui comment
      .addCase(SendComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(SendComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload; // Giả định action.payload chứa bình luận mới
      })
      .addCase(SendComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = commentSlice.actions;

export default commentSlice.reducer;
