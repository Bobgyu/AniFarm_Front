import "./App.css";
import React, { useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./components/common/Home";
import Culture from "./components/common/Culture";
import Sale from "./components/common/Sale";
import Header1 from "./components/common/Header1";
import Header2 from "./components/common/Header2";
import Footer from "./components/common/Footer";
import Register from "./components/login/Register";
import Login from "./components/login/details/Login";
import Mypage from "./components/login/Mypage";
import PricingInformation from "./components/PricingInformation/PricingInformation";
import Test1 from "./components/test/Test1";
import Test2 from "./components/test/Test2";
import Test3 from "./components/test/Test3";
import Test4 from "./components/test/Test4";
import Test5 from "./components/test/Test5";
import Test6 from "./components/test/Test6";
import Community from "./components/community/Community";
import SalsesInformation from "./components/SalsesInformation/SalsesInformation";
import Pests from "./components/pests/Pests";
import TrainingMethod from "./components/trainingMethod/TrainingMethod";
import PostDetail from "./components/community/PostDetail";
import Write from "./components/community/Write";
import { useDispatch } from "react-redux";
import { logout } from "./redux/slices/authslice";
import AccordionItem from "./components/common/AccordionItem";
import TrainingDetail from "./components/trainingMethod/TrainingDetail";
import GardeningCommunity from "./components/community/GardeningCommunity";
import MarketplaceCommunity from "./components/community/MarketplaceCommunity";
import GeneralCommunity from "./components/community/GeneralCommunity";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// 새로운 컴포넌트를 만들어 Router 내부에서 useLocation을 사용
function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  // const INACTIVE_TIMEOUT = 60 * 1000; // 1분으로 변경 (테스트용)
  const INACTIVE_TIMEOUT = 2 * 60 * 60 * 1000; // 2시간으로 설정

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

    // 자동 로그아웃 함수
    const autoLogout = () => {
      console.log("비활성 시간 초과 - 자동 로그아웃 실행");
      performLogout();
      clearTimeout(inactivityTimeout);
    };

    // 타이머 리셋 함수
    const resetInactivityTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(autoLogout, INACTIVE_TIMEOUT);
      // console.log("활동 감지 - 새로운 타이머 설정");
    };

    // 이벤트 핸들러
    const handleActivity = () => {
      const token = localStorage.getItem("token");
      if (token) {
        // console.log("사용자 활동 감지");
        handleUserActivity();
        resetInactivityTimer();
      }
    };

    // 이벤트 리스너 등록
    const events = ["mousemove", "keypress", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // 초기 타이머 설정
    if (localStorage.getItem("token")) {
      resetInactivityTimer();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearTimeout(inactivityTimeout);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [handleUserActivity]);

  // 특정 페이지에서 Header2를 사용할 경로 목록
  const header2Routes = ["/trainingMethod", "/pests", "/Community"];
  const shouldUseHeader2 = header2Routes.includes(location.pathname);

  return (
    <div className="App">
      {shouldUseHeader2 ? <Header2 /> : <Header1 />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/pricingInformation" element={<PricingInformation />} />
        <Route path="/community/gardening" element={<Community />} />
        <Route path="/community/marketplace" element={<Community />} />
        <Route path="/community/freeboard" element={<Community />} />
        <Route path="/community/:postId" element={<PostDetail />} />
        <Route path="/Community/write" element={<Write />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sellInformation" element={<SalsesInformation />} />
        <Route path="/pests" element={<Pests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/trainingMethod" element={<TrainingMethod />} />
        <Route path="/trainingDetail" element={<TrainingDetail />} />
        <Route path="/test1" element={<Test1 />} />
        <Route path="/test2" element={<Test2 />} />
        <Route path="/test3" element={<Test3 />} />
        <Route path="/test4" element={<Test4 />} />
        <Route path="/test5" element={<Test5 />} />
        <Route path="/test6" element={<Test6 />} />
        <Route path="/accordionitem" element={<AccordionItem />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
