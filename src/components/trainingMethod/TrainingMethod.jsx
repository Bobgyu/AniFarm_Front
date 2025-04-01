import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSeedling, FaWater, FaSun, FaLeaf, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; 
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
import green_onion from '../../assets/images/green_onion.jpg';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchYoungFarmerList, setCategory } from '../../redux/slices/youngFarmerSlice';

const TrainingMethod = () => {
  const dispatch = useDispatch();
  const { farmerList, loading, selectedCategory } = useSelector(state => state?.youngFarmer) || {
    farmerList: [],
    loading: false,
    selectedCategory: "01"
  };

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  // 유튜브 영상 페이지 네비게이션을 위한 상태
  const [[videoPage, videoDirection], setVideoPageState] = useState([0, 0]);
  // 화면크기에 따라 한 페이지에 보여질 영상의 개수를 동적으로 설정: 모바일은 1, 데스크탑은 3
  const [videoItemsPerPage, setVideoItemsPerPage] = useState(() =>
    window.innerWidth < 768 ? 1 : 3
  );
  const totalVideoPages = Math.ceil(videos.length / videoItemsPerPage);

  // 슬라이더 너비를 측정하기 위한 Ref와 상태
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  // 화면 리사이즈에 따라 videoItemsPerPage 업데이트
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = window.innerWidth < 768 ? 1 : 3;
      setVideoItemsPerPage(newItemsPerPage);
      setVideoPageState([0, 0]); // 리사이즈 시 페이지 초기화
    };
    window.addEventListener("resize", handleResize);
    // 컴포넌트 마운트 시 한 번 실행
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일 슬라이더의 너비 측정 (videoItemsPerPage가 1일 경우)
  useEffect(() => {
    if (videoItemsPerPage === 1 && sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, [videoItemsPerPage, videos.length]);

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
      setVideosLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/youtube-videos');
        setVideos(response.data || []);
      } catch (error) {
        console.error('YouTube 데이터 fetch 오류:', error);
        setVideos([]);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchYoutubeVideos();
  }, []);
  
  // 카테고리 정의
  const categories = [
    { code: "01", name: "청년농소개", icon: "👨‍🌾" },
    { code: "02", name: "청년농영상", icon: "🎥" }
  ];

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryCode) => {
    dispatch(setCategory(categoryCode));
    dispatch(fetchYoungFarmerList({ s_code: categoryCode, page: 1, row_cnt: 5 }));
  };

  useEffect(() => {
    dispatch(fetchYoungFarmerList({ s_code: selectedCategory, page: 1, row_cnt: 5 }));
  }, [dispatch]);

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
    { src: rice, alt: '벼', cropId: 'crop15' },
    { src: green_onion, alt: '대파', cropId: 'crop16' }
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

  // 데스크탑의 화살표 네비게이션 핸들러 (모바일은 아래 슬라이더로 대체)
  const handleVideoPrevious = () => {
    setVideoPageState(([prevPage]) => [
      prevPage === 0 ? totalVideoPages - 1 : prevPage - 1,
      -1,
    ]);
  };

  const handleVideoNext = () => {
    setVideoPageState(([prevPage]) => [
      prevPage === totalVideoPages - 1 ? 0 : prevPage + 1,
      1,
    ]);
  };

  const visibleImages = allImages.slice(startIndex, startIndex + 4);

  // 사례 카드 컴포넌트에서 링크 처리 수정
  const renderFarmerCard = (farmer) => (
    <motion.div 
      key={farmer.bbsSeq}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2">
        {farmer.title}
      </h3>
      <div className="text-sm text-gray-600 mb-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">농업인:</span>
          <span>{farmer.bbsInfo03}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">품목:</span>
          <span>{farmer.bbsInfo04}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">지역:</span>
          <span>{farmer.area1Nm} {farmer.area2Nm}</span>
        </div>
      </div>
      {farmer.bbsInfo08 && (  // URL이 있을 때만 버튼 표시
        <a 
          href={farmer.bbsInfo08} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm mt-2 w-full text-center"
        >
          자세히 보기
        </a>
      )}
    </motion.div>
  );

  // 청년농 사례 섹션 렌더링
  const renderFarmerSection = () => (
    <div className="w-full max-w-[1280px] px-4 mx-auto mb-12">
      <h2 className="text-3xl font-bold text-center mt-4 mb-8 text-gray-800">
        청년농 소개&영상
      </h2>
      
      {/* 카테고리 버튼 그룹 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.code}
            onClick={() => handleCategoryChange(category.code)}
            className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2
              ${selectedCategory === category.code 
                ? "bg-green-500 text-white shadow-lg transform scale-105" 
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"}`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* 사례 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-500"></div>
          </div>
        ) : farmerList && farmerList.length > 0 ? (
          farmerList.map((farmer) => renderFarmerCard(farmer))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            해당 카테고리의 사례가 없습니다.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
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
              className="grid grid-cols-2 gap-4 mb-8 px-4 sm:px-12 md:grid-cols-4"
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
                className="absolute left-[8rem] sm:left-[-3rem] top-[110%] md:top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
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
                      className="w-40 md:w-72 aspect-[3/2] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity mb-2"
                    />
                    <h3 className="text-black text-lg font-semibold mt-2">
                      {image.alt}
                    </h3>
                  </motion.div>
                </Link>
              ))}

              <button
                onClick={handleNext}
                className="absolute right-[8rem] sm:right-[-3rem] top-[110%] md:top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {methods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg duration-300"
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

      {/* 청년농 사례 섹션 */}
      {renderFarmerSection()}

      {/* Youtube 영상 섹션 */}
      <div className="w-full max-w-[1280px] px-4 mx-auto pb-2 md:pb-12">
        <h2 className="text-3xl font-bold text-center mt-4 mb-8 text-gray-800">
          추천 교육 영상
        </h2>
        {videosLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65]"></div>
          </div>
        ) : (
          <div className="relative">
            {/* 데스크탑에서는 화살표 버튼을 표시 */}
            {videoItemsPerPage !== 1 && (
              <>
                <button
                  onClick={handleVideoPrevious}
                  className="absolute left-[-1rem] sm:left-[-5rem] top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
                             hover:bg-white hover:scale-110
                             active:bg-white active:scale-95 
                             transition-all duration-300"
                >
                  <FaChevronLeft className="text-2xl text-green-600" />
                </button>
                <button
                  onClick={handleVideoNext}
                  className="absolute right-[-1rem] sm:right-[-5rem] top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg 
                             hover:bg-white hover:scale-110
                             active:bg-white active:scale-95 
                             transition-all duration-300"
                >
                  <FaChevronRight className="text-2xl text-green-600" />
                </button>
              </>
            )}
            {videoItemsPerPage === 1 ? (
              // 모바일 (반응형)일 때: 슬라이더 컨테이너를 추가하여 넘치는 콘텐츠를 숨기며,
              // 각 슬라이드 항목에 grid와 place-items-center 클래스를 추가해 내부 콘텐츠를 중앙에 배치합니다.
              <div className="overflow-hidden">
                <motion.div
                  ref={sliderRef}
                  drag="x"
                  dragConstraints={{ right: 0, left: -((videos.length - 1) * sliderWidth) }}
                  onDragEnd={(event, info) => {
                    const threshold = sliderWidth / 4;
                    if (info.offset.x < -threshold && videoPage < videos.length - 1) {
                      setVideoPageState([videoPage + 1, 0]);
                    } else if (info.offset.x > threshold && videoPage > 0) {
                      setVideoPageState([videoPage - 1, 0]);
                    }
                  }}
                  animate={{ x: -videoPage * sliderWidth }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex"
                >
                  {videos.map((video) => (
                    <div key={video.id.videoId} className="flex-shrink-0 w-full px-2 grid place-items-center">
                      <div
                        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                        onClick={() =>
                          window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, "_blank")
                        }
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={video.snippet.thumbnails.high.url}
                            alt={video.snippet.title}
                            className="w-full h-[300px] object-cover"
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
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            ) : (
              // 데스크탑에서는 기존 그리드 방식 유지
              <div className="grid gap-8 grid-cols-3">
                <AnimatePresence mode="wait">
                  {videos
                    .slice(
                      videoPage * videoItemsPerPage,
                      (videoPage + 1) * videoItemsPerPage
                    )
                    .map((video) => (
                      <motion.div
                        key={video.id.videoId}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={video.snippet.thumbnails.high.url}
                            alt={video.snippet.title}
                            className="w-full h-[300px] object-cover cursor-pointer"
                            onClick={() =>
                              window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, "_blank")
                            }
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
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 기존 CTA 섹션 */}
      <div className="text-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8">
            전문가의 도움을 받아 더 나은 농작물을 기르세요
          </p>
          <div className="flex justify-center items-center gap-4">
          <Link key="crop7" to={`/trainingDetail?cropId=crop7`}>
            <button className="bg-[#3a9d1f] text-white px-8 py-3 rounded-full hover:bg-[#0aab65]">
              육성 가이드 보기
            </button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingMethod;