import React from 'react'

// 각 작물별 퀴즈 데이터를 저장합니다.
const quizDataByCrop = {
  '감자': [
    {
      question: '감자의 주요 재배 시기는 언제인가요?',
      options: ['봄', '여름', '가을'],
      answer: 0, // 정답 옵션의 인덱스
    },
    {
      question: '감자의 품종은 몇 가지인가요?',
      options: ['3종', '5종', '7종'],
      answer: 1,
    },
    // 추가 감자 퀴즈 데이터를 작성...
  ],
  '대파': [
    {
      question: '대파는 어떤 계절에 가장 많이 재배되나요?',
      options: ['봄', '가을', '겨울'],
      answer: 1,
    },
    // 추가 대파 퀴즈 데이터를 작성...
  ],
  '양파': [
    {
      question: '양파의 주요 재배 시기는?',
      options: ['봄', '여름', '겨울'],
      answer: 2,
    },
    // ...
  ],
  // 다른 작물들도 동일한 방식으로 데이터를 추가
};

const QuizData = ({ selectedCrop }) => {
  // 선택된 작물에 대한 퀴즈 목록을 가져옵니다.
  const quizList = quizDataByCrop[selectedCrop] || [];

  return (
    <div className="flex flex-col items-center w-full mt-10">
      <div className="text-left flex flex-col w-full max-w-lg border p-4 mb-2">
      <div className="text-xl font-semibold mb-2">
        {selectedCrop} 퀴즈 문제 (총 {quizList.length}문제)
      </div>
      <div className="quiz-question-list space-y-4 border-t pt-2">
        {quizList.length > 0 ? (
          quizList.map((quiz, index) => (
            <div key={index} className="quiz-question">
              <div className="mb-2">
                문제 {index + 1}: {quiz.question}
              </div>
              <div className="quiz-options">
                <ul className="list-disc pl-5">
                  {quiz.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            </div>         
          ))
        ) : (
          <div className="text-gray-500">선택된 작물에 대한 퀴즈가 없습니다.</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default QuizData