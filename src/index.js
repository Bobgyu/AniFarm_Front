import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { checkLoginStatusThunk, updateLastActivity } from "./redux/slices/authslice";

const theme = createTheme({
  typography: {
    fontFamily: ["Gowun Dodum", "sans-serif"].join(","),
  },
});

// 페이지 최초 로드 시 localStorage 초기화
const initializeAuth = () => {
  const expireTime = localStorage.getItem("loginExpireTime");
  if (expireTime && new Date().getTime() > parseInt(expireTime)) {
    // 만료된 경우 모든 인증 관련 데이터 삭제
    localStorage.clear(); // 모든 localStorage 데이터 삭제
  }
};

// 초기화 실행
initializeAuth();

// 활동 감지 및 상태 체크 설정
const setupActivityTracking = () => {
  // 주기적으로 로그인 상태 체크 (30초마다)
  setInterval(() => {
    // console.log('로그인 상태 체크 중...');
    store.dispatch(checkLoginStatusThunk());
  }, 30 * 1000);

  // 사용자 활동 감지
  const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  activityEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {
      // console.log(`${eventType} 이벤트 감지됨`);
      store.dispatch(updateLastActivity());
    });
  });

  // console.log('활동 감지 설정 완료');
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
