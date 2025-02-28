import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import sales from "../../assets/images/sales.jpg";  // 기본 이미지 필요
import trend from "../../assets/images/trend.jpg";  // 소비트렌드 이미지
import prediction from "../../assets/images/prediction.jpg";  // 가격예측 이미지

const Sale = () => {
  const [hoveredContent, setHoveredContent] = useState(null);
  const [showDefaultContent, setShowDefaultContent] = useState(false);

  const contentMap = {
    trend: {
      image: trend,
    },
    prediction: {
      image: prediction,
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
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-8 cursor-pointer"
            onMouseEnter={handleTitleHover}
            onMouseLeave={handleTitleLeave}
          >
            판매하기
          </h1>
        </div>

        <div className="flex gap-8">
          {/* 왼쪽 네비게이션 메뉴 */}
          <div className="flex flex-col gap-8 w-64">
            {/* 소비트렌드 카드 */}
            <Link to="/pricingInformation">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('trend')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    소비트렌드
                  </h3>
                </div>
              </motion.div>
            </Link>

            {/* 가격예측 카드 */}
            <Link to="/sellInformation">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleMouseEnter('prediction')}
                onMouseLeave={handleMouseLeave}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    가격예측
                  </h3>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="relative overflow-hidden w-full h-[600px]">
            {showDefaultContent ? (
              <div className="relative h-full">
                <img 
                  src={sales}
                  alt="기본 이미지"                 
                  className="w-full h-[600px] object-cover blur-[2px]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    농산물 판매를 위한 데이터 분석
                  </h2>
                </div>
              </div>
            ) : hoveredContent ? (
              <>
                <img 
                  src={contentMap[hoveredContent].image}
                  alt={hoveredContent}
                  className="w-full h-[600px] object-cover blur-[2px]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30" />
                <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h3 className="text-4xl font-bold text-white tracking-wider">
                    {hoveredContent === 'trend' && '실시간 소비자 트렌드와 선호도를 분석해보세요'}
                    {hoveredContent === 'prediction' && 'AI 기반 농산물 가격 예측으로 최적의 판매 시기를 찾아보세요'}
                  </h3>
                </div>
              </>
            ) : (
              <div className="relative overflow-hidden h-full">
                <img 
                  src={sales}
                  alt="기본 이미지"                 
                  className="w-full h-[600px] object-cover blur-[2px]"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-4xl font-bold text-white tracking-wider">
                    농산물 판매를 위한 데이터 분석
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

export default Sale;