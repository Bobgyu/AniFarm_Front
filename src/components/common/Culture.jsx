import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

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
                  <p className="text-gray-600">
                    최적화된 작물 육성 방법을 확인하고 관리하세요
                  </p>
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
                  <p className="text-gray-600">
                    AI가 분석하는 병충해 진단 및 해결책을 확인하세요
                  </p>
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
                  <p className="text-gray-600">
                    실시간 날씨 정보와 농작물 가격 예측을 확인하세요
                  </p>
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
                  <p className="text-gray-600">
                    다른 농부들과 정보를 공유하고 소통하세요
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-6 min-h-[500px]">
            <div id="contentArea" className="w-full h-full flex flex-col items-center justify-center">
              {hoveredContent ? (
                <>
                  <img 
                    src={contentMap[hoveredContent].image}
                    alt={hoveredContent}
                    className="w-full h-[300px] object-contain mb-4"
                  />
                  <p className="text-lg text-gray-700 text-center">
                    {contentMap[hoveredContent].text}
                  </p>
                </>
              ) : (
                <p className="text-lg text-gray-500">
                  왼쪽의 메뉴에 마우스를 올려보세요
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Culture;