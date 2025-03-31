import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AnalysisReport = ({ data }) => {
  const { method, goals } = data;
  const [cropData, setCropData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 작물 데이터 로드
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/crop-data");
        if (response.data.success) {
          // API 응답을 작물 이름을 키로 하는 객체로 변환
          const formattedData = response.data.data.reduce((acc, crop) => {
            const total = crop.total_cost;
            acc[crop.crop_name] = {
              hourly_sales: crop.revenue_per_hour,
              sales_per_area: crop.revenue_per_3_3m,
              annual_sales: crop.annual_sales,
              total_cost: crop.total_cost,
              monthly_income: (crop.annual_sales - crop.total_cost) / 12,
              costs: {
                종자종묘비: crop.costs?.종자종묘비 || 0,
                기타재료비: crop.costs?.기타재료비 || 0,
                소농구비: crop.costs?.소농구비 || 0,
                대농구상각비: crop.costs?.대농구상각비 || 0,
                영농시설상각비: crop.costs?.영농시설상각비 || 0,
                수리유지비: crop.costs?.수리유지비 || 0,
                기타비용: crop.costs?.기타비용 || 0,
                농기계시설임차료: crop.costs?.농기계시설임차료 || 0,
                토지임차료: crop.costs?.토지임차료 || 0,
                위탁영농비: crop.costs?.위탁영농비 || 0,
                고용노동비: crop.costs?.고용노동비 || 0,
                중자재종묘비: crop.costs?.중자재종묘비 || 0,
                보통비료비: crop.costs?.보통비료비 || 0,
                부산물비료비: crop.costs?.부산물비료비 || 0,
                농약비: crop.costs?.농약비 || 0,
              },
            };
            return acc;
          }, {});

          setCropData(formattedData);
        } else {
          setError("작물 데이터를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("작물 데이터 로드 중 오류 발생:", error);
        setError("작물 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCropData();
  }, []);

  // 작물 종류에 따른 라벨 매핑
  const getCropLabel = (value) => {
    const cropMap = {
      rice: "쌀",
      vegetable: "채소",
      fruit: "과일",
      flower: "화훼",
      mushroom: "버섯",
      herb: "약초",
    };
    return cropMap[value] || value;
  };

  // 선택한 작물들의 평균 수익성 계산
  const calculateCropResults = () => {
    if (!goals.selectedCrops || goals.selectedCrops.length === 0 || !cropData) {
      return null;
    }

    const cultivationArea = Number(goals.cultivationArea) || 0;
    const selectedCropsData = goals.selectedCrops
      .map((crop) => {
        const details = cropData[crop.crop_name];
        if (!details) {
          console.error(`${crop.crop_name}에 대한 데이터가 없습니다.`);
          return null;
        }

        // 재배면적에 따른 수익 계산 (3.3m² 기준으로 계산)
        const areaRatio = cultivationArea / 3.3;

        return {
          name: crop.crop_name,
          hourly_sales: details.hourly_sales,
          sales_per_area: details.sales_per_area,
          annual_sales: details.sales_per_area * cultivationArea,
          total_cost:
            details.sales_per_area *
            cultivationArea *
            (details.total_cost / details.annual_sales),
          costs: Object.entries(details.costs || {}).map(([name, cost]) => ({
            name,
            cost:
              (cost / details.total_cost) *
              (details.sales_per_area *
                cultivationArea *
                (details.total_cost / details.annual_sales)),
          })),
        };
      })
      .filter(Boolean);

    if (selectedCropsData.length === 0) {
      return null;
    }

    // 선택된 작물들의 평균 계산
    const averageResults = {
      hourly_sales:
        selectedCropsData.reduce((sum, crop) => sum + crop.hourly_sales, 0) /
        selectedCropsData.length,
      sales_per_area:
        selectedCropsData.reduce((sum, crop) => sum + crop.sales_per_area, 0) /
        selectedCropsData.length,
      annual_sales:
        selectedCropsData.reduce((sum, crop) => sum + crop.annual_sales, 0) /
        selectedCropsData.length,
      total_cost:
        selectedCropsData.reduce((sum, crop) => sum + crop.total_cost, 0) /
        selectedCropsData.length,
      monthly_income:
        (selectedCropsData.reduce((sum, crop) => sum + crop.annual_sales, 0) -
          selectedCropsData.reduce((sum, crop) => sum + crop.total_cost, 0)) /
        (selectedCropsData.length * 12),
      net_profit:
        selectedCropsData.reduce(
          (sum, crop) => sum + (crop.annual_sales - crop.total_cost),
          0
        ) / selectedCropsData.length,
      cost_ratio: (
        (selectedCropsData.reduce((sum, crop) => sum + crop.total_cost, 0) /
          selectedCropsData.reduce((sum, crop) => sum + crop.annual_sales, 0)) *
        100
      ).toFixed(1),
    };

    // 경영비 상세 정보 통합
    const combinedCosts = {};
    selectedCropsData.forEach((crop) => {
      crop.costs.forEach(({ name, cost }) => {
        combinedCosts[name] = (combinedCosts[name] || 0) + cost;
      });
    });

    // 경영비 항목별 색상 매핑
    const costColors = {
      종자종묘비: "#FF6B6B",
      기타재료비: "#4ECDC4",
      소농구비: "#45B7D1",
      대농구상각비: "#96CEB4",
      영농시설상각비: "#FFEEAD",
      수리유지비: "#D4A5A5",
      기타비용: "#9B9B9B",
      농기계시설임차료: "#FFD93D",
      토지임차료: "#6C5B7B",
      위탁영농비: "#C06C84",
      고용노동비: "#F8B195",
      중자재종묘비: "#355C7D",
      보통비료비: "#99B898",
      부산물비료비: "#2A363B",
      농약비: "#A8E6CF",
    };

    // 경영비 항목 순서 정의
    const costOrder = [
      "수도광열비",
      "기타재료비",
      "소농구비",
      "대농구상각비",
      "영농시설상각비",
      "수리유지비",
      "기타비용",
      "농기계시설임차료",
      "토지임차료",
      "위탁영농비",
      "고용노동비",
      "종자종묘비",
      "보통비료비",
      "부산물비료비",
      "농약비",
    ];

    // 비용 데이터를 정의된 순서대로 정렬
    const costData = costOrder.map((name) => ({
      name,
      cost: Math.round((combinedCosts[name] || 0) / selectedCropsData.length),
      color: costColors[name] || "#3a9d1f", // 기본 색상
    }));

    return {
      ...averageResults,
      costData,
      selectedCropsData,
    };
  };

  const results = calculateCropResults();

  if (loading) {
    return <div className="text-center p-4">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  if (!results) {
    return <div className="text-center p-4">작물을 선택해주세요.</div>;
  }

  // 차트 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-gray-600">{payload[0].value.toLocaleString()}원</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">분석 결과</h2>
        <p className="text-gray-600">
          재배면적에 맞는 예상소득 분석 결과입니다.
        </p>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          기본 정보
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">선택한 작물</p>
            <div className="space-y-1">
              {goals.selectedCrops.map((crop, index) => (
                <p key={index} className="text-lg font-bold text-gray-800">
                  {crop.crop_name}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">재배면적</p>
            <p className="text-lg font-bold text-gray-800">
              {goals.cultivationArea.toLocaleString()}평
            </p>
          </div>
        </div>
      </div>

      {/* 수익 분석 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          수익 분석
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">시간당 매출</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.round(results.hourly_sales).toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">3.3m²당 매출</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.round(results.sales_per_area).toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">월 예상소득</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.round(results.monthly_income).toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">연간 매출액</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.round(results.annual_sales).toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">총 경영비</p>
            <p className="text-lg font-bold text-gray-800">
              {Math.round(results.total_cost).toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">경영비 비율</p>
            <p className="text-lg font-bold text-gray-800">
              {results.cost_ratio}%
            </p>
          </div>
        </div>
      </div>

      {/* 경영비 상세 분석 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          경영비 상세 분석
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results.costData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cost" name="비용">
                {results.costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
