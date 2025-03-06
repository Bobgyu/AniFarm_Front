import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Home = () => {
  const [currentView, setCurrentView] = useState("home");

  useEffect(() => {
    let timer;
    if (currentView === "home") {
      timer = setTimeout(() => setCurrentView("test6"), 5000);
    } else if (currentView === "test6") {
      timer = setTimeout(() => setCurrentView("test7"), 5000);
    } else if (currentView === "test7") {
      timer = setTimeout(() => setCurrentView("home"), 5000);
    }

    return () => clearTimeout(timer);
  }, [currentView]);

  return (
    <div className="w-full h-[700px]">
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
        {/* 재배하기 화면*/}
      {currentView === "test6" && (
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
            backgroundImage: `url('https://cdn.pixabay.com/photo/2021/10/19/09/42/field-6723115_1280.jpg')`,
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
      {/* 판매하기 화면*/}
      {currentView === "test7" && (
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
            backgroundImage: `url('https://cdn.pixabay.com/photo/2021/10/19/09/42/field-6723115_1280.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
              <div className="text-white text-center">
                {/* Add any specific content for Test7 here */}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
