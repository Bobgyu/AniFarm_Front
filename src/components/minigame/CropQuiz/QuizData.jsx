import React, { useState, useEffect } from 'react';

// 각 작물별 퀴즈 데이터를 저장합니다.

const QuizData = ({ selectedCrop }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    if (selectedCrop) {
      const encodedCrop = encodeURIComponent(selectedCrop);
      fetch(`http://localhost:8000/api/quiz/${encodedCrop}`)
        .then(response => response.json())
        .then(data => {
          console.log("Fetched quiz data:", data); // 디버깅용
          setQuizQuestions(data);
        })
        .catch(error => {
          console.error("Error fetching quiz questions:", error);
        });
    }
  }, [selectedCrop]); // selectedCrop가 변경될 때마다 다시 fetch

  return (
    <div className="flex flex-col items-center w-full mt-10">
      <div className="text-left flex flex-col w-full max-w-lg border p-4 mb-2">
      <div className="text-xl font-semibold mb-2">
        {selectedCrop} 퀴즈 문제 (총 {quizQuestions.length}문제)
      </div>
      <div className="quiz-question-list space-y-4 border-t pt-2">
        {quizQuestions.length > 0 ? (
          quizQuestions.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h4>{quiz.question}</h4>
              <ul>
                <li>{quiz.option_1}</li>
                <li>{quiz.option_2}</li>
                <li>{quiz.option_3}</li>
                <li>{quiz.option_4}</li>
              </ul>
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