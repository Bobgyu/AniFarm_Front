import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Async Thunks
export const fetchPosts = createAsyncThunk(
  "write/fetchPosts",
  async (communityType) => {
    console.log("[writeSlice] 게시글 목록 조회 시작:", communityType);
    const response = await axiosInstance.get(
      `/api/write/community/${communityType}`
    );
    console.log("[writeSlice] 게시글 목록 조회 응답:", response.data);
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  "write/createPost",
  async (postData) => {
    console.log("[writeSlice] 게시글 작성 시작:", postData);
    const response = await axiosInstance.post(`/api/write/create`, postData);
    console.log("[writeSlice] 게시글 작성 응답:", response.data);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "write/deletePost",
  async (postId) => {
    try {
      console.log("[writeSlice] 게시글 삭제 시작:", postId);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
      }
      
      const response = await axiosInstance.delete(`/api/write/${postId}`);
      console.log("[writeSlice] 게시글 삭제 응답:", response.data);
      return postId;
    } catch (error) {
      console.error("[writeSlice] 게시글 삭제 중 오류 발생:", error);
      if (error.response?.status === 401) {
        throw new Error("로그인이 필요하거나 인증이 만료되었습니다. 다시 로그인해주세요.");
      }
      throw error;
    }
  }
);

const writeSlice = createSlice({
  name: "write",
  initialState: {
    posts: {
      data: [],
      success: false,
      message: null,
    },
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 게시글 목록 조회
      .addCase(fetchPosts.pending, (state) => {
        console.log("[writeSlice] 게시글 목록 조회 중...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log("[writeSlice] 게시글 목록 조회 성공:", action.payload);
        state.loading = false;
        if (action.payload.success) {
          state.posts = {
            data: action.payload.data || [],
            success: true,
            message: null
          };
          console.log("[writeSlice] 상태 업데이트 완료:", state.posts);
        } else {
          state.posts = {
            data: [],
            success: false,
            message: action.payload.message || "게시글 목록 조회에 실패했습니다."
          };
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        console.error("[writeSlice] 게시글 목록 조회 실패:", action.payload);
        state.loading = false;
        state.error = action.payload;
        state.posts = {
          data: [],
          success: false,
          message: action.payload?.message || "게시글 목록 조회에 실패했습니다."
        };
      })
      // 게시글 작성
      .addCase(createPost.pending, (state) => {
        console.log("[writeSlice] 게시글 작성 중...");
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        console.log("[writeSlice] 게시글 작성 성공:", action.payload);
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.posts.data = [action.payload.data, ...(state.posts.data || [])];
          state.posts.success = true;
          state.posts.message = null;
        } else {
          state.posts.success = false;
          state.posts.message = action.payload.message || "게시글 작성에 실패했습니다.";
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        console.error("[writeSlice] 게시글 작성 실패:", action.payload);
        state.loading = false;
        state.error = action.payload;
        state.posts.success = false;
        state.posts.message = action.payload?.message || "게시글 작성에 실패했습니다.";
      })
      // 게시글 삭제
      .addCase(deletePost.pending, (state) => {
        console.log("[writeSlice] 게시글 삭제 중...");
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        console.log("[writeSlice] 게시글 삭제 성공:", action.payload);
        state.loading = false;
        if (Array.isArray(state.posts.data)) {
          state.posts.data = state.posts.data.filter(
            (post) => post.post_id !== action.payload
          );
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        console.error("[writeSlice] 게시글 삭제 실패:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectPosts = (state) => state.write.posts;
export const selectCurrentPost = (state) => state.write.currentPost;
export const selectLoading = (state) => state.write.loading;
export const selectError = (state) => state.write.error;

export default writeSlice.reducer;
