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
import Footer from "./components/common/Footer";
import Register from "./components/login/Register";
import Login from "./components/login/details/Login";
import Mypage from "./components/login/Mypage";
import PricingInformation from "./components/PricingInformation/PricingInformation";
import Weather from "./components/weather/Weather.jsx";
import Test4 from "./components/test/Test4";
import Test5 from "./components/test/Test5";
import Test6 from "./components/test/Test6";
import Test7 from "./components/test/Test7";
import Community from "./components/community/Community";
import SalsesInformation from "./components/SalsesInformation/SalsesInformation";
import Pests from "./components/pests/Pests";
import TrainingMethod from "./components/trainingMethod/TrainingMethod";
import PostDetail from "./components/community/PostDetail";
import Write from "./components/community/Write";
import { useDispatch } from "react-redux";
import AccordionItem from "./components/common/AccordionItem";
import TrainingDetail from "./components/trainingMethod/TrainingDetail";
import Today from "./components/Today/Today";
import useAutoLogout from "./hooks/useAutoLogout";

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
  useAutoLogout(); // 커스텀 훅 사용

  return (
    <div className="App">
      <Header1 />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/pricingInformation" element={<PricingInformation />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/community/gardening" element={<Community />} />
        <Route path="/community/marketplace" element={<Community />} />
        <Route path="/community/freeboard" element={<Community />} />
        <Route path="/community/:postId" element={<PostDetail />} />
        <Route path="/Community/write" element={<Write />} />
        <Route path="/SalsesInformation" element={<SalsesInformation />} />
        <Route path="/pests" element={<Pests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/trainingMethod" element={<TrainingMethod />} />
        <Route path="/Today" element={<Today />} />
        <Route path="/trainingDetail" element={<TrainingDetail />} />
        <Route path="/accordionitem" element={<AccordionItem />} />
        <Route path="/test4" element={<Test4 />} />
        <Route path="/test5" element={<Test5 />} />
        <Route path="/test6" element={<Test6 />} />
        <Route path="/test7" element={<Test7 />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
