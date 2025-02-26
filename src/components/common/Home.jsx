import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url('https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-4">AnI Farm</h1>
              <p className="text-xl mb-4">
                AI로 심고, 데이터로 키우는 당신을 위한 smart한 농사의 시작
              </p>
              <p className="text-l">
                지혜가 모이고 소통하는 공간, 함께 키워가는 AI 농업 커뮤니티
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
