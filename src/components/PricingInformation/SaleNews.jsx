import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news', {
          params: { query: '농산물 가격' } // 필요에 따라 쿼리 값을 조절하세요.
        });
        setNews(response.data.items || []);
      } catch (error) {
        console.error("뉴스 데이터 fetch 오류:", error);
        setNews([]);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="w-full max-w-[1280px] px-4 mx-auto pb-12">
      <h2 className="text-3xl font-bold text-center mt-8 md:mt-16 mb-12 text-gray-800">
        최신 농산물 가격 뉴스
      </h2>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <h3 className="text-lg font-semibold text-blue-500 mb-2 line-clamp-2 hover:text-blue-700 transition-colors duration-400">
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-[500px] mt-5 mb-10 border-2 border-gray-300 rounded-lg flex items-center justify-center">
          뉴스 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SaleNews;