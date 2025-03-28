import React, { useState, useEffect } from 'react';

// 각 작물별 퀴즈 데이터를 저장합니다.

const QuizData = ({ selectedCrop }) => {
  // 각 작물별 퀴즈 데이터, 선택된 답, 제출 결과 및 에러 상태 관리
  const [quizQuestions, setQuizQuestions] = useState([]);
  // 각 질문의 선택된 옵션을 저장 (quiz id: 선택된 옵션 번호)
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // 제출 후 받은 결과 (정답 여부, 총 점수 등)
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 작물이 변경되면 상태 리셋 (이전 문제, 선택 답안, 결과, 에러 제거)
    setQuizQuestions([]);
    setSelectedAnswers({});
    setResult(null);
    setError(null);

    if (selectedCrop) {
      const fetchQuizData = async () => {
        try {
          const encodedCrop = encodeURIComponent(selectedCrop);
          const response = await fetch(`http://localhost:8000/api/quiz/${encodedCrop}`);
          if (!response.ok) {
            throw new Error(`네트워크 오류: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched quiz data:", data);
          setQuizQuestions(data);
        } catch (err) {
          console.error("Error fetching quiz questions:", err);
          setError("퀴즈 데이터를 불러오는데 문제가 발생했습니다.");
        }
      };

      fetchQuizData();
    }
  }, [selectedCrop]);

  // 사용자가 옵션 버튼을 클릭하면 해당 질문의 선택된 옵션을 업데이트합니다.
  // 버튼에 1,2,3,4 값으로 전달하여 나중에 정답 비교 시 (user_answer - 1)을 이용합니다.
  const handleOptionSelect = (quizId, optionNumber) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [quizId]: optionNumber
    }));
  };

  // "결과 확인하기" 버튼 클릭 시, 각 문제의 정답 여부 및 총 점수를 계산합니다.
  const handleSubmitQuiz = () => {
    const computedResults = quizQuestions.map(quiz => {
      const selectedAnswer = selectedAnswers[quiz.id];
      // 백엔드에서 받은 correct_answer는 0부터 시작합니다.
      // 버튼은 1부터 시작하도록 했으므로, (selectedAnswer - 1)과 비교합니다.
      const isCorrect =
        selectedAnswer !== undefined &&
        String(selectedAnswer - 1) === String(quiz.correct_answer).trim();
      return { quiz_id: quiz.id, is_correct: isCorrect };
    });

    const score = computedResults.reduce(
      (acc, item) => (item.is_correct ? acc + 1 : acc),
      0
    );

    console.log("각 퀴즈의 결과 (quiz_id, is_correct):", computedResults);
    console.log("총 정답 개수:", score);

    setResult({
      score,
      total_questions: quizQuestions.length,
      results: computedResults,
    });
  };

  // quiz의 correct_answer 값을 이용해 해당 옵션 텍스트를 반환합니다.
  const getCorrectAnswerText = quiz => {
    const correctOption = String(quiz.correct_answer || "").trim();
    switch (correctOption) {
      case "0":
        return quiz.option_1;
      case "1":
        return quiz.option_2;
      case "2":
        return quiz.option_3;
      case "3":
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
        {error && (
          <div className="text-red-600 mb-2">
            {error}
          </div>
        )}
        <div className="quiz-question-list space-y-4 border-t pt-2">
          {quizQuestions.length > 0 ? (
            quizQuestions.map(quiz => (
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
                {/* 결과 확인 후 각 문제의 정답 옵션 텍스트를 출력 */}
                {result && (
                  <div className="mt-2 text-green-600">
                    정답: {getCorrectAnswerText(quiz)}
                  </div>
                )}
              </div>
            ))
          ) : (
            !error && <div className="text-gray-500">선택된 작물에 대한 퀴즈가 없습니다.</div>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmitQuiz}
            className="submit-button px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            결과 확인하기
          </button>
        </div>
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