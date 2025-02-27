import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import culture from "../../assets/images/culture.png";

const Culture = () => {
  const [hoveredContent, setHoveredContent] = useState(null);

  const contentMap = {
    training: {
      image: "/images/training-preview.jpg",
      text: "작물 육성법에 대한 상세 정보를 확인하실 수 있습니다."
    },
    pests: {
      image: "/images/pests-preview.jpg",
      text: "병충해 진단 및 해결책을 확인하실 수 있습니다."
    },
    weather: {
      image: "/images/weather-preview.jpg",
      text: "실시간 날씨 정보와 예측 정보를 확인하실 수 있습니다."
    },
    community: {
      image: "/images/community-preview.jpg",
      text: "농부들과의 소통 공간입니다."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            스마트 농업 관리 시스템
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            AI 기반 작물 관리와 병충해 예방으로 더 나은 농작물 생산을 시작하세요
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
                onMouseEnter={() => setHoveredContent('training')}
                onMouseLeave={() => setHoveredContent(null)}
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
                onMouseEnter={() => setHoveredContent('pests')}
                onMouseLeave={() => setHoveredContent(null)}
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
                onMouseEnter={() => setHoveredContent('weather')}
                onMouseLeave={() => setHoveredContent(null)}
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
                onMouseEnter={() => setHoveredContent('community')}
                onMouseLeave={() => setHoveredContent(null)}
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
          <div className="overflow-hidden flex-1 bg-white rounded-lg shadow-lg p-2">
        
              {hoveredContent ? (
                <>
                  <div className="w-[100%] h-[80%]">  {/* 호버 시 이미지 전용 컨테이너 */}
                    <img 
                      src={contentMap[hoveredContent].image}
                      alt={hoveredContent}
                      className="w-auto h-[80%]"
                    />
                  </div>
                  <p className="text-lg text-gray-500 text-center mt-4">
                    {contentMap[hoveredContent].text}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-[100%] h-[80%]">  {/* 디폴트 이미지 전용 컨테이너 */}
                    <img 
                      src={culture}
                      alt="기본 이미지"
                      className="w-auto h-[80%]"
                    />
                  </div>
                  <p className="text-lg text-gray-500 text-center mt-4">
                    재배하기 내용
                  </p>
                </>
              )}
            </div>
  
        </div>
      </div>
    </div>
  );
};

export default Culture;