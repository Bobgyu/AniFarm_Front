import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchGetTop5Data } from '../../redux/slices/apiSlice'
import { createTop5Chart } from '../../data/createTop10Chart'
import pears from '../../assets/images/pears.jpg'
import cash from '../../assets/images/cash.jpg'
import defaultNewsImage from '../../assets/images/news.jpg'
import Test1 from './Test1'
import axios from 'axios'

const Test4 = () => {
  const chartRef = useRef(null)
  const dispatch = useDispatch()
  const top5Data = useSelector((state) => state.apis.getTop5Data)
  const [videos, setVideos] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(fetchGetTop5Data())
  }, [dispatch])

  useEffect(() => {
    if (top5Data) {
      try {
        createTop5Chart("top5-chart", top5Data)
      } catch (error) {
        // console.error("차트 생성 중 오류:", error)
      }
    }
  }, [top5Data])

  useEffect(() => {
    const fetchYoutubeVideos = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/youtube-videos')
        setVideos(response.data)
      } catch (error) {
        console.error('YouTube 비디오 로딩 실패:', error)
        setError('YouTube 비디오를 불러오는데 실패했습니다.')
      }
    }

    fetchYoutubeVideos()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/news');
        setNews(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('뉴스를 불러오는데 실패했습니다.');
        setLoading(false);
        console.error('뉴스 데이터 fetch 오류:', err);
      }
    };

    fetchNews();
  }, []);


  if (loading) return <div className="text-center py-4">뉴스를 불러오는 중...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <main className="w-full p-8 min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* 카테고리 박스 */}
        <div className="relative flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <Link to="/test5">
              <h3 className="text-center mb-4 hover:text-blue-500 text-2xl font-semibold">작물</h3>
            </Link>
            <Link to="/test5">
              <img 
                src={pears} 
                alt="category1" 
                className="w-[600px] h-[400px] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
              />
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <Link to="/test6">
              <h3 className="text-center mb-4 hover:text-blue-500 text-2xl font-semibold">판매</h3>
            </Link>
            <Link to="/test6">
              <img 
                src={cash} 
                alt="category2" 
                className="w-[600px] h-[400px] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
              />
            </Link>
          </div>
        </div>

      {/* 중간 2개 박스 */}
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

      {/* 하단 3x3 그리드 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 첫 번째 줄 - YouTube 비디오 */}
        {videos.map((video, index) => (
          <div key={video.id.videoId} className="border border-gray-300 rounded-lg p-4 h-[350px] overflow-hidden">
            <iframe
              className="w-full h-[300px]"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              title={video.snippet.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <p className="text-sm mt-2 truncate">{video.snippet.title}</p>
          </div>
        ))}
        
        {/* 두 번째 줄 - 뉴스 카드 */}
        {news.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <img 
              src={item.imageUrl || defaultNewsImage} 
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null; // 무한 루프 방지
                e.target.src = defaultNewsImage;
              }}
            />
            <h2 
              className="text-xl font-semibold mb-2"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p 
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                자세히 보기 →
              </a>
              <span>{new Date(item.pubDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 맨 하단 긴 박스 */}
      <Link to="/community" className="block">
        <div className="border border-gray-300  bg-white rounded-lg p-6 h-[100px] transition-colors duration-300 flex flex-col justify-center items-center cursor-pointer shadow-sm hover:shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">커뮤니티</h2>
          <p className="text-gray-600">농산물 정보와 경험을 공유하는 공간입니다</p>
        </div>
      </Link>
    </main>
  )
}

export default Test4