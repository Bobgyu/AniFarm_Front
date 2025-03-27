import React, { useState } from "react";
import AnalysisMethodSelector from "./AnalysisMethodSelector";
import AgricultureGoalSetting from "./AgricultureGoalSetting";
import AnalysisReport from "./AnalysisReport";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiStairsGoal } from "react-icons/gi";
import { TbDeviceAnalytics } from "react-icons/tb";

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
      <div className="bg-[#fff] text-[#000000] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">경영모의계산</h1>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12">
        {/* 진행 단계 표시 */}
        <div className="flex justify-center mb-8 mt-12">
          <div className="flex items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                currentStep >= 1
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              <FaRegCheckCircle className="w-6 h-6" />
            </div>
            <div
              className={`w-32 h-1.5 mx-2 ${
                currentStep >= 2 ? "bg-[#3a9d1f]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                currentStep >= 2
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              <GiStairsGoal className="w-6 h-6" />
            </div>
            <div
              className={`w-32 h-1.5 mx-2 ${
                currentStep >= 3 ? "bg-[#3a9d1f]" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                currentStep >= 3
                  ? "bg-[#3a9d1f] text-white"
                  : "bg-gray-300 text-white"
              }`}
            >
              <TbDeviceAnalytics className="w-6 h-6" />
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
