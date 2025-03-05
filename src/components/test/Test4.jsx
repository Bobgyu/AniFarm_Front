import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchGetTop5Data, fetchTop10Data } from "../../redux/slices/apiSlice";
import { createTop5Chart } from "../../data/createTop10Chart";
import pears from "../../assets/images/pears.jpg";
import cash from "../../assets/images/cash.jpg";
import defaultNewsImage from "../../assets/images/news.jpg";
import Test1 from "./Test1";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Test4 = () => {
  const dispatch = useDispatch();
  const top10Data = useSelector((state) => state.api.top10Data);
  const loading = useSelector((state) => state.api.loading);
  const error = useSelector((state) => state.api.error);

  useEffect(() => {
    dispatch(fetchTop10Data());
  }, [dispatch]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!top10Data) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <h2>Top 10 차트</h2>
      <BarChart width={800} height={400} data={top10Data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Test4;
