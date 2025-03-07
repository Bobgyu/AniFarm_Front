import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Home from "../common/Home";
import Test6 from "./Test6";
import { LuDot } from "react-icons/lu";

const Test7 = ({ onReturnHome, handleDotClick }) => {
  const [showHome, setShowHome] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHome(true); // 화면 전환을 일시적으로 중지
    }, 5000); // Show Home after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showHome) {
    return <Home />;
  }

  return (
    <div className="w-full h-[700px] overflow-hidden relative">
      <motion.div 
        className="relative h-[700px] bg-cover bg-center"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.5, 
          ease: "easeOut",
          scale: {
            duration: 1.8
          }
        }}
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2012/10/15/12/32/wicker-61260_1280.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-white text-center">
              <h1 className="text-4xl font-bold mb-4">판매하기</h1>
              <p className="text-xl mb-4">
                농산물 판매를 위한 데이터 분석과 AI 기반 가격 예측을 통해 최적의 판매 시기를 찾으세요.
              </p>
              <p className="text-l">
                실시간 소비자 트렌드와 선호도를 분석하고, 커뮤니티에서 직거래를 시작해보세요.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        <div className="p-2 bg-transparent border-2 border-white rounded-full flex space-x-4">
        <button onClick={() => handleDotClick("home")} className="text-white text-3xl">
          <LuDot />
        </button>
        <button onClick={() => handleDotClick("test6")} className="text-white text-3xl">
          <LuDot />
        </button>
        <button onClick={() => handleDotClick("test7")} className="text-white text-3xl">
          <LuDot />
        </button>
      </div>
      </div>
      {currentView === "test6" && (
        <Test6 onReturnHome={() => setCurrentView("home")} handleDotClick={handleDotClick} />
      )}
    </div>
      
  );
};

export default Test7;
