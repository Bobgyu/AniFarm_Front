import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const Culture = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            스마트 농업 관리 시스템
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            AI 기반 작물 관리와 병충해 예방으로 더 나은 농작물 생산을 시작하세요
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {/* 육성법 카드 */}
          <Link to="/trainingMethod">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-3xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">육성법</h3>
                <p className="text-gray-600">
                  최적화된 작물 육성 방법을 확인하고 관리하세요
                </p>
              </div>
            </motion.div>
          </Link>

          {/* 병충해 카드 */}
          <Link to="/pests">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">병충해</h3>
                <p className="text-gray-600">
                  AI가 분석하는 병충해 진단 및 해결책을 확인하세요
                </p>
              </div>
            </motion.div>
          </Link>

          {/* 날씨 카드 */}
          <Link to="/test2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-3xl mb-4">🌤️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">날씨</h3>
                <p className="text-gray-600">
                  실시간 날씨 정보와 농작물 가격 예측을 확인하세요
                </p>
              </div>
            </motion.div>
          </Link>

          {/* 커뮤니티 카드 */}
          <Link to="/Community">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">커뮤니티</h3>
                <p className="text-gray-600">
                  다른 농부들과 정보를 공유하고 소통하세요
                </p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Culture;