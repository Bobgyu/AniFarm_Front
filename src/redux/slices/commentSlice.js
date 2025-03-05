import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../utils/requestMethods";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8000/api";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Bearer 접두사가 이미 있는지 확인
      const tokenValue = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = tokenValue;
    }

    // 요청 전 상세 로깅
    console.log('[상세 요청 정보]', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      token: token ? token.substring(0, 20) + "..." : 'none'
    });

    return config;
  },
  (error) => {
    console.error('[요청 인터셉터 에러]', error);
    return Promise.reject(new Error('요청 준비 중 오류가 발생했습니다.'));
  }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 성공 시 상세 로깅
    console.log('[상세 응답 정보]', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    // 에러 응답 상세 로깅
    console.error('[상세 에러 정보]', {
      code: error.code,
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      },
      request: {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    if (error.code === 'ERR_NETWORK') {
      error.message = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
    } else if (error.response?.status === 500) {
      error.message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    } else if (!error.response) {
      error.message = '서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.response?.status === 401) {
      error.message = '로그인이 필요하거나 인증이 만료되었습니다.';
    }

    return Promise.reject(error);
  }
);

const initialState = {
  comments: [],
  myComments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // 로딩 상태
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // 에러 상태
    setError: (state, action) => {
      state.error = action.payload;
    },
    // 댓글 목록 설정
    setComments: (state, action) => {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    // 댓글 추가
    addComment: (state, action) => {
      state.comments.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    // 댓글 수정
    updateComment: (state, action) => {
      const { comment_id, content } = action.payload;
      const comment = state.comments.find((c) => c.comment_id === comment_id);
      if (comment) {
        comment.content = content;
        comment.updated_at = new Date().toISOString();
      }
      state.loading = false;
      state.error = null;
    },
    // 댓글 삭제
    removeComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.comment_id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    // 내 댓글 목록 설정
    setMyComments: (state, action) => {
      state.myComments = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createComment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 액션 생성자
export const {
  setLoading,
  setError,
  setComments,
  addComment,
  updateComment,
  removeComment,
  setMyComments,
} = commentSlice.actions;

// Thunk 액션 생성자
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId) => {
    const response = await axiosInstance.get(`/comments/${postId}`);
    return response.data.data;
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("로그인이 필요합니다.");
      }

      // 토큰에서 이메일 추출
      const decoded = jwtDecode(token);
      const userEmail = decoded.sub;

      const requestData = {
        post_id: parseInt(commentData.post_id),
        content: commentData.content.trim(),
        user_email: userEmail
      };

      console.log("[댓글 생성] 시작:", {
        requestData,
        token: token.substring(0, 20) + "..."
      });

      const response = await axiosInstance.post('/comments', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("[댓글 생성] 응답:", response.data);

      if (response.data.success) {
        const newComment = response.data.data;
        dispatch(addComment(newComment));
        return newComment;
      } else {
        return rejectWithValue(response.data.message || "댓글 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("[댓글 생성] API 오류:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        return rejectWithValue("인증이 만료되었습니다. 다시 로그인해주세요.");
      }
      
      return rejectWithValue(error.message || "댓글 생성 중 오류가 발생했습니다.");
    }
  }
);

export const editComment = (commentId, content, postId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const decoded = jwtDecode(token);
    const userEmail = decoded.sub;

    console.log("[댓글 수정] 요청 데이터:", {
      commentId,
      content: content.trim(),
      userEmail
    });

    const response = await axiosInstance.put(`/comments/${commentId}`, {
      content: content.trim(),
      user_email: userEmail
    });

    console.log("[댓글 수정] 응답:", response.data);

    if (response.data && response.data.success) {
      dispatch(updateComment({ 
        comment_id: commentId, 
        content: content.trim(),
        email: userEmail
      }));
      return { success: true, data: response.data };
    } else {
      throw new Error(response.data?.message || "댓글 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error("[댓글 수정] API 오류:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        params: error.config?.params
      }
    });
    
    if (error.response?.status === 401) {
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    } else if (error.response?.status === 403) {
      throw new Error("댓글을 수정할 권한이 없습니다.");
    } else if (error.response?.status === 404) {
      throw new Error("댓글을 찾을 수 없습니다.");
    } else if (error.response?.status === 422) {
      throw new Error("잘못된 요청 데이터입니다.");
    }
    
    throw new Error(error.response?.data?.message || "댓글 수정에 실패했습니다.");
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteComment = (commentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const decoded = jwtDecode(token);
    const userEmail = decoded.sub;

    const response = await axiosInstance.delete(`/comments/${commentId}`, {
      params: { user_email: userEmail }
    });

    if (response.data.success) {
      dispatch(removeComment(commentId));
      return response.data;
    } else {
      throw new Error(response.data.message || "댓글 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchMyComments = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getRequest("comments/my");
    console.log("내 댓글 조회 응답:", response);

    if (response.success) {
      dispatch(setMyComments(response.data));
    }
  } catch (error) {
    console.error("내 댓글 조회 실패:", error);
    dispatch(setError(error.message));
  }
};

export default commentSlice.reducer;
