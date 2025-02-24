import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchGetTop5Data } from '../../redux/slices/apiSlice'
import { createTop5Chart } from '../../data/createTop10Chart'
import tomatoes from '../../assets/images/tomatoes.jpg'
import pears from '../../assets/images/pears.jpg'
import Test1 from './Test1'
import axios from 'axios'

const Test4 = () => {
  const chartRef = useRef(null)
  const dispatch = useDispatch()
  const top5Data = useSelector((state) => state.apis.getTop5Data)
  const [videos, setVideos] = useState([])
  const [news, setNews] = useState([])
  const [rssNews, setRssNews] = useState([])
  const API_KEY = 'AIzaSyCqsyKiB_nNRn-1fxL3uPvH5a5lzmMHwj8' // YouTube API 키

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
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=농산물&type=video&maxResults=3&key=${API_KEY}`
        )
        setVideos(response.data.items)
      } catch (error) {
        console.error('YouTube API 호출 오류:', error)
      }
    }

    fetchYoutubeVideos()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('뉴스 불러오기 실패:', error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchRssNews = async () => {
      try {
        // RSS를 JSON으로 변환하는 서비스 사용 (예: rss2json.com)
        const response = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('RSS_FEED_URL')}`
        );
        setRssNews(response.data.items);
      } catch (error) {
        console.error('RSS 피드 로딩 오류:', error);
      }
    };

    fetchRssNews();
  }, []);

  return (
    <main className="w-full p-8">
        {/* 카테고리 박스 */}
        <div className="relative flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <Link to="/test5">
              <h3 className="text-center mb-4 hover:text-blue-500">Category1</h3>
            </Link>
            <Link to="/test5">
              <img 
                src={tomatoes} 
                alt="category1" 
                className="w-[600px] h-[400px] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
              />
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <Link to="/test6">
              <h3 className="text-center mb-4 hover:text-blue-500">Category2</h3>
            </Link>
            <Link to="/test6">
              <img 
                src={pears} 
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
          <div key={index} className="border border-gray-300 rounded-lg p-4 h-[250px] overflow-auto">
            <h3 className="font-bold mb-2">
              {item.title.replace(/(<([^>]+)>)/ig, '')}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {item.description.replace(/(<([^>]+)>)/ig, '')}
            </p>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              자세히 보기
            </a>
          </div>
        ))}
      </div>

      {/* 맨 하단 긴 박스 */}
      <div className="border border-gray-300 rounded-lg p-4 h-[100px]">
        <p className="text-center">커뮤니티</p>
      </div>
    </main>
  )
}

export default Test4