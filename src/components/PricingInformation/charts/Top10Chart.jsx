import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import createTop10Chart from "../../../data/createTop10Chart";
import { fetchTop10Data } from "../../../redux/slices/apiSlice";

const Top10Chart = () => {
  const chartRef = useRef(null);
  const dispatch = useDispatch();
  const top10Data = useSelector((state) => state.apis.getTop10Data);
  const loading = useSelector((state) => state.apis.loading);

  useEffect(() => {
    dispatch(fetchTop10Data());
  }, [dispatch]);

  useEffect(() => {
    if (top10Data) {
      // console.log("받은 데이터:", top10Data); // 데이터 확인용 로그
      try {
        const chart = createTop10Chart("top10container", top10Data);
        chartRef.current = chart;
      } catch (error) {
        console.error("차트 생성 중 오류:", error);
      }
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy(); // Highcharts의 경우 destroy() 메서드 사용
        } catch (error) {
          console.error("차트 정리 중 오류:", error);
        }
        chartRef.current = null;
      }
    };
  }, [top10Data]);

  if (loading) return <div>로딩 중...</div>;
  if (!top10Data) return <div>데이터를 불러오는 중...</div>;

  return (
    <div
      id="top10container"
      className="w-full h-[500px] mt-5 mb-10 border-2 border-gray-300 rounded-lg"
    ></div>
  );
};

export default Top10Chart;
