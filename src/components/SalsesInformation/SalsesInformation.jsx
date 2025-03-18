import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";

// PriceCard 컴포넌트를 별도로 분리
const PriceCard = lazy(() => import('./PriceCard'));

const SalsesInformation = () => {
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("cabbage");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const products = [
          "cabbage", "apple", "onion", "potato", "cucumber",
          "tomato", "spinach", "strawberry", "broccoli", "carrot"
        ];
        
        const responses = await Promise.all(
          products.map(product => 
            axios.get(`http://localhost:8000/predictions/${product}/Seoul`)
            .catch(error => ({ data: { error: error.message } }))
          )
        );

        const newPredictions = {};
        responses.forEach((response, index) => {
          if (!response.data.error) {
            newPredictions[products[index]] = response.data.predictions;
          } else {
            console.error(`Error fetching ${products[index]}: ${response.data.error}`);
          }
        });

        setPredictions(newPredictions);
        setLoading(false);
      } catch (err) {
        console.error("예측 데이터 가져오기 오류:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return (
    <div className="text-center p-8">
      <p className="text-lg text-gray-700">데이터를 불러오고 있습니다.</p>
      <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요...</p>
    </div>
  );

  if (error) return (
    <div className="text-center p-4 text-red-500">에러: {error}</div>
  );

  // 탭 설정
  const tabs = [
    { id: "cabbage", name: "🥬 배추", color: "green" },
    { id: "apple", name: "🍎 사과", color: "red" },
    { id: "onion", name: "🧅 양파", color: "yellow" },
    { id: "potato", name: "🥔 감자", color: "brown" },
    { id: "cucumber", name: "🥒 오이", color: "green" },
    { id: "tomato", name: "🍅 토마토", color: "red" },
    { id: "spinach", name: "🍃 시금치", color: "green" },
    { id: "strawberry", name: "🍓 딸기", color: "red" },
    { id: "broccoli", name: "🥦 브로콜리", color: "green" },
    { id: "carrot", name: "🥕 당근", color: "orange" },
  ];

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    if (!predictions[activeTab]) return (
      <div className="text-center p-4">해당 작물의 예측 데이터가 없습니다.</div>
    );

    return (
      <Suspense fallback={<div className="text-center p-4">카드 로딩중...</div>}>
        <PriceCard
          title={`${tabs.find(tab => tab.id === activeTab)?.name.split(" ")[1]} 가격 예측`}
          current={predictions[activeTab].current}
          tomorrow={predictions[activeTab].tomorrow}
          weekly={predictions[activeTab].weekly}
          color={tabs.find(tab => tab.id === activeTab)?.color}
          emoji={tabs.find(tab => tab.id === activeTab)?.name.split(" ")[0]}
          id={activeTab}
        />
      </Suspense>
    );
  };

  return (
    <div className="p-4 pt-12 max-w-4xl mx-auto bg-gray-50 min-h-screen my-8 rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        농산물 가격 예측 서비스
      </h1>

      {/* 탭 메뉴 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-2 font-medium rounded-lg transition-all duration-300 ${
              activeTab === tab.id
                ? `bg-${tab.color}-100 text-${tab.color}-600 border-2 border-${tab.color}-600 transform hover:-translate-y-1`
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border-2 border-transparent"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl mb-1">{tab.name.split(" ")[0]}</span>
              <span className="text-xs md:text-sm">{tab.name.split(" ")[1]}</span>
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center p-8">
          <p className="text-lg text-gray-700">데이터를 불러오고 있습니다.</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">에러: {error}</div>
      ) : (
        renderTabContent()
      )}

      {/* 모델 정보 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          🤖 예측 모델 정보
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          RandomForest 모델을 사용하여 기상 조건과 과거 가격 데이터를 기반으로
          예측합니다. 날씨, 계절성, 가격 추세 등 다양한 요인을 고려하여 정확한
          예측을 제공합니다.
        </p>
      </div>
    </div>
  );
};

export default SalsesInformation;
