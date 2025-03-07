import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Test6 from "../test/Test6";
import Test7 from "../test/Test7";
import { LuDot } from "react-icons/lu";

const Home = () => {
  const [currentView, setCurrentView] = useState("home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentView("test6");
    }, 5000); // 5초 후 Test6으로 변경

    return () => clearTimeout(timer);
  }, [currentView]);

  const handleDotClick = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="w-full h-[700px] overflow-hidden relative">
      {currentView === "home" && (
        <motion.div
          className="relative h-[700px] bg-cover bg-center"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            scale: {
              duration: 1.8,
            },
          }}
          style={{
            backgroundImage: `url('https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">AnI Farm</h1>
                <p className="text-xl mb-4">
                  AI로 심고, 데이터로 키우는 당신을 위한 smart한 농사의 시작
                </p>
                <p className="text-l">
                  지혜가 모이고 소통하는 공간, 함께 키워가는 AI 농업 커뮤니티
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
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
      {currentView === "test7" && (
        <Test7 onReturnHome={() => setCurrentView("home")} handleDotClick={handleDotClick} />
      )}
    </div>
  );
};

export default Home;
