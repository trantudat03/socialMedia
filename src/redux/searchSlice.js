import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  results: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async ({ query, page, limit }) => {
    const response = await axios.get(`/search`, {
      params: {
        query,
        page,
        limit,
      },
    });
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSearchResults.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.results = action.payload;
      state.isError = false;
    });
    builder.addCase(fetchSearchResults.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.results = null;
      state.message = action.payload;
    });
  },
});
export const { reset } = searchSlice.actions;
export default searchSlice.reducer;
