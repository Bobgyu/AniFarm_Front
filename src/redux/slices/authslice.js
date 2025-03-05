import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  POST_AUTH_API_URL,
  POST_LOGIN_API_URL,
  POST_EMAIL_VERIFICATION_API_URL,
  UPDATE_AUTH_API_URL,
  DELETE_AUTH_API_URL,
} from "../../utils/apiurl.js";
import {
  postRequest,
  putRequest,
  deleteRequest,
  loginRequest,
} from "../../utils/requestMethods.js";
import axios from "axios";

// 회원가입 요청
const postAuthFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData, { rejectWithValue }) => {
    // console.log(postData);
    try {
      const options = {
        body: JSON.stringify(postData), // 표준 JSON 문자열로 변환 json 형식일 때
        // method: "POST",
        // body: postData, // json 형식이 아닐 때
      };
      const response = await postRequest(apiURL, options);
      return response; // { status, data } 형태로 반환
    } catch (error) {
      // 에러 시 상태 코드와 메시지를 포함한 값을 rejectWithValue로 전달
      return rejectWithValue(error);
    }
  });
};

export const fetchPostAuthData = postAuthFetchThunk(
  "fetchPostAuth",
  "/auth/register"
);

// 이메일 인증 요청
export const fetchPostEmailVerificationData = createAsyncThunk(
  "auth/fetchPostEmailVerificationData",
  async (email) => {
    try {
      const response = await axios.post(POST_EMAIL_VERIFICATION_API_URL, {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// 로그인 요청
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("로그인 시도:", userData);
      const response = await loginRequest(userData);
      console.log("로그인 응답:", response);
      
      if (response.success && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        return response.data;
      }
      return rejectWithValue(response.data?.message || "로그인 실패");
    } catch (error) {
      console.error("로그인 에러:", error);
      return rejectWithValue(error.response?.data?.message || "로그인 실패");
    }
  }
);

// 회원정보 수정 요청
const updateAuthFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(
    actionType,
    async (updateData, { rejectWithValue }) => {
      // console.log(updateData , apiURL);
      try {
        const options = {
          body: JSON.stringify(updateData), // 표준 json 문자열로 변환
        };
        const fullPath = `${apiURL}/${updateData.id}`;
        const response = await putRequest(fullPath, options);
        return response;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
};

export const fetchUpdateAuthData = updateAuthFetchThunk(
  "fetchUpdateAuth",
  "/auth/update-password"
);

// 회원정보 삭제 요청
const deleteAuthFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (id) => {
    console.log("삭제 요청 URL:", `${apiURL}/${id}`);
    console.log("삭제할 ID:", id);
    const options = {
      method: "DELETE",
    };
    const fullPath = `${apiURL}/${id}`;
    return await deleteRequest(fullPath, options);
  });
};

export const fetchDeleteAuthData = deleteAuthFetchThunk(
  "fetchDeleteAuth",
  "/auth/user"
);

// 마이페이지 데이터 조회 액션 추가
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// handleFulfilled 함수 정의 : 요청 성공 시 상태 업데이트 로직을 별도의 함수로 분리
const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload; // action.payload에 응답 데이터가 들어있음
};

// handleRejected 함수 정의 : 요청 실패 시 상태 업데이트 로직을 별도의 함수로 분리
const handleRejected = (state, action) => {
  // console.log('Error', action.payload);
  state.isError = true;
  state.errorMessage = action.payload?.msg || "Something went wrong";
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    postAuthData: null,
    postLoginData: null,
    verificationCode: null,
    isEmailVerified: false,
    isError: false,
    errorMessage: null,
    deleteAuthData: null,
    updateAuthData: null,
    loginExpireTime: null,
    loading: false,
    user: null,
    isAuthenticated: false,
    userInfo: null,
    userInfoLoading: false,
    userInfoError: null,
  },
  reducers: {
    verifyEmail: (state, action) => {
      // if (state.verificationCode === action.payload.data.verificationCode) {
      state.isEmailVerified = true;
      // }
    },
    resetAuthState: (state) => {
      state.verificationCode = null;
      state.isEmailVerified = false;
    },
    cancelMembership: (state) => {
      state.postLoginData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    logout: (state) => {
      // Redux 상태 초기화
      state.postLoginData = null;
      state.loginExpireTime = null;
      state.isEmailVerified = false;
      state.verificationCode = null;
      state.deleteAuthData = null;
      state.updateAuthData = null;
      state.isError = false;
      state.errorMessage = null;

      // localStorage 완전 정리
      localStorage.clear(); // 모든 데이터 삭제

      // 필요한 경우 sessionStorage도 정리
      sessionStorage.clear();
    },
    checkLoginStatus: (state) => {
      const expireTime = localStorage.getItem("loginExpireTime");
      if (expireTime && new Date().getTime() > parseInt(expireTime)) {
        state.postLoginData = null;
        state.loginExpireTime = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("loginExpireTime");
      }
    },
    setLoginExpireTime: (state) => {
      const expireTime = new Date();
      expireTime.setHours(expireTime.getHours() + 24);
      state.loginExpireTime = expireTime.getTime();
      localStorage.setItem("loginExpireTime", expireTime.getTime());
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPostAuthData.fulfilled, handleFulfilled("postAuthData"))
      .addCase(fetchPostAuthData.rejected, handleRejected)

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.postLoginData = action.payload;
        const expireTime = new Date();
        expireTime.setHours(expireTime.getHours() + 24);
        state.loginExpireTime = expireTime.getTime();
        localStorage.setItem("loginExpireTime", expireTime.getTime());
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostEmailVerificationData.fulfilled, (state, action) => {
        state.verificationCode = action.payload;
      })
      .addCase(fetchPostEmailVerificationData.rejected, handleRejected)

      .addCase(fetchDeleteAuthData.fulfilled, (state, action) => {
        state.deleteAuthData = action.payload;
        state.postLoginData = null;
      })
      .addCase(fetchDeleteAuthData.rejected, handleRejected)

      .addCase(fetchUpdateAuthData.fulfilled, (state, action) => {
        state.updateAuthData = action.payload;
      })
      .addCase(fetchUpdateAuthData.rejected, handleRejected)

      .addCase(fetchUserInfo.pending, (state) => {
        state.userInfoLoading = true;
        state.userInfoError = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfoLoading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.userInfoLoading = false;
        state.userInfoError = action.payload;
      });
  },
});

export const {
  verifyEmail,
  resetAuthState,
  cancelMembership,
  logout,
  checkLoginStatus,
  setLoginExpireTime,
} = authSlice.actions;
export default authSlice.reducer;
