import React, { useState } from 'react';
import SaleNews from './SaleNews';
import TrainNews from './TrainNews';

const News = () => {
  // 'price'와 'development'로 탭을 구분합니다.
  const [activeTab, setActiveTab] = useState('price');

  return (
    <div>
      <div className="w-full max-w-[1280px] px-4 mx-auto pb-12">
        <h2 className="flex items-center justify-center text-2xl md:text-3xl font-bold text-center mt-8 md:mt-16 mb-12 text-gray-800">
          <span
            onClick={() => setActiveTab('price')}
            className={`cursor-pointer hover:text-blue-500 ${
              activeTab === 'price' ? 'text-blue-500' : ''
            }`}
          >
            가격 관련 뉴스
          </span>
          <div className="border-l-[3px] h-6 border-gray-500 mx-4"></div>
          <span
            onClick={() => setActiveTab('development')}
            className={`cursor-pointer hover:text-blue-500 ${
              activeTab === 'development' ? 'text-blue-500' : ''
            }`}
          >
            육성 관련 뉴스
          </span>
        </h2>
        {activeTab === 'price' ? <SaleNews /> : <TrainNews />}
      </div>
    </div>
  );
};

export default News;