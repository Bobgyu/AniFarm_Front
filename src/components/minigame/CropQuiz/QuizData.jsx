import React, { useState, useEffect } from 'react';

// 각 작물별 퀴즈 데이터를 저장합니다.

const QuizData = ({ selectedCrop }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  // 각 질문의 선택된 옵션을 저장 (quiz id: 선택된 옵션 번호)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // 제출 후 받은 결과 (정답 여부, 총 점수 등)
  const [result, setResult] = useState(null);

  useEffect(() => {
    // crop이 변경될 때마다 기존 상태 초기화 (이전 결과, 선택된 옵션 등 제거)
    setQuizQuestions([]);
    setSelectedAnswers({});
    setResult(null);

    if (selectedCrop) {
      const encodedCrop = encodeURIComponent(selectedCrop);
      fetch(`http://localhost:8000/api/quiz/${encodedCrop}`)
        .then(response => response.json())
        .then(data => {
          console.log("Fetched quiz data:", data);
          setQuizQuestions(data);
        })
        .catch(error => {
          console.error("Error fetching quiz questions:", error);
        });
    }
  }, [selectedCrop]); // selectedCrop가 변경될 때마다 다시 fetch 및 상태 초기화

  // 사용자가 옵션 버튼을 클릭하면 해당 질문의 선택된 옵션을 상태에 업데이트
  const handleOptionSelect = (quizId, optionNumber) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [quizId]: optionNumber
    }));
  };

  // "결과 확인하기" 버튼 클릭 시 실행되는 함수
  const handleSubmitQuiz = () => {
    // quizQuestions의 각 질문마다 사용자의 선택(selectedAnswers)과 질문의 정답(correct_answer)를 비교하여 결과 계산
    const computedResults = quizQuestions.map((quiz) => {
      const selectedAnswer = selectedAnswers[quiz.id];
      // 정답 비교: 선택한 답안을 문자열로 변환한 값이, 질문의 correct_answer(문자열, 양쪽 공백 제거)와 동일한지 확인
      const isCorrect =
        selectedAnswer !== undefined &&
        String(selectedAnswer) === String(quiz.correct_answer).trim();
      return { quiz_id: quiz.id, is_correct: isCorrect };
    });

    // 정답인 경우에만 score가 +1 되도록 전체 점수를 계산합니다.
    const score = computedResults.reduce(
      (acc, result) => (result.is_correct ? acc + 1 : acc),
      0
    );

    // 결과 상태 업데이트: 총 점수, 전체 문제 수, 각 문제별 정답 여부
    setResult({
      score,
      total_questions: quizQuestions.length,
      results: computedResults,
    });
  };

  // quiz 객체의 correct_answer 값을 문자열로 변환하고 트림(trim)한 후, 올바른 옵션 텍스트를 반환하는 헬퍼 함수입니다.
  const getCorrectAnswerText = (quiz) => {
    // 서버에서 받은 값이 정수일 수도 있으므로 문자열로 변환 후 좌우 공백 제거
    const correctOption = String(quiz.correct_answer || "").trim();
    console.log(`Quiz ${quiz.id} - correct_answer: '${correctOption}'`);
    switch (correctOption) {
      case "1":
        return quiz.option_1;
      case "2":
        return quiz.option_2;
      case "3":
        return quiz.option_3;
      case "4":
        return quiz.option_4;
      default:
        return "정답 정보 없음";
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-10">
      <div className="text-left flex flex-col w-full max-w-lg border p-4 mb-2">
        <div className="text-xl font-semibold mb-2">
          {selectedCrop} 퀴즈 문제 (총 {quizQuestions.length}문제)
        </div>
        <div className="quiz-question-list space-y-4 border-t pt-2">
          {quizQuestions.length > 0 ? (
            quizQuestions.map((quiz) => (
              <div key={quiz.id} className="quiz-card p-4 border rounded-md">
                <h4 className="mb-2">{quiz.question}</h4>
                <ul>
                  <li className="flex items-center mb-1">
                    <button 
                      className={`mr-2 w-5 h-5 rounded-full border cursor-pointer flex justify-center items-center ${
                        selectedAnswers[quiz.id] === 1 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleOptionSelect(quiz.id, 1)}
                    >
                      1
                    </button>
                    {quiz.option_1}
                  </li>
                  <li className="flex items-center mb-1">
                    <button 
                      className={`mr-2 w-5 h-5 rounded-full border cursor-pointer flex justify-center items-center ${
                        selectedAnswers[quiz.id] === 2 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleOptionSelect(quiz.id, 2)}
                    >
                      2
                    </button>
                    {quiz.option_2}
                  </li>
                  <li className="flex items-center mb-1">
                    <button 
                      className={`mr-2 w-5 h-5 rounded-full border cursor-pointer flex justify-center items-center ${
                        selectedAnswers[quiz.id] === 3 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleOptionSelect(quiz.id, 3)}
                    >
                      3
                    </button>
                    {quiz.option_3}
                  </li>
                  <li className="flex items-center">
                    <button 
                      className={`mr-2 w-5 h-5 rounded-full border cursor-pointer flex justify-center items-center ${
                        selectedAnswers[quiz.id] === 4 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "bg-white border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleOptionSelect(quiz.id, 4)}
                    >
                      4
                    </button>
                    {quiz.option_4}
                  </li>
                </ul>
                {/* 결과 확인 후 각 질문 옆에 정답 텍스트 출력 */}
                {result && (
                  <div className="mt-2 text-green-600">
                    정답: {getCorrectAnswerText(quiz)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">선택된 작물에 대한 퀴즈가 없습니다.</div>
          )}
        </div>
        {/* "결과 확인하기" 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmitQuiz}
            className="submit-button px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            결과 확인하기
          </button>
        </div>
        {/* 기존 결과 출력 영역 (총 점수 및 정답/오답 표시) */}
        {result && (
          <div className="mt-4 text-center">
            <div>총 {result.score}개 정답입니다! (총 {result.total_questions}문제 중)</div>
            <ul className="mt-2">
              {result.results.map((item, index) => (
                <li key={index}>
                  문제 {item.quiz_id}: {item.is_correct ? "정답" : "오답"}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizData