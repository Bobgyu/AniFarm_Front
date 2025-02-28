import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cropData } from './TrainData';

const TrainingDetail = () => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 작물 데이터를 가나다순으로 정렬
  const sortedCropEntries = Object.entries(cropData).sort((a, b) => 
    a[1].name.localeCompare(b[1].name, 'ko')
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          작물 육성 가이드
        </h1>
        
        {/* 작물 선택 영역 */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {sortedCropEntries.map(([cropKey, crop], index) => (
              <button
                key={cropKey}
                className={`w-full px-4 py-3 rounded-lg text-base sm:text-lg font-semibold 
                  ${index === currentIndex 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white text-green-600 border border-green-200'} 
                  cursor-pointer hover:bg-green-700 hover:text-white 
                  transition-colors duration-200 shadow-md
                  flex items-center justify-center text-center min-h-[48px]`}
                onClick={() => setCurrentIndex(index)}
              >
                {crop.name}
              </button>
            ))}
          </div>
        </div>

        {/* 선택된 작물 정보 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            {sortedCropEntries[currentIndex][1].name} 재배법
          </h2>
          
          <div className="space-y-8">
            {sortedCropEntries[currentIndex][1].content.map((section, index) => (
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
