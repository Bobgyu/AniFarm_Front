import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  putRequest,
  loginRequest,
} from "../../utils/requestMethods.js";
import axios from "axios";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8000";

// 회원가입 요청
export const postAuthFetchThunk = (type, url) => {
  return createAsyncThunk(type, async (value, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}${url}`, {
        email: value.email,
        password: value.password,
        birth_date: value.birth_date || null
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (err) {
      if (err.response) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ message: err.message });
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
  async (email, { rejectWithValue }) => {
    try {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Swal.fire({
          icon: 'error',
          title: '올바른 이메일 형식이 아닙니다.',
          showConfirmButton: false,
          timer: 1500
        });
        return rejectWithValue("올바른 이메일 형식이 아닙니다.");
      }

      const response = await axios.post(`${BASE_URL}/auth/verify-email?email=${encodeURIComponent(email)}`, null, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        Swal.fire({
          icon: 'error',
          title: '이메일 인증 요청에 실패했습니다.',
          showConfirmButton: false,
          timer: 1500
        });
        return rejectWithValue(response.data.message || "이메일 인증 요청에 실패했습니다.");
      }

      return response.data;
    } catch (error) {
      // console.error("이메일 인증 요청 실패:", error);
      if (error.response?.status === 422) {
        Swal.fire({
          icon: 'error',
          title: '올바른 이메일 형식이 아닙니다.',
          showConfirmButton: false,
          timer: 1500
        });
        return rejectWithValue("올바른 이메일 형식이 아닙니다.");
      }
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "이메일 인증 요청에 실패했습니다."
      );
    }
  }
);

// 로그인 요청
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await loginRequest(userData);
      
      if (response.success && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        const expiry = new Date().getTime() + 12 * 60 * 60 * 1000; // 12시간으로 연장
        localStorage.setItem("tokenExpiry", expiry.toString());
        return response.data;
      }
      return rejectWithValue(response.data?.message || "로그인 실패");
    } catch (error) {
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

export const fetchUpdateAuthData = createAsyncThunk(
  "auth/updatePassword",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/update-password`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    }
  }
);

// 회원정보 삭제 요청
export const fetchDeleteAuthData = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await axios.delete(`${BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        "회원 탈퇴에 실패했습니다."
      );
    }
  }
);

// 마이페이지 데이터 조회 액션 추가
export const fetchUserInfo = createAsyncThunk(
  "auth/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await axios.get(`${BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        Swal.fire({
          icon: 'error',
          title: '인증이 만료되었습니다. 다시 로그인해주세요.',
          showConfirmButton: false,
          timer: 1500
        });
        return rejectWithValue("인증이 만료되었습니다. 다시 로그인해주세요.");
      }
      return rejectWithValue(error.response?.data?.message || "사용자 정보를 가져오는데 실패했습니다.");
    }
  }
);

// 비동기 로그아웃 처리를 위한 thunk
export const logoutWithAlert = createAsyncThunk(
  'auth/logoutWithAlert',
  async (message) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '자동 로그아웃',
      text: '장시간 활동이 없어 자동 로그아웃되었습니다.',
      confirmButtonText: '확인',
      allowOutsideClick: false,
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
      performLogout();
      window.location.href = '/login';
    }
    return true;
  }
);

// 토큰 체크 로직 수정
export const checkLoginStatusThunk = createAsyncThunk(
  'auth/checkLoginStatusThunk',
  async (_, { dispatch, getState }) => {
    const state = getState().auth;
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const now = new Date().getTime();

    if (!token || !tokenExpiry) {
      await Swal.fire({
        icon: 'warning',
        title: '로그인이 필요합니다',
        text: '다시 로그인해주세요.',
        confirmButtonText: '확인',
        timer: 3000,
        timerProgressBar: true,
      });
      dispatch(logout());
      return;
    }

    if (parseInt(tokenExpiry) - now < 30 * 60 * 1000) {
      try {
        await dispatch(refreshToken()).unwrap();
        return;
      } catch (error) {
        if (parseInt(tokenExpiry) < now) {
          await Swal.fire({
            icon: 'warning',
            title: '토큰 만료',
            text: '다시 로그인해주세요.',
            confirmButtonText: '확인',
            timer: 3000,
            timerProgressBar: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
          await dispatch(logoutWithAlert());
        }
        return;
      }
    }

    const lastActivity = state.lastActivity || now;
    const inactivityLimit = 4 * 60 * 60 * 1000;

    if (now - lastActivity > inactivityLimit) {
      await Swal.fire({
        icon: 'warning',
        title: '자동 로그아웃',
        text: '장시간 활동이 없어 자동 로그아웃됩니다.',
        confirmButtonText: '확인',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
      await dispatch(logoutWithAlert());
    }
  }
);

// 토큰 만료 15분 전에 자동 갱신하는 로직 추가 제안
export const checkTokenExpiration = createAsyncThunk(
  'auth/checkTokenExpiration',
  async (_, { dispatch }) => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const now = new Date().getTime();
    const timeToExpiry = parseInt(tokenExpiry) - now;
    
    if (timeToExpiry < 15 * 60 * 1000) { // 15분 미만 남은 경우
      await dispatch(refreshToken());
    }
  }
);

const performLogout = async () => {
  localStorage.clear();
  sessionStorage.clear();
  
  await Swal.fire({
    icon: 'info',
    title: '로그아웃',
    text: '로그아웃되었습니다.',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  });
  
  window.location.href = '/login';
};

// handleFulfilled 함수 정의 : 요청 성공 시 상태 업데이트 로직을 별도의 함수로 분리
const handleFulfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload; // action.payload에 응답 데이터가 들어있음
};

// handleRejected 함수 수정
const handleRejected = (state, action) => {
  state.isError = true;
  state.errorMessage = action.payload?.message || "오류가 발생했습니다.";
};

// refreshToken 함수 수정
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiry', expiry.toString());
        
        await Swal.fire({
          icon: 'success',
          title: '토큰이 갱신되었습니다',
          showConfirmButton: false,
          timer: 1500
        });
        
        return response.data;
      }
      
      throw new Error('토큰 갱신 실패');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: '토큰 갱신 실패',
        text: error.response?.data?.message || '토큰 갱신에 실패했습니다.',
        confirmButtonText: '확인',
        timer: 3000,
        timerProgressBar: true
      });
      return rejectWithValue(error.response?.data || '토큰 갱신 실패');
    }
  }
);

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
    lastActivity: new Date().getTime(),
  },
  reducers: {
    verifyEmail: (state, action) => {
      if (action.payload) {
        state.verificationCode = action.payload;
        state.isEmailVerified = true;
      }
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
      state.lastActivity = null;
      state.isAuthenticated = false;
      state.user = null;
      
      performLogout();
    },
    updateLastActivity: (state) => {
      const now = new Date().getTime();
      state.lastActivity = now;
      // console.log('활동 시간 업데이트:', new Date(now).toLocaleTimeString());
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
        state.lastActivity = new Date().getTime();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.status === 401) {
          state.errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
          Swal.fire({
            icon: 'error',
            title: '인증 만료',
            text: '다시 로그인해주세요.',
            confirmButtonText: '확인',
            timer: 3000,
            timerProgressBar: true,
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          });
          return logoutWithAlert();
        }
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
      })

      .addCase(logoutWithAlert.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = false;
        }
      })
      
      .addCase(checkLoginStatusThunk.fulfilled, () => {
        // 필요한 경우 여기에 추가 작업
      });
  },
});

export const {
  verifyEmail,
  resetAuthState,
  cancelMembership,
  logout,
  updateLastActivity,
} = authSlice.actions;

export default authSlice.reducer;
