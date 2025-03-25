import React, { useState } from 'react';
import QuizData from './QuizData';

const CropQuiz = () => {
  // 기본 선택 작물을 '감자'로 초기화합니다.
  const [selectedCrop, setSelectedCrop] = useState('감자');

  // select 태그의 값이 변경될 때 상태 업데이트
  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  return (
    <main className="container h-screen">
      <div className="relative pt-14 w-full h-full">
        {/* 타이틀 및 모달바 영역 */}
        <div className="flex flex-col items-center w-full">
          <div className="text-left flex flex-col w-full max-w-lg">
            <div className="text-3xl font-bold mb-2">
              작물별 퀴즈
            </div>
            <div className="mb-6">
              <div className="crop-selection-instruction">
                퀴즈를 진행할 작물을 선택하세요
              </div>
            </div>

            {/* 작물 모달(드롭다운) 영역 */}
            <div className="relative">
              <select
                value={selectedCrop}
                onChange={handleCropChange}
                className="border border-gray-300 p-2 rounded-lg w-full"
                style={{ maxWidth: '600px' }}
              >
                <option>감자</option>
                <option>대파</option>
                <option>양파</option>
                <option>토마토</option>
                <option>배추</option>
                <option>무</option>
                {/* 다른 작물 옵션 추가 */}
              </select>
              <div className="mt-6 crop-selection-instruction">
                작물을 선택하면 해당 작물에 대한 퀴즈가 표시됩니다.
              </div>
            </div>
          </div>
          </div>

    {/* 선택된 작물에 따라 해당하는 퀴즈 내용을 렌더링 */}       
          <QuizData selectedCrop={selectedCrop} />
        </div>
    </main>
  );
}

export default CropQuiz