import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Test7 from "./Test7";

import { LuDot } from "react-icons/lu";

const Test6 = ({ onReturnHome, handleDotClick }) => {
  const [showTest7, setShowTest7] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTest7(true); // 화면 전환을 일시적으로 중지
    }, 5000); // 5초 후 Test7으로 변경

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[700px] overflow-hidden relative">
      {showTest7 ? (
        <Test7 onReturnHome={onReturnHome} />
      ) : (
        <>
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
              backgroundImage: `url('https://cdn.pixabay.com/photo/2021/10/19/09/42/field-6723115_1280.jpg')`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <h1 className="text-4xl font-bold mb-4">재배하기</h1>
                  <p className="text-xl mb-4">
                    재배하기는 다양한 농업 정보를 제공합니다.
                  </p>
                  <p className="text-l">
                    작물 육성법, 병충해 이미지 분석 , 날씨 정보, 그리고 농업 커뮤니티를 통해 함께 성장하세요.
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
        </>
      )}
    </div>
  );
};

export default Test6;
