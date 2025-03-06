import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

// 시장 데이터 가져오기
export const fetchMarketData = createAsyncThunk(
  "api/fetchMarketData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/sales`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

// Top 10 데이터 가져오기
export const fetchTop10Data = createAsyncThunk(
  "api/fetchTop10Data",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/top10`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

// 작물별 Top 10 데이터 가져오기
export const fetchCropTop10Data = createAsyncThunk(
  "api/fetchCropTop10Data",
  async (cropName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/top10/${cropName}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState: {
    marketData: null,
    top10Data: null,
    cropTop10Data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 시장 데이터
      .addCase(fetchMarketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.loading = false;
        state.marketData = action.payload;
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Top 10 데이터
      .addCase(fetchTop10Data.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTop10Data.fulfilled, (state, action) => {
        state.loading = false;
        state.top10Data = action.payload;
      })
      .addCase(fetchTop10Data.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 작물별 Top 10 데이터
      .addCase(fetchCropTop10Data.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCropTop10Data.fulfilled, (state, action) => {
        state.loading = false;
        state.cropTop10Data = action.payload;
      })
      .addCase(fetchCropTop10Data.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default apiSlice.reducer;
