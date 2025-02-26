import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTop5Chart } from "../../data/createTop10Chart";
import { fetchGetTop5Data } from "../../redux/slices/apiSlice";
import AccordionItem from "../common/AccordionItem";
import Test1 from "../test/Test1";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section with AccordionItem */}
      <section className="w-full h-[80vh] relative overflow-hidden">
        <AccordionItem />
      </section>

      {/* Charts Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Top 5 농산물 현황
            </h2>
            <div 
              id="top5-chart" 
              ref={chartRef} 
              className="w-full h-[400px]"
            />
          </div>
          {/* Test1 Component */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              실시간 데이터
            </h2>
            <Test1 />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
