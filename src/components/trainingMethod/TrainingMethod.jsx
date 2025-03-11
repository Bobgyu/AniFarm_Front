import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSeedling, FaWater, FaSun, FaLeaf, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion"; 
import tomatoes from '../../assets/images/tomatoes.jpg';
import lettuce from '../../assets/images/lettuce.jpg';
import carrot from '../../assets/images/carrot.jpg';
import chili_pepper from '../../assets/images/chili_pepper.jpg';
import cabbage from '../../assets/images/cabbage.jpg';
import cucumber from '../../assets/images/cucumber.jpg';
import eggplant from '../../assets/images/eggplant.jpg';
import spinach from '../../assets/images/spinach.jpg';
import onion from '../../assets/images/onion.jpg';
import potato from '../../assets/images/potato.jpg';
import radish from '../../assets/images/radish.jpg';
import strawberry from '../../assets/images/strawberry.jpg';
import kiwi from '../../assets/images/kiwi.jpg';
import chamoe from '../../assets/images/chamoe.jpg';
import rice from '../../assets/images/rice2.jpg';

import axios from 'axios';

const TrainingMethod = () => {
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [news, setNews] = useState([]);

  const [[page, direction], setPage] = useState([0, 0]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  useEffect(() => {
    const fetchYoutubeVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/youtube-videos');
        setVideos(response.data || []);
      } catch (error) {
        console.error('YouTube 데이터 fetch 오류:', error);
        setVideos([]);
      }
    }

    fetchYoutubeVideos();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news', {
          params: { query: '채소 키우는법' }
        });
        setNews(response.data.items || []);
      } catch (error) {
        console.error('뉴스 데이터 fetch 오류:', error);
        setNews([]);
      }
    };

    fetchNews();
  }, []);

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

  const allImages = [
    { src: tomatoes, alt: '토마토', cropId: 'crop1' },
    { src: lettuce, alt: '상추', cropId: 'crop2' },
    { src: chili_pepper, alt: '고추', cropId: 'crop3' },
    { src: cabbage, alt: '배추', cropId: 'crop4' },
    { src: carrot, alt: '당근', cropId: 'crop5' },
    { src: cucumber, alt: '오이', cropId: 'crop6' },
    { src: eggplant, alt: '가지', cropId: 'crop7' },
    { src: spinach, alt: '시금치', cropId: 'crop8' },
    { src: onion, alt: '양파', cropId: 'crop9' },
    { src: potato, alt: '감자', cropId: 'crop10' },
    { src: radish, alt: '무', cropId: 'crop11' },
    { src: strawberry, alt: '딸기', cropId: 'crop12' },
    { src: kiwi, alt: '키위', cropId: 'crop13' },
    { src: chamoe, alt: '참외', cropId: 'crop14' },
    { src: rice, alt: '벼', cropId: 'crop15' }
  ].sort((a, b) => a.alt.localeCompare(b.alt, 'ko'));

  const handlePrevious = () => {
    setPage([page - 1, -1]);
    setStartIndex((prev) => {
      const newIndex = prev - 4;
      return newIndex < 0 ? allImages.length - 4 : newIndex;
    });
  };

  const handleNext = () => {
    setPage([page + 1, 1]);
    setStartIndex((prev) => {
      const newIndex = prev + 4;
      return newIndex >= allImages.length ? 0 : newIndex;
    });
  };

  const visibleImages = allImages.slice(startIndex, startIndex + 4);

  return (
    <div className="min-h-screen ">
      {/* 히어로 섹션 */}
      <div className="relative min-h-[80vh] bg-cover bg-center flex flex-col items-center justify-start">
        <div className="absolute inset-0 opacity-40"></div>
        <div className="relative z-10 text-center text-black px-4 pt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl text-black font-bold mb-4"
          >
            작물 육성법
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-black mb-8"
          >
            재배 가이드
          </motion.p>
          <motion.div 
            className="relative w-full max-w-[1280px] mx-auto"  
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8 px-12"
              animate="center"
              initial="enter"
              exit="exit"
              variants={slideVariants}
              custom={direction}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <button
                onClick={handlePrevious}
                className="absolute left-[-3rem] top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
                           hover:bg-white hover:scale-110
                           active:bg-white active:scale-95 
                           transition-all duration-300"
              >
                <FaChevronLeft className="text-2xl text-green-600" />
              </button>

              {visibleImages.map((image, index) => (
                <Link key={image.cropId} to={`/trainingDetail?cropId=${image.cropId}`}>
                  <motion.div 
                    className="flex flex-col items-center transition-transform duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-72 h-48 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity mb-2"
                    />
                    <h3 className="text-black text-lg font-semibold mt-2">
                      {image.alt}
                    </h3>
                  </motion.div>
                </Link>
              ))}

              <button
                onClick={handleNext}
                className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
                           hover:bg-white hover:scale-110 
                           active:bg-white active:scale-95 
                           transition-all duration-300"
              >
                <FaChevronRight className="text-2xl text-green-600" />
              </button>
            </motion.div>
          </motion.div>

          {/* 주요 육성 방법 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-[1280px] mx-auto mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {methods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg  duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{method.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                    <p className="text-gray-600">{method.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Youtube 영상 섹션 */}
      <div className="w-full max-w-[1280px] px-4 mx-auto pb-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          추천 교육 영상
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div
              key={video.id.videoId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9">
                <motion.img 
                  src={video.snippet.thumbnails.high.url}
                  alt={video.snippet.title}
                  className="w-full h-[300px] object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {video.snippet.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {video.snippet.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 뉴스 섹션 */}
      <div className="w-full max-w-[1280px] px-4 mx-auto pb-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          최신 뉴스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                {article.imageUrl && (
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    <motion.img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 object-cover border-2 border-black"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  </a>
                )}
                <h3 className="text-lg font-semibold text-blue-500 mb-2 line-clamp-1 hover:text-blue-700 transition-colors duration-400">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className=" text-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8">
            전문가의 도움을 받아 더 나은 농작물을 기르세요
          </p>
          <Link to="/trainingDetail?cropId=crop1">
            <button className="bg-[#3a9d1f] text-white px-8 py-3 rounded-full hover:bg-[#0aab65]">
              육성 가이드 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainingMethod;