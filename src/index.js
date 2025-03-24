import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { checkLoginStatusThunk, updateLastActivity, logoutWithAlert, logoutAction } from "./redux/slices/authslice";

const theme = createTheme({
  typography: {
    fontFamily: ["Gowun Dodum", "sans-serif"].join(","),
  },
});

// 페이지 최초 로드 시 localStorage 초기화
const initializeAuth = () => {
  const expireTime = localStorage.getItem("loginExpireTime");
  const token = localStorage.getItem("token");
  
  if (!token || (expireTime && new Date().getTime() > parseInt(expireTime))) {
    if (expireTime && new Date().getTime() > parseInt(expireTime)) {
      store.dispatch(logoutWithAlert({
        title: '세션 만료',
        text: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.'
      }));
    } else {
      store.dispatch(logoutAction());
    }
  }
};

// 초기화 실행
initializeAuth();

// 활동 감지 및 상태 체크 설정
const setupActivityTracking = () => {
  // 상태 체크 주기를 5분으로 변경
  setInterval(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        store.dispatch(logoutWithAlert({
          title: '인증 오류',
          text: '로그인 정보가 없습니다. 다시 로그인해주세요.'
        }));
        return;
      }
      await store.dispatch(checkLoginStatusThunk()).unwrap();
    } catch (error) {
      console.error('로그인 상태 체크 실패:', error);
      store.dispatch(logoutWithAlert({
        title: '인증 오류',
        text: '로그인 상태 확인에 실패했습니다. 다시 로그인해주세요.'
      }));
    }
  }, 5 * 60 * 1000);  // 5분
};

// 초기화 실행
store.dispatch(checkLoginStatusThunk());
setupActivityTracking();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

export default theme;
