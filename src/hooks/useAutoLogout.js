import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logoutWithAlert } from "../redux/slices/authslice";
import Swal from "sweetalert2";

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000; // 24시간

  const handleLogout = useCallback(() => {
    dispatch(logoutWithAlert({
      title: '세션 만료',
      text: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.'
    }));
  }, [dispatch]);

  useEffect(() => {
    let inactivityTimeout;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      const expireTime = localStorage.getItem("tokenExpiry");
      
      if (token && expireTime && new Date().getTime() > parseInt(expireTime)) {
        handleLogout();
        return true;
      }
      return false;
    };

    const resetInactivityTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        if (!checkTokenExpiration()) {
          Swal.fire({
            icon: 'warning',
            title: '자동 로그아웃',
            text: '장시간 활동이 없어 자동 로그아웃되었습니다.',
            confirmButtonText: '확인'
          }).then(() => {
            handleLogout();
          });
        }
      }, TOKEN_EXPIRE_TIME);
    };

    const handleActivity = () => {
      if (!checkTokenExpiration()) {
        resetInactivityTimer();
      }
    };

    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // 초기 타이머 설정
    if (localStorage.getItem("token")) {
      resetInactivityTimer();
    }

    return () => {
      clearTimeout(inactivityTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleLogout, TOKEN_EXPIRE_TIME]);

  return null;
};

export default useAutoLogout;
