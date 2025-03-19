import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { checkLoginStatusThunk, updateLastActivity, logoutWithAlert } from "./redux/slices/authslice";

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
    localStorage.clear();
    store.dispatch({ type: 'auth/logout' });
    
    // 토큰 만료 알림 표시
    if (expireTime && new Date().getTime() > parseInt(expireTime)) {
      store.dispatch(logoutWithAlert({
        title: '세션 만료',
        text: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.'
      }));
    }
    
    const protectedRoutes = ['/mypage', '/profile', '/settings'];
    if (protectedRoutes.some(route => window.location.pathname.includes(route))) {
      window.location.href = '/login';
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
        store.dispatch({ type: 'auth/logout' });
        return;
      }
      await store.dispatch(checkLoginStatusThunk()).unwrap();
    } catch (error) {
      console.error('로그인 상태 체크 실패:', error);
      // 에러 발생 시 로그아웃 처리
      store.dispatch({ type: 'auth/logout' });
    }
  }, 5 * 60 * 1000);  // 5분

  // 사용자 활동 감지
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  activityEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {
      store.dispatch(updateLastActivity());
    });
  });
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
