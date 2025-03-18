import "./App.css";
import React, { useEffect, useCallback, useState, useRef } from "react";
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
import Community from "./components/community/Community";
import SalsesInformation from "./components/SalsesInformation/SalsesInformation";
import Pests from "./components/pests/Pests";
import TrainingMethod from "./components/trainingMethod/TrainingMethod";
import PostDetail from "./components/community/PostDetail";
import Write from "./components/community/Write";
import { useDispatch } from "react-redux";
import TrainingDetail from "./components/trainingMethod/TrainingDetail";
import Today from "./components/Today/Today";
import useAutoLogout from "./hooks/useAutoLogout";
import { ChatIcon } from "./components/chatbot/ChatIcon";
import { ChatMsg } from "./components/chatbot/ChatMsg";
import ChatForm from "./components/chatbot/ChatForm";

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

  // 챗봇 관련 상태
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  const BACKEND_URL = "http://localhost:8000/chat";

  const generateChatResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [...prev.filter((msg) => msg.text !== "생각중..."), {role: "model", text}]);
    };

    const formattedHistory = history.map(({role, text}) => ({
      role: role === 'user' ? 'user' : 'model',
      parts: [{text:text}]
    }));
    
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents: formattedHistory})
    }

    try {
      const response = await fetch(BACKEND_URL, requestOptions);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error.message || "요청 오류가 발생했습니다.");

      const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(responseText);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatHistory]);

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
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trainingMethod" element={<TrainingMethod />} />
        <Route path="/Today" element={<Today />} />
        <Route path="/trainingDetail" element={<TrainingDetail />} />
      </Routes>
      <Footer />

      {/* 챗봇 UI */}
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button id="cb-toggler" onClick={() => setShowChatbot((prev) => !prev)}>
          <span className="material-symbols-outlined">mode_comment</span>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="cb-popup">
          <div className="cb-header">
            <div className="header-info">
              <ChatIcon />
              <h2 className="logo-text">Farming Agent Chatbot</h2>
            </div>
            <button className="material-symbols-outlined" onClick={() => setShowChatbot((prev) => !prev)}>keyboard_arrow_down</button>
          </div>
          <div className="cb-body" ref={chatBodyRef}>
            <div className="message bot-message">
              <ChatIcon />
              <p className="message-text">안녕하세요 <br /> 저는 농업 챗봇입니다. 무엇을 도와드릴까요?</p>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMsg key={index} chat={chat}/>
            ))}
          </div>
          <div className="cb-footer">
            <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateChatResponse={generateChatResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
