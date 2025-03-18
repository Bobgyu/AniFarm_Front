import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTop10Data } from "../../../redux/slices/apiSlice";
import createTop5Chart from "../../../data/createTop10Chart";

const Top10Chart = () => {
  const dispatch = useDispatch();
  const top10Data = useSelector((state) => state.api.top10Data);
  const loading = useSelector((state) => state.api.loading);
  const chartRef = useRef(null);
  const dataFetchedRef = useRef(false); // 데이터 fetch 여부를 추적하는 ref 추가

  // 차트 정리 함수
  const cleanupChart = () => {
    if (chartRef.current && typeof chartRef.current.destroy === "function") {
      try {
        chartRef.current.destroy();
        chartRef.current = null;
      } catch (error) {
        console.error("차트 정리 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    if (!dataFetchedRef.current) {
      dispatch(fetchTop10Data());
      dataFetchedRef.current = true;
    }

    // 컴포넌트 언마운트 시 정리
    return cleanupChart;
  }, [dispatch]);

  // 데이터가 있을 때만 차트 생성
  useEffect(() => {
    if (!loading && top10Data && top10Data.length > 0) {
      // 이전 차트 정리
      cleanupChart();

      // 컨테이너가 존재하는지 확인
      const container = document.getElementById("top10Chart");
      if (!container) {
        console.error("차트 컨테이너를 찾을 수 없습니다.");
        return;
      }

      try {
        chartRef.current = createTop5Chart("top10Chart", top10Data);
      } catch (error) {
        console.error("차트 생성 중 오류 발생:", error);
      }
    }
  }, [top10Data, loading]);

  // 로딩 상태 표시 수정
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65] mt-[-100px]" />
      </div>
    );
  }

  if (!top10Data || top10Data.length === 0) {
    return (
      <div
        id="top10Chart"
        className="w-full h-[500px] mt-5 mb-10 border-2 border-gray-300 rounded-lg flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65]" />
      </div>
    );
  }

  return (
    <div
      id="top10Chart"
      className="w-full h-[600px] mt-5 mb-10 border-2 border-gray-300 rounded-lg"
    ></div>
  );
};

export default Top10Chart;
