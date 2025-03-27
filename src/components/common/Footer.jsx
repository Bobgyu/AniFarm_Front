import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AnifarmLogo from "../../assets/main/aniform.png";

const Footer = () => {
  const navigate = useNavigate();

  const handleCropQuiz = () => {
    navigate("/CropQuiz");
  };
  const handleQuizData = () => {
    navigate("/QuizData");
  };

  return (
    <footer className="flex items-center md:justify-center border-t w-full h-32 md:h-24">
      <div className="w-full flex-1 md:max-w-7xl px-0 md:px-4">
        <div className="flex justify-between items-center w-full h-full">
          {/* 로고 및 주소 정보 */}
          <div className="flex items-center">
            <img src={AnifarmLogo} alt="Logo" className="w-[40px] mr-4 ml-2" />
            <p className="text-sm text-gray-600 text-left">
              (08503) 서울 금천구 가산디지털2로 144 현대테라타워 가산DK A동 20층
              <br className="hidden md:block" />
              대표전화: 02-2038-0800 | FAX: 02-000-0000
            </p>
            <Link to="/business-simulation">경영모의계산</Link>
          </div>

          {/* 버튼 섹션 */}
          <div className="flex gap-4">
            <button
              onClick={handleCropQuiz}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
            >
              Crop Quiz
            </button>
            <button
              onClick={handleQuizData}
              className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            >
              Crop Data
            </button>
          </div>

          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Copyright © 2025 AnIfarm All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
