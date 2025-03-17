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
    <div className="w-full h-[700px] overflow-hidden relative">
      {/* 배경 이미지 */}
      <div className="relative h-[700px] bg-cover bg-center">
        {imagesLoaded ? (
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
          >
            <img
              ref={imageRef}
              src={hoveredContent ? contentMap[hoveredContent].image : culture}
              alt={hoveredContent || "기본 이미지"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <h2 className="text-2xl font-bold text-gray-500">
              이미지 로딩 중...
            </h2>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="absolute inset-0 flex flex-col">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
            <div className="text-center mt-48">
              <h1
                className="text-4xl text-white mb-4 select-none tracking-widest drop-shadow-xl"
                onMouseEnter={handleTitleHover}
              >
                재배하기
              </h1>
              <div className="w-24 h-1 bg-white mx-auto rounded-full mb-12 opacity-80"></div>
            </div>

            {/* 중앙 텍스트 */}
            <div className="text-center flex items-start justify-center mt-16 absolute top-1/3 left-0 right-0">
              <h2 className="text-3xl text-white tracking-wider select-none max-w-4xl mx-auto px-4">
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

            {/* 하단 버튼 그룹 */}
            <div className="absolute bottom-24 left-0 right-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 max-w-4xl mx-auto">
                {/* 육성법 카드 */}
                <Link to="/trainingMethod">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onMouseEnter={() => handleMouseEnter("training")}
                    className="bg-white/90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2 text-center">🌱</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
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
                    className="bg-white/90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2 text-center">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
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
                    className="bg-white/90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2 text-center">🌤️</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
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
                    className="bg-white/90 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
                  >
                    <div className="p-4">
                      <div className="text-2xl mb-2 text-center">👥</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-center">
                        커뮤니티
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Culture;
