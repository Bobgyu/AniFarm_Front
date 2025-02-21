import React from "react";
import { Link } from "react-router-dom";
import { FaSeedling, FaWater, FaSun, FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion"; // npm install framer-motion 설치해야합니다.
import tomatoes from '../../assets/images/tomatoes.jpg';
import lettuce from '../../assets/images/lettuce.jpg';
import carrot from '../../assets/images/carrot.jpg';

const TrainingMethod = () => {
  const methods = [
    {
      icon: <FaSeedling className="text-4xl text-green-600" />,
      title: "파종 관리",
      description: "재배하고자 하는 작물의 특성을 파악하세요",
    },
    {
      icon: <FaWater className="text-4xl text-blue-500" />,
      title: "초기 관리",
      description: "최적의 생육 조건과 환경 관리법을 확인하세요",
    },
    {
      icon: <FaSun className="text-4xl text-yellow-500" />,
      title: "생육 관리",
      description: "작물의 성장 단계별 관리 방법을 배우세요",
    },
    {
      icon: <FaLeaf className="text-4xl text-green-500" />,
      title: "수확 관리",
      description: "적절한 수확 시기와 방법을 알아보세요",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* 히어로 섹션 */}
      <div className="relative h-[60vh] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            작물 육성법
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            재배 가이드
          </motion.p>
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/trainingDetail" state={{ selectedCrop: 'crop1' }}>
              <img 
                src={tomatoes}
                alt="토마토" 
                className="w-96 h-64 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <Link to="/trainingDetail" state={{ selectedCrop: 'crop2' }}>
              <img 
                src={lettuce}
                alt="상추" 
                className="w-96 h-64 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <Link to="/trainingDetail" state={{ selectedCrop: 'crop5' }}>
              <img 
                src={carrot}
                alt="당근" 
                className="w-96 h-64 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/trainingDetail">
              <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg">
                자세히 알아보기
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 주요 육성 방법 섹션 */}
      <div className="w-full max-w-[1280px] px-4 mx-auto pb-12 pt-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          주요 육성 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {methods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{method.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-600">{method.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8">
            전문가의 도움을 받아 더 나은 농작물을 기르세요
          </p>
          <Link to="/trainingDetail">
            <button className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300">
              육성 가이드 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingMethod;