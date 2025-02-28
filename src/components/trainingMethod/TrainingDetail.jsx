import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cropData } from './TrainData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TrainingDetail = () => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const cropKeys = Object.keys(cropData);

  // 작물 선택 시 해당 위치로 슬라이드 이동
  const handleCropSelect = (index) => {
    setCurrentIndex(index);
    if (swiper) {
      swiper.slideTo(index);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          작물 육성 가이드
        </h1>
        
        {/* 작물 선택 영역 */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4">
            {/* 이전 버튼 */}
            <button className="swiper-button-prev-custom w-10 h-10 flex items-center justify-center rounded-full bg-white text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 shadow-md border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 스와이퍼 컨테이너 */}
            <div className="w-[500px]">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
                slidesPerView={3}
                spaceBetween={16}
                slidesPerGroup={1}
                className="crop-swiper"
                onSwiper={setSwiper}
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
                initialSlide={currentIndex}
              >
                {cropKeys.map((cropKey, index) => (
                  <SwiperSlide key={cropKey}>
                    <div
                      className={`px-6 py-2 rounded-full text-lg font-semibold text-center 
                        ${index === currentIndex 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white text-green-600 border border-green-200'} 
                        cursor-pointer hover:bg-green-700 hover:text-white transition-colors duration-200 shadow-md`}
                      onClick={() => handleCropSelect(index)}
                    >
                      {cropData[cropKey].name}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 다음 버튼 */}
            <button className="swiper-button-next-custom w-10 h-10 flex items-center justify-center rounded-full bg-white text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 shadow-md border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 선택된 작물 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            {cropData[cropKeys[currentIndex]].name} 재배법
          </h2>
          
          <div className="space-y-8">
            {cropData[cropKeys[currentIndex]].content.map((section, index) => (
              <div
                key={index}
                className="border-l-4 border-green-500 pl-6 py-2"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  {section.description}
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-700 font-medium">
                    💡 Tip: {section.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetail;
