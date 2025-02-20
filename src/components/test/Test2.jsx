import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test2 = () => {
  const [cabbagePredictions, setCabbagePredictions] = useState(null);
  const [applePredictions, setApplePredictions] = useState(null);
  const [onionPredictions, setOnionPredictions] = useState(null);
  const [potatoPredictions, setPotatoPredictions] = useState(null);
  const [cucumberPredictions, setCucumberPredictions] = useState(null);
  const [tomatoPredictions, setTomatoPredictions] = useState(null);
  const [spinachPredictions, setSpinachPredictions] = useState(null);
  const [paprikaPredictions, setPaprikaPredictions] = useState(null);
  const [pepperPredictions, setPepperPredictions] = useState(null);
  const [lettucePredictions, setLettucePredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('cabbage'); // 현재 활성화된 탭

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const [cabbageResponse, appleResponse, onionResponse, potatoResponse, cucumberResponse, tomatoResponse, 
          spinachResponse, paprikaResponse, pepperResponse, lettuceResponse] = await Promise.all([
          axios.get('http://localhost:8000/predictions/cabbage/Seoul'),
          axios.get('http://localhost:8000/predictions/apple/Seoul'),
          axios.get('http://localhost:8000/predictions/onion/Seoul'),
          axios.get('http://localhost:8000/predictions/potato/Seoul'),
          axios.get('http://localhost:8000/predictions/cucumber/Seoul'),
          axios.get('http://localhost:8000/predictions/tomato/Seoul'),
          axios.get('http://localhost:8000/predictions/spinach/Seoul'),
          axios.get('http://localhost:8000/predictions/paprika/Seoul'),
          axios.get('http://localhost:8000/predictions/pepper/Seoul'),
          axios.get('http://localhost:8000/predictions/lettuce/Seoul')
        ]);
        
        if (cabbageResponse.data.error) {
          throw new Error(cabbageResponse.data.error);
        }
        if (appleResponse.data.error) {
          throw new Error(appleResponse.data.error);
        }
        if (onionResponse.data.error) {
          throw new Error(onionResponse.data.error);
        }
        if (potatoResponse.data.error) {
          throw new Error(potatoResponse.data.error);
        }
        if (cucumberResponse.data.error) {
          throw new Error(cucumberResponse.data.error);
        }
        if (tomatoResponse.data.error) {
          throw new Error(tomatoResponse.data.error);
        }
        if (spinachResponse.data.error) {
          throw new Error(spinachResponse.data.error);
        }
        if (paprikaResponse.data.error) {
          throw new Error(paprikaResponse.data.error);
        }
        if (pepperResponse.data.error) {
          throw new Error(pepperResponse.data.error);
        }
        if (lettuceResponse.data.error) {
          throw new Error(lettuceResponse.data.error);
        }
        
        setCabbagePredictions(cabbageResponse.data.predictions);
        setApplePredictions(appleResponse.data.predictions);
        setOnionPredictions(onionResponse.data.predictions);
        setPotatoPredictions(potatoResponse.data.predictions);
        setCucumberPredictions(cucumberResponse.data.predictions);
        setTomatoPredictions(tomatoResponse.data.predictions);
        setSpinachPredictions(spinachResponse.data.predictions);
        setPaprikaPredictions(paprikaResponse.data.predictions);
        setPepperPredictions(pepperResponse.data.predictions);
        setLettucePredictions(lettuceResponse.data.predictions);
      } catch (err) {
        console.error('예측 데이터 가져오기 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-center p-4 text-red-500">에러: {error}</div>;
  if (!cabbagePredictions || !applePredictions || !onionPredictions || !potatoPredictions || !cucumberPredictions || !tomatoPredictions || !spinachPredictions || !paprikaPredictions || !pepperPredictions || !lettucePredictions) return <div className="text-center p-4">데이터가 없습니다.</div>;

  // 탭 설정 - 이모지 변경
  const tabs = [
    { id: 'cabbage', name: '🥬 배추', color: 'green' },
    { id: 'apple', name: '🍎 사과', color: 'red' },
    { id: 'onion', name: '🧅 양파', color: 'yellow' },
    { id: 'potato', name: '🥔 감자', color: 'brown' },
    { id: 'cucumber', name: '🥒 오이', color: 'emerald' },
    { id: 'tomato', name: '🍅 토마토', color: 'red' },
    { id: 'spinach', name: '🍃 시금치', color: 'green' },
    { id: 'paprika', name: '🫑 파프리카', color: 'red' },
    { id: 'pepper', name: '🌶️ 고추', color: 'red' },
    { id: 'lettuce', name: '🥙 상추', color: 'green' }
  ];

  const PriceCard = ({ title, current, tomorrow, weekly, color, emoji }) => (
    <div className="mb-8">
      <h2 className={`text-2xl font-bold mb-6 text-center text-${color}-600`}>
        <span className="text-3xl mr-2">{emoji}</span>
        {title}
      </h2>
      <div className="grid gap-4">
        {/* 현재 예측 가격 */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h3 className="font-semibold mb-3 text-gray-700">현재 예측 가격</h3>
          <div className="text-center">
            <p className={`text-3xl font-bold text-${color}-600 mb-2`}>
              {current?.price?.toLocaleString()}원/kg
            </p>
            <p className="text-sm text-gray-600">
              정확도: {(current?.r2_score * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 내일 예측 가격 */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h3 className="font-semibold mb-3 text-gray-700">내일 예측 가격</h3>
          <div className="text-center">
            <p className={`text-3xl font-bold text-${color}-600 mb-2`}>
              {tomorrow?.price?.toLocaleString()}원/kg
            </p>
            <p className="text-sm text-gray-600">
              정확도: {(tomorrow?.r2_score * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 주간 예측 가격 */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h3 className="font-semibold mb-3 text-gray-700">주간 예측 가격</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weekly?.map((day, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-700">{index + 1}일 후</p>
                <p className={`text-lg font-bold text-${color}-600 my-1`}>
                  {day.price?.toLocaleString()}원/kg
                </p>
                <p className="text-xs text-gray-600">
                  정확도: {(day.r2_score * 100).toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        농산물 가격 예측 서비스
      </h1>
      
      {/* 탭 메뉴 */}
      <div className="flex justify-center border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 mx-2 font-medium rounded-t-lg transition-all duration-300 ${
              activeTab === tab.id
                ? `bg-${tab.color}-100 text-${tab.color}-600 border-b-2 border-${tab.color}-600 transform -translate-y-1`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-xl">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 선택된 탭에 따른 컨텐츠 표시 */}
      {activeTab === 'cabbage' && (
        <PriceCard 
          title="배추 가격 예측"
          current={cabbagePredictions.current}
          tomorrow={cabbagePredictions.tomorrow}
          weekly={cabbagePredictions.weekly}
          color="green"
          emoji="🥬"
        />
      )}
      {activeTab === 'apple' && (
        <PriceCard 
          title="사과 가격 예측"
          current={applePredictions.current}
          tomorrow={applePredictions.tomorrow}
          weekly={applePredictions.weekly}
          color="red"
          emoji="🍎"
        />
      )}
      {activeTab === 'onion' && (
        <PriceCard 
          title="양파 가격 예측"
          current={onionPredictions.current}
          tomorrow={onionPredictions.tomorrow}
          weekly={onionPredictions.weekly}
          color="yellow"
          emoji="🧅"
        />
      )}
      {activeTab === 'potato' && (
        <PriceCard 
          title="감자 가격 예측"
          current={potatoPredictions.current}
          tomorrow={potatoPredictions.tomorrow}
          weekly={potatoPredictions.weekly}
          color="brown"
          emoji="🥔"
        />
      )}
      {activeTab === 'cucumber' && (
        <PriceCard 
          title="오이 가격 예측"
          current={cucumberPredictions.current}
          tomorrow={cucumberPredictions.tomorrow}
          weekly={cucumberPredictions.weekly}
          color="emerald"
          emoji="🥒"
        />
      )}
      {activeTab === 'tomato' && (
        <PriceCard 
          title="토마토 가격 예측"
          current={tomatoPredictions.current}
          tomorrow={tomatoPredictions.tomorrow}
          weekly={tomatoPredictions.weekly}
          color="red"
          emoji="🍅"
        />
      )}
      {activeTab === 'spinach' && (
        <PriceCard 
          title="시금치 가격 예측"
          current={spinachPredictions.current}
          tomorrow={spinachPredictions.tomorrow}
          weekly={spinachPredictions.weekly}
          color="green"
          emoji="🍃"
        />
      )}
      {activeTab === 'paprika' && (
        <PriceCard 
          title="파프리카 가격 예측"
          current={paprikaPredictions.current}
          tomorrow={paprikaPredictions.tomorrow}
          weekly={paprikaPredictions.weekly}
          color="red"
          emoji="🫑"
        />
      )}
      {activeTab === 'pepper' && (
        <PriceCard 
          title="고추 가격 예측"
          current={pepperPredictions.current}
          tomorrow={pepperPredictions.tomorrow}
          weekly={pepperPredictions.weekly}
          color="red"
          emoji="🌶️"
        />
      )}
      {activeTab === 'lettuce' && (
        <PriceCard 
          title="상추 가격 예측"
          current={lettucePredictions.current}
          tomorrow={lettucePredictions.tomorrow}
          weekly={lettucePredictions.weekly}
          color="green"
          emoji="🥙"
        />
      )}

      {/* 모델 정보 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">🤖 예측 모델 정보</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          RandomForest 모델을 사용하여 기상 조건과 과거 가격 데이터를 기반으로 예측합니다.
          날씨, 계절성, 가격 추세 등 다양한 요인을 고려하여 정확한 예측을 제공합니다.
        </p>
      </div>
    </div>
  );
};

export default Test2;