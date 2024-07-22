import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  posts: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isNewPost: false,
  message: "",
};

export const CreatePost = createAsyncThunk(
  "post/CreatePost",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`/createPost`, payload);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const GetAllPosts = createAsyncThunk(
  "post/GetAllPosts",
  async (thunkAPI) => {
    try {
      const response = await axios.get(`/getPosts`);
      return response.data.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const GetPostPagination = createAsyncThunk(
  "post/GetPostPagination",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await axios.get(`posts?page=${page}&limit=${limit}`);
      return response.data.results.results;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

export const GetPostByUser = createAsyncThunk(
  "post/GetPostByUser",
  async ({ page, limit, idUser }, thunkAPI) => {
    try {
      const response = await axios.get(
        `/posts/${idUser}?page=${page}&limit=${limit}`
      );
      return response.data.results.results;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(GetAllPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetAllPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.posts = action.payload;
    });
    builder.addCase(GetAllPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(GetPostPagination.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetPostPagination.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.posts = action.payload;
    });
    builder.addCase(GetPostPagination.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(CreatePost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(CreatePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isNewPost = true;
      state.posts = action.payload;
    });
    builder.addCase(CreatePost.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(GetPostByUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(GetPostByUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.posts = action.payload;
    });
    builder.addCase(GetPostByUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = postSlice.actions;

export default postSlice.reducer;
