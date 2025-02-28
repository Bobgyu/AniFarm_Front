import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authslice";

const useAutoLogout = () => {
  const dispatch = useDispatch();

  // 테스트용으로 1분으로 설정
  // const INACTIVE_TIMEOUT = 60 * 1000; // 60초 = 1분
  const INACTIVE_TIMEOUT = 2 * 60 * 60 * 1000; // 원래 설정 (2시간)

  const performLogout = useCallback(() => {
    dispatch(logout());
    localStorage.clear();
    alert("자동 로그아웃 되었습니다.");
    window.location.href = "/";
  }, [dispatch]);

  const handleUserActivity = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const expireTime = localStorage.getItem("loginExpireTime");

      if (expireTime && new Date().getTime() > parseInt(expireTime)) {
        console.log("토큰 만료 - 로그아웃 실행");
        performLogout();
      }
    }
  }, [performLogout]);

  useEffect(() => {
    let inactivityTimeout;

    const autoLogout = () => {
      console.log("비활성 시간 초과 - 자동 로그아웃 실행");
      performLogout();
      clearTimeout(inactivityTimeout);
    };

    const resetInactivityTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(autoLogout, INACTIVE_TIMEOUT);
    };

    const handleActivity = () => {
      const token = localStorage.getItem("token");
      if (token) {
        handleUserActivity();
        resetInactivityTimer();
      }
    };

    const events = ["mousemove", "keypress", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    if (localStorage.getItem("token")) {
      resetInactivityTimer();
    }

    return () => {
      clearTimeout(inactivityTimeout);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleUserActivity]);
};

export default useAutoLogout;
