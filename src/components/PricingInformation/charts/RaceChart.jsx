import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMarketData } from "../../../redux/slices/apiSlice";
import { createMarketChart } from "../../../data/marketChart";

const RaceChart = () => {
  const dispatch = useDispatch();
  const marketData = useSelector((state) => state.api.marketData);
  const loading = useSelector((state) => state.api.loading);
  const chartRef = useRef(null);

  // 영문 키를 한글로 매핑하는 객체
  const keyMapping = {
    strawberry: "딸기",
    rice: "쌀",
    mandarin: "감귤",
    apple: "사과",
    seaweed: "김",
    banana: "바나나",
    grape: "포도",
    green_onion: "대파",
    onion: "양파",
    cherry_tomato: "방울토마토",
    sweet_potato: "고구마",
    pear: "배",
    tomato: "토마토",
    garlic: "마늘",
    spinach: "시금치",
    cucumber: "오이",
    kiwi: "참다래",
    squid: "물오징어",
    abalone: "전복",
    shrimp: "새우",
    cabbage: "배추",
    oyster: "굴",
    watermelon: "수박",
    peach: "복숭아",
    oriental_melon: "참외",
  };

  // 배열을 객체로 변환하는 함수
  const transformData = (data) => {
    if (!Array.isArray(data)) {
      console.log("Input data is not an array:", data);
      return null;
    }

    const transformedData = {};
    data.forEach((weekData, index) => {
      const weekNumber = (index + 1).toString().padStart(2, "0");
      const weekObj = {};

      // API 응답의 각 항목을 순회하며 변환
      Object.entries(weekData).forEach(([key, value]) => {
        if (key !== "week" && value !== null) {
          // week 필드 제외하고 null이 아닌 값만 처리
          const koreanKey = keyMapping[key];
          if (koreanKey) {
            weekObj[koreanKey] = parseFloat(value); // 문자열로 된 숫자를 실수로 변환
          }
        }
      });

      transformedData[`2024${weekNumber}`] = weekObj;
    });

    return transformedData;
  };

  useEffect(() => {
    dispatch(fetchMarketData());
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    // 이전 차트 정리
    if (chartRef.current) {
      chartRef.current.dispose();
      chartRef.current = null;
    }

    if (marketData && marketData.length > 0) {
      const transformedData = transformData(marketData);

      if (transformedData) {
        // 새 차트 생성
        chartRef.current = createMarketChart("chartdiv", transformedData);
      }
    }

    // 컴포넌트 언마운트 시 차트 정리
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [marketData, loading]);

  if (loading) return <div>로딩 중...</div>;
  if (!marketData || marketData.length === 0) {
    return (
      <div
        id="chartdiv"
        className="w-full h-[500px] mt-5 mb-10 border-2 border-gray-300 rounded-lg flex items-center justify-center"
      >
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div
      id="chartdiv"
      className="w-full h-[600px] mt-5 mb-10 border-2 border-gray-300 rounded-lg"
    ></div>
  );
};

export default RaceChart;
