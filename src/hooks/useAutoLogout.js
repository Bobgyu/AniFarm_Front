import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateLastActivity, logoutWithAlert } from "../redux/slices/authslice";

const useAutoLogout = () => {
  const dispatch = useDispatch();

  // 테스트용으로 1분으로 설정
  // const INACTIVE_TIMEOUT = 60 * 1000; // 60초 = 1분
  const INACTIVE_TIMEOUT = 2 * 60 * 60 * 1000; // 원래 설정 (2시간)

  const handleUserActivity = useCallback(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const expireTime = localStorage.getItem("loginExpireTime");

      if (expireTime && new Date().getTime() > parseInt(expireTime)) {
        console.log("토큰 만료 - 로그아웃 실행");
        dispatch(logoutWithAlert({
          title: '세션 만료',
          text: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.'
        }));
      } else {
        // 유효한 토큰이 있는 경우에만 활동 시간 업데이트
        dispatch(updateLastActivity());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    let inactivityTimeout;

    const autoLogout = () => {
      console.log("비활성 시간 초과 - 자동 로그아웃 실행");
      dispatch(logoutWithAlert({
        title: '자동 로그아웃',
        text: '장시간 활동이 없어 자동 로그아웃되었습니다.'
      }));
      clearTimeout(inactivityTimeout);
    };

    const resetInactivityTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(autoLogout, INACTIVE_TIMEOUT);
    };

    const handleActivity = () => {
      handleUserActivity();
      resetInactivityTimer();
    };

    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    if (localStorage.getItem("token")) {
      resetInactivityTimer();
    }

    return () => {
      clearTimeout(inactivityTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleUserActivity, dispatch]);
};

export default useAutoLogout;
