import React from 'react'

const CropQuiz = () => {
  return (
    <main className="flex min-h-dvh flex-col pt-14">
      <div className='relative pt-4 '>
      <div className="flex flex-col items-center text-left">
        <div className='flex flex-col items-center w-full'>
        {/* 타이틀 영역 */}
        <div className="text-3xl font-bold mb-2">
          작물별 퀴즈
        </div>
        <div className="mb-6">
          <div className="crop-selection-instruction">
            퀴즈를 진행할 작물을 선택하세요
          </div>
          </div>
            {/* 작물 드롭다운 영역 */}
          <div className="">
            <select className="border border-gray-300 p-2 rounded-lg flex flex-col items-center">
              <option>감자</option>
              {/* 다른 작물 옵션 추가 */}
            </select>
        </div>
        </div>

        {/* 퀴즈 문제 영역 */}
        <div className="quiz-section border-t border-gray-300 pt-4 ml-4">
          <div className="quiz-title text-xl font-semibold mb-4">
            퀴즈 문제 (총 10문제)
          </div>
          {/* 퀴즈 문제 리스트 */}
          <div className="quiz-question-list space-y-4">
            <div className="quiz-question">
              <div className="mb-2">
                문제 1: {`{crop id}`}의 주요 재배 시기는?
              </div>
              <div className="quiz-options">
                <ul className="list-disc pl-5">
                  <li>Value 1</li>
                  <li>Value 2</li>
                  <li>Value 3</li>
                </ul>
              </div>
            </div>

            {/* 추가 문제 예시 */}
            <div className="quiz-question">
              <div className="mb-2">
                문제 2: {`{crop id}`}의 ...
              </div>
              <div className="quiz-options">
                <ul className="list-disc pl-5">
                  <li>Value 1</li>
                  <li>Value 2</li>
                  <li>Value 3</li>
                </ul>
              </div>
            </div>
            {/* ... 추가 문제 */}
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}

export default CropQuiz