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
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 경영비 상세 데이터 (예시)
  const costData = [
    {
      name: "종자종묘비",
      cost: 2850000,
      color: "#FF6B6B",
      description: "작물 재배에 필요한 종자, 묘목 구입비용",
    },
    {
      name: "비료비",
      cost: 3200000,
      color: "#4ECDC4",
      description: "화학비료, 유기질비료 등 비료 구입비용",
    },
    {
      name: "농약비",
      cost: 1500000,
      color: "#45B7D1",
      description: "살충제, 살균제, 제초제 등 농약 구입비용",
    },
    {
      name: "농자재비",
      cost: 2100000,
      color: "#96CEB4",
      description: "멀칭필름, 지주대, 포장재료 등 구입비용",
    },
    {
      name: "수도광열비",
      cost: 1800000,
      color: "#D4A5A5",
      description: "전기, 수도, 유류비 등 에너지 비용",
    },
    {
      name: "농구비",
      cost: 4200000,
      color: "#9FA4C4",
      description: "농기구 구입 및 감가상각비",
    },
    {
      name: "영농시설비",
      cost: 7500000,
      color: "#B5EAD7",
      description: "하우스, 저장고 등 시설 설치 및 감가상각비",
    },
    {
      name: "수리유지비",
      cost: 1200000,
      color: "#FFB7B2",
      description: "시설물, 농기계 수리 및 유지보수비",
    },
    {
      name: "임차료",
      cost: 5500000,
      color: "#E2F0CB",
      description: "농지, 농기계, 시설 등의 임차비용",
    },
    {
      name: "고용노동비",
      cost: 8500000,
      color: "#C7CEEA",
      description: "일용직, 상용직 등 고용 인건비",
    },
    {
      name: "위탁영농비",
      cost: 3200000,
      color: "#FF9AA2",
      description: "작업 위탁 수수료 및 용역비",
    },
    {
      name: "판매관리비",
      cost: 2800000,
      color: "#FFB347",
      description: "선별, 포장, 운송, 판매 수수료 등",
    },
  ];

  // 작물 데이터 로드
  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/crop-data");
        if (response.data.success) {
          setCropData(response.data.data);
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
  const getCropYield = () => {
    if (!goals.selectedCrops || goals.selectedCrops.length === 0) {
      return 50000; // 기본값
    }

    // 선택한 작물들의 3.3m당 매출 평균 계산
    const validYields = goals.selectedCrops
      .map((crop) => crop.sales_per_area)
      .filter((area) => area > 0);

    return validYields.length > 0
      ? validYields.reduce((a, b) => a + b, 0) / validYields.length
      : 50000;
  };

  // 분석 결과 계산
  const calculateResults = () => {
    const cropYield = getCropYield();

    if (method === "income") {
      // 기대소득 대비 분석
      const targetIncome = Number(goals.targetIncome) || 0;
      const investmentAmount = Number(goals.investmentAmount) || 0;

      // 예상 수익률 계산 (목표소득 / 투자금액 * 100)
      const expectedReturnRate =
        investmentAmount > 0
          ? ((targetIncome / investmentAmount) * 100).toFixed(1)
          : 0;

      // 예상 재배면적 계산 (목표소득 / 작물별 평균 수익성)
      const estimatedArea =
        targetIncome > 0
          ? Math.round((targetIncome / cropYield) * 3.3) // 3.3m 기준으로 변환
          : 0;

      return {
        targetIncome,
        estimatedArea,
        investmentAmount,
        expectedReturnRate,
        cropYield,
      };
    } else {
      // 재배면적 대비 분석
      const cultivationArea = Number(goals.cultivationArea) || 0;
      const investmentAmount = Number(goals.investmentAmount) || 0;

      // 예상 수익률 계산 (예상소득 / 투자금액 * 100)
      const estimatedIncome = Math.round((cultivationArea / 3.3) * cropYield); // 3.3m 기준으로 변환
      const expectedReturnRate =
        investmentAmount > 0
          ? ((estimatedIncome / investmentAmount) * 100).toFixed(1)
          : 0;

      return {
        estimatedIncome,
        cultivationArea,
        investmentAmount,
        expectedReturnRate,
        cropYield,
      };
    }
  };

  // 차트 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = costData.find((item) => item.name === label);
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
          <p className="text-gray-900 font-bold mb-1">{label}</p>
          <p className="text-[#3a9d1f] font-bold mb-2">
            {`금액: ${payload[0].value.toLocaleString()}원`}
          </p>
          <p className="text-gray-600 text-sm">{data?.description}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="text-center p-4">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  const results = calculateResults();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">분석 결과</h2>
        <p className="text-gray-600">
          {method === "income"
            ? "기대소득에 맞는 재배면적과 경영비 분석 결과입니다."
            : "재배면적에 맞는 예상소득 분석 결과입니다."}
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
              {goals.selectedCrops && goals.selectedCrops.length > 0 ? (
                goals.selectedCrops.map((crop, index) => (
                  <p key={index} className="text-lg font-bold text-gray-800">
                    {crop.crop_name} ({crop.region || "전국"})
                  </p>
                ))
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  작물이 선택되지 않았습니다.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">분석 방식</p>
            <p className="text-lg font-bold text-gray-800">
              {method === "income"
                ? "기대소득 대비 분석"
                : "재배면적 대비 분석"}
            </p>
          </div>
        </div>
      </div>

      {/* 선택한 작물 상세 정보 */}
      {goals.selectedCrops && goals.selectedCrops.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
            선택한 작물 상세 정보
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                    작물명
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                    지역
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                    시간당 매출
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                    3.3m당 매출
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {goals.selectedCrops.map((crop, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                      {crop.crop_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                      {crop.region || "전국"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                      {crop.hourly_sales.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                      {crop.sales_per_area.toLocaleString()}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 경영 분석 결과 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          경영 분석 결과
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {method === "income" ? (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-1">월 목표 소득</p>
                <p className="text-lg font-bold text-gray-800">
                  {results.targetIncome.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">예상 재배면적</p>
                <p className="text-lg font-bold text-gray-800">
                  {results.estimatedArea.toLocaleString()}㎡
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-1">재배 면적</p>
                <p className="text-lg font-bold text-gray-800">
                  {results.cultivationArea.toLocaleString()}㎡
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">예상 소득</p>
                <p className="text-lg font-bold text-gray-800">
                  {results.estimatedIncome.toLocaleString()}원
                </p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm text-gray-600 mb-1">투자 금액</p>
            <p className="text-lg font-bold text-gray-800">
              {results.investmentAmount.toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">예상 수익률</p>
            <p className="text-lg font-bold text-gray-800">
              {results.expectedReturnRate}%
            </p>
          </div>
        </div>
      </div>

      {/* 추천사항 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          추천사항
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700">
            {method === "income"
              ? `목표 소득 ${results.targetIncome.toLocaleString()}원을 달성하기 위해서는 약 ${results.estimatedArea.toLocaleString()}㎡의 재배면적이 필요합니다.`
              : `${results.cultivationArea.toLocaleString()}㎡의 재배면적에서 약 ${results.estimatedIncome.toLocaleString()}원의 소득을 기대할 수 있습니다.`}
          </p>
          <p className="text-gray-700">
            {results.expectedReturnRate > 0
              ? `투자금액 대비 예상 수익률은 ${results.expectedReturnRate}%입니다.`
              : "투자금액을 입력해주시면 예상 수익률을 확인할 수 있습니다."}
          </p>
        </div>
      </div>

      {/* 경영비 상세 분석 */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
          작물별 경영비 상세
        </h3>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={costData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}백만`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cost" name="금액" radius={[4, 4, 0, 0]}>
                {costData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            * 경영비는 작물 재배에 필요한 모든 비용을 포함합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
