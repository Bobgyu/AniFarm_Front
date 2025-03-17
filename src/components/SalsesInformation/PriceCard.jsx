import React from 'react';

const PriceCard = ({ title, current, tomorrow, weekly, color, emoji, id }) => {
  const getUnit = (id) => {
    switch (id) {
      case "spinach":
        return ["원", "/4kg상자"];
      case "onion":
        return ["원", "/15kg상자"];
      case "cucumber":
        return ["원", "/15kg상자"];
      case "potato":
        return ["원", "/20kg상자"];
      case "strawberry":
        return ["원", "/2kg상자"];
      case "cabbage":
        return ["원", "/10kg망"];
      case "tomato":
        return ["원", "/10kg상자"];
      case "apple":
        return ["원", "/10kg상자"];
      case "broccoli":
        return ["원", "/8kg상자"];
      case "carrot":
        return ["원", "/20kg상자"];
      default:
        return ["원", "/kg"];
    }
  };

  return (
    <div className="mb-8">
      <h2 className={`text-2xl font-bold mb-6 text-center text-${color}-600`}>
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-2">{emoji}</span>
          <span>{title}</span>
        </div>
      </h2>
      <div className="grid gap-4">
        {/* 현재 예측 가격 */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h3 className="font-semibold mb-3 text-gray-700">현재 예측 가격</h3>
          <div className="text-center">
            <p className={`text-3xl font-bold text-${color}-600 mb-2 flex items-center justify-center`}>
              <span>{current?.price?.toLocaleString()}</span>
              <span className="text-3xl">{getUnit(id)[0]}</span>
              <span className="text-base ml-1">{getUnit(id)[1]}</span>
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
            <p className={`text-3xl font-bold text-${color}-600 mb-2 flex items-center justify-center`}>
              <span>{tomorrow?.price?.toLocaleString()}</span>
              <span className="text-3xl">{getUnit(id)[0]}</span>
              <span className="text-base ml-1">{getUnit(id)[1]}</span>
            </p>
            <p className="text-sm text-gray-600">
              정확도: {(tomorrow?.r2_score * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* 주간 예측 가격 */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
          <h3 className="font-semibold mb-3 text-gray-700">주간 예측 가격</h3>
          <div className="space-y-3">
            {weekly?.map((day, index) => (
              <div key={index} className="text-center py-2 border-b last:border-0">
                <p className={`text-xl font-semibold text-${color}-600 flex items-center justify-center`}>
                  <span>{day.price?.toLocaleString()}</span>
                  <span className="text-xl">{getUnit(id)[0]}</span>
                  <span className="text-sm ml-1">{getUnit(id)[1]}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {index + 2}일 후 (정확도: {(day.r2_score * 100).toFixed(2)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard; 