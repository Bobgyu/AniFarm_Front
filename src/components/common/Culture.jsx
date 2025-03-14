import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import culture from "../../assets/images/culture.jpg";
import train from "../../assets/images/train.jpg";
import pests from "../../assets/images/pests.jpg";
import weather from "../../assets/images/weather.jpg";
import community from "../../assets/images/community.png";

const Culture = () => {
    // 호버 기능
  const [hoveredContent, setHoveredContent] = useState(null);
  const imageRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const contentMap = useMemo(() => ({
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
    },
  }), []);

  const handleMouseEnter = (content) => {
    setHoveredContent(content);
  };

  const handleTitleHover = () => {
    setHoveredContent(null);
  };

  // 이미지 프리로딩
  useEffect(() => {
    const preloadImages = () => {
      const imagePromises = Object.values(contentMap).map((content) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = content.image;
          img.onload = resolve;
          img.onerror = resolve; // 이미지 로딩 실패 시에도 resolve 호출
        });
      });

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    };

    preloadImages();
  }, [contentMap]);

  return (
    <div className="min-h-full py-12 mb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className="text-4xl font-bold text-gray-900 mb-8 cursor-pointer"
            onMouseEnter={handleTitleHover}
          >
            재배하기
          </h1>
        </div>

        {/* 전체 컨테이너를 flex로 변경 */}
        <div className="flex gap-8">
          {/* 왼쪽 네비게이션 메뉴 */}
          <div className="flex flex-col gap-8 w-64">
            {/* 육성법 카드 */}
            <Link to="/trainingMethod">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleMouseEnter("training")}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    육성법
                  </h3>
                </div>
              </motion.div>
            </Link>

            {/* 병충해 카드 */}
            <Link to="/pests">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleMouseEnter("pests")}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    병충해
                  </h3>
                </div>
              </motion.div>
            </Link>

            {/* 날씨 카드 */}
            <Link to="/weather">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleMouseEnter("weather")}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">🌤️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    날씨
                  </h3>
                </div>
              </motion.div>
            </Link>

            {/* 커뮤니티 카드 */}
            <Link to="/community/gardening">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => handleMouseEnter("community")}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-3xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    커뮤니티
                  </h3>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="relative overflow-hidden w-full h-[650px] rounded-lg">
            {imagesLoaded ? (
              <img
                ref={imageRef}
                src={hoveredContent ? contentMap[hoveredContent].image : culture}
                alt={hoveredContent || "기본 이미지"}
                className="w-full h-[650px] object-cover blur-[2px]"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-white">
                <h2 className="text-2xl font-bold text-gray-500">
                  이미지 로딩 중...
                </h2>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20" />
            <div className="absolute top-1/2 left-1/2 w-full transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h2 className="text-4xl font-bold text-white tracking-wider">
                {!hoveredContent
                  ? "작물 재배에 필요한 정보 수집"
                  : hoveredContent === "training"
                  ? "작물의 성장 단계별 관리를 확인 해보세요."
                  : hoveredContent === "pests"
                  ? "작물 재배 시 위협되는 병충해를 진단 해보세요."
                  : hoveredContent === "weather"
                  ? "실시간 날씨 정보를 알아보세요."
                  : hoveredContent === "community"
                  ? "다른 농부들과 의견을 공유하고, 경험을 나눠보세요."
                  : "재배하기에 관한 내용"}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Culture;
