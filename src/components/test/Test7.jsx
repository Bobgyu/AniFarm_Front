import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Test7 = ({ onReturnHome }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onReturnHome();
    }, 5000); // 5초 후에 Home으로 돌아가기

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [onReturnHome]);

  return (
    <div className="w-full h-[700px]">
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
           
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Test7;
