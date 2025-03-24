import { createSlice, createAction } from "@reduxjs/toolkit";
import { jwtDecode } from "../../utils/jwtDecode.js";
import { fetchDeleteAuthData } from "./authslice.js";

const initialToken = localStorage.getItem("token");
const initialState = {
  token: initialToken || null,
  user: initialToken ? jwtDecode(initialToken) : null,
  error: null,
  isLoggedIn: !!initialToken,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.user = jwtDecode(action.payload);
      state.error = null;
      localStorage.setItem("token", action.payload);
      // 로그인 만료 시간 설정 (2시간)
      const expireTime = new Date().getTime() + 2 * 60 * 60 * 1000;
      localStorage.setItem("loginExpireTime", expireTime.toString());
      state.isLoggedIn = true;
    },
    clearToken: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("loginExpireTime");
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    // 회원탈퇴 성공 시 로그인 상태 초기화
    builder.addCase(fetchDeleteAuthData.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("loginExpireTime");
      // 열람 기록 삭제
      localStorage.removeItem(`viewedMedicines_${state.user?.userId}`);
      localStorage.removeItem(`viewedNews_${state.user?.userId}`);
      state.isLoggedIn = false;
    });
  },
});

export const { setToken, clearToken } = loginSlice.actions;
export default loginSlice.reducer;
