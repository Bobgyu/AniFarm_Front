import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import culture from "../../assets/images/culture.jpg";
import train from "../../assets/images/train.jpg";
import pests from "../../assets/images/pests.jpg";
import weather from "../../assets/images/weather.jpg";
import community from "../../assets/images/community.png";


const Culture = () => {
  const [hoveredContent, setHoveredContent] = useState(null);
  const [showDefaultContent, setShowDefaultContent] = useState(false);

  const contentMap = {
    training: {
      image: train,
    },
    pests: {
      image: pests,
    },
    weather: {
      image: weather,
    },
    community: {
      image: community,
    }
  };

  const handleMouseEnter = (content) => {
    setHoveredContent(content);
  };

  const handleMouseLeave = () => {
    // 빈 함수로 수정 (마우스가 떠나도 상태 유지)
  };

  const handleTitleHover = () => {
    setHoveredContent(null);
    setShowDefaultContent(true);
  };

  const handleTitleLeave = () => {
    setShowDefaultContent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12 ">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-8 cursor-pointer"
            onMouseEnter={handleTitleHover}
            onMouseLeave={handleTitleLeave}
          >
            재배하기
          </h1>
          <p className="text-xl text-gray-600 mb-12">

          </p>
        </div>

        {/* 전체 컨테이너를 flex로 변경 */}
        <div className="flex gap-8">
          {/* 왼쪽 네비게이션 메뉴 */}
          <div className="flex flex-col gap-8 w-64">
            {/* 육성법 카드 */}
            <Link to="/trainingMethod">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('training')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">육성법</h3>
                
                </div>
              </motion.div>
            </Link>

            {/* 병충해 카드 */}
            <Link to="/pests">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('pests')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">병충해</h3>
                
                </div>
              </motion.div>
            </Link>

            {/* 날씨 카드 */}
            <Link to="/test1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('weather')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🌤️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">날씨</h3>
                 
                </div>
              </motion.div>
            </Link>

            {/* 커뮤니티 카드 */}
            <Link to="/Community">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('community')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">커뮤니티</h3>
              
                </div>
              </motion.div>
            </Link>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="relative overflow-hidden w-full h-[auto]">
            {showDefaultContent ? (
              <div className="relative h-full">
                <img 
                  src={culture}
                  alt="기본 이미지"                 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    재배하기에 관한 내용
                  </h2>
                </div>
              </div>
            ) : hoveredContent ? (
              <>
                <img 
                  src={contentMap[hoveredContent].image}
                  alt={hoveredContent}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-4xl font-bold text-white tracking-wider">
                    {hoveredContent === 'training' && '육성법에 관한 내용'}
                    {hoveredContent === 'pests' && '병충해에 관한 내용'}
                    {hoveredContent === 'weather' && '날씨 정보에 관한 내용'}
                    {hoveredContent === 'community' && '커뮤니티 소개에 관한 내용'}
                  </h3>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden h-full h-[auto]">
                <img 
                  src={culture}
                  alt="기본 이미지"                 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    재배하기에 관한 내용
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Culture;