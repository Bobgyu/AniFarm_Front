import React, { useState } from 'react';
import { cropData } from './TrainData';  // Import cropData from TrainData.jsx

const TrainingDetail = () => {
  const [selectedCrop, setSelectedCrop] = useState('crop1');  // Add state here
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태 추가
  const itemsPerPage = 10; // 한 페이지당 보여줄 작물 수

  // 현재 페이지에 따른 시작과 끝 인덱스 계산
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          작물 육성 가이드
        </h1>
        
        {/* 작물 선택 버튼 영역 */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {/* 이전 페이지 화살표 */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 
              ${currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-green-600 hover:bg-green-50 hover:text-green-700 hover:shadow-md border border-green-200'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 작물 버튼들 */}
          <div className="flex space-x-4">
            {Object.keys(cropData)
              .filter(key => {
                const cropNumber = parseInt(key.replace('crop', ''));
                return cropNumber >= startIndex && cropNumber <= endIndex;
              })
              .map((cropKey) => (
                <button
                  key={cropKey}
                  onClick={() => setSelectedCrop(cropKey)}
                  className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-200
                    ${selectedCrop === cropKey
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
                    }`}
                >
                  {cropData[cropKey].name}
                </button>
              ))}
          </div>

          {/* 다음 페이지 화살표 */}
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={endIndex >= Object.keys(cropData).length}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
              ${endIndex >= Object.keys(cropData).length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-green-600 hover:bg-green-50 hover:text-green-700 hover:shadow-md border border-green-200'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 선택된 작물 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            {cropData[selectedCrop].name} 재배법
          </h2>
          
          <div className="space-y-8">
            {cropData[selectedCrop].content.map((section, index) => (
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
