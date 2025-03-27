import React, { useState } from "react";
import AnalysisMethodSelector from "./AnalysisMethodSelector";
import AgricultureGoalSetting from "./AgricultureGoalSetting";
import AnalysisReport from "./AnalysisReport";

const BusinessSimulation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysisMethodSelect = (method) => {
    setAnalysisData({ ...analysisData, method });
    setCurrentStep(2);
  };

  const handleGoalSetting = (goals) => {
    setAnalysisData({ ...analysisData, goals });
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 배너 */}
      <div className="bg-[#3a9d1f] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">경영모의계산</h1>
          <p className="text-lg">
            농촌진흥청은 1977년부터 농산물 소득조사를 실시하여 '농축산물
            소득자료집'을 발간하고 있으며, 본 프로그램은 작목별 소득 조사
            빅데이터 기반으로 농가소득 증대, 경영 개선 및 작물선택 정보를
            제공합니다.
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12">
        {/* 진행 단계 표시 */}
        <div className="flex justify-center mb-8 mt-12">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              1
            </div>
            <div
              className={`w-32 h-1 mx-2 ${
                currentStep >= 2 ? "bg-[#3a9d1f]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              2
            </div>
            <div
              className={`w-32 h-1 mx-2 ${
                currentStep >= 3 ? "bg-[#3a9d1f]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* 단계별 컨텐츠 */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          {currentStep === 1 && (
            <AnalysisMethodSelector onSelect={handleAnalysisMethodSelect} />
          )}

          {currentStep === 2 && (
            <AgricultureGoalSetting
              onComplete={handleGoalSetting}
              method={analysisData.method}
            />
          )}

          {currentStep === 3 && <AnalysisReport data={analysisData} />}
        </div>
      </div>
    </div>
  );
};

export default BusinessSimulation;
