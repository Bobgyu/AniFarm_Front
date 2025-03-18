import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SaleNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // list=19 을 쿼리 파라미터로 전달 (SaleNews용 크롤링 링크)
        const response = await axios.get('http://localhost:8000/api/crawler/news-links?list=19');
        // response.data.news_links 가 기사 배열로 구성되어 있다고 가정합니다.
        setNews(response.data.news_links || []);
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

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleNews = news.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full max-w-[1280px] px-4 mx-auto pb-12">
      
     
      {news.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visibleNews.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* 이미지 URL이 존재하면 이미지 표시 */}
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-500 hover:text-blue-700 transition-colors p-3">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </a>
                  </h3>
                  {/* 뉴스 본문(content) 3줄까지만 표시 */}
                  <p 
                    className="text-gray-600 text-sm mt-2"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {article.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* 페이지 네비게이션 */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 0}
              className={`p-2 rounded-full bg-white shadow-lg ${
                currentPage === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <FaChevronLeft size={24} />
            </button>
            <span className="text-gray-700">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages - 1}
              className={`p-2 rounded-full bg-white shadow-lg ${
                currentPage >= totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <FaChevronRight size={24} />
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-[500px] mt-5 mb-10 border-2 border-gray-300 rounded-lg flex items-center justify-center">
          뉴스 데이터가 없습니다.
        </div>
      )}
    </div>
  );
};

export default SaleNews;