import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BsSun,
  BsCloudSun,
  BsCloud,
  BsClouds,
  BsCloudRain,
  BsCloudRainHeavy,
  BsCloudLightningRain,
  BsSnow,
  BsCloudFog,
} from "react-icons/bs";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);  // 도시 목록
  const [selectedCity, setSelectedCity] = useState("서울");  // 선택된 도시
  const [satelliteData, setSatelliteData] = useState(null);
  const [imageType, setImageType] = useState('truecolor');
  const mapRef = useRef(null);

  // 도시 목록 가져오기
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:8000/cities");
        if (response.data.success) {
          setCities(response.data.data.cities);
        }
      } catch (err) {
        console.error("도시 목록 가져오기 오류:", err);
      }
    };

    fetchCities();
  }, []);

  // 날씨 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const weatherResponse = await axios.get(
          "http://localhost:8000/weather",
          {
            params: { city: selectedCity },
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        console.log("날씨 데이터 응답:", weatherResponse);

        if (weatherResponse.data.success && weatherResponse.data.data.raw && weatherResponse.data.data.raw.list) {
          const dailyData = processWeatherData(weatherResponse.data.data.raw.list);
          setWeatherData(dailyData);
        } else {
          throw new Error("날씨 데이터 형식이 올바르지 않습니다");
        }
      } catch (err) {
        console.error("데이터 가져오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity]);  // selectedCity가 변경될 때마다 실행

  // 위성 이미지 데이터 가져오기
  useEffect(() => {
    const fetchSatelliteData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/satellite");
        console.log("Satellite API Response:", response.data);  // 로그 추가
        
        if (response.data.success && response.data.data) {
          setSatelliteData(response.data);
        } else {
          console.error("위성 데이터 형식이 올바르지 않습니다:", response.data);
        }
      } catch (err) {
        console.error("위성 데이터 가져오기 오류:", err);
      }
    };

    fetchSatelliteData();
  }, []);

  const processWeatherData = (list) => {
    if (!Array.isArray(list)) {
      console.error("리스트 데이터가 배열이 아닙니다:", list);
      return [];
    }

    const dailyData = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // 해당 날짜의 데이터 필터링
      const dayData = list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getDate() === date.getDate();
      });

      if (dayData.length > 0) {
        // 일일 데이터 계산
        const dayWeather = {
          dt: date.getTime() / 1000,
          main: {
            temp_max: Math.max(...dayData.map(d => d.main.temp_max)),
            temp_min: Math.min(...dayData.map(d => d.main.temp_min)),
            temp: dayData.reduce((sum, d) => sum + d.main.temp, 0) / dayData.length,
            humidity: dayData[0].main.humidity
          },
          weather: dayData[0].weather,
          pop: Math.round(Math.max(...dayData.map(d => d.pop || 0)) * 100),
          rain: dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0)
        };
        
        dailyData.push(dayWeather);
      }
    }

    console.log("처리된 일일 데이터:", dailyData);
    return dailyData;
  };

  const createNewDataFrame = (dailyData) => {
    const newData = dailyData.map((day) => ({
      "avg temp": Math.round(day.main.temp),
      "max temp": Math.round(day.main.temp_max),
      "min temp": Math.round(day.main.temp_min),
      rainFall: day.rain ? day.rain.toFixed(1) : "0.0",
    }));

    console.log(newData); // 콘솔에 새로운 데이터프레임 출력
  };

  const getWeatherIcon = (iconCode) => {
    const dayIcon = iconCode.replace("n", "d");

    const iconMap = {
      "01d": <BsSun className="w-10 h-10 text-yellow-400" />,
      "02d": <BsCloudSun className="w-10 h-10 text-blue-400" />,
      "03d": <BsCloud className="w-10 h-10 text-gray-500" />,
      "04d": <BsClouds className="w-10 h-10 text-gray-600" />,
      "09d": <BsCloudRain className="w-10 h-10 text-blue-500" />,
      "10d": <BsCloudRainHeavy className="w-10 h-10 text-blue-600" />,
      "11d": <BsCloudLightningRain className="w-10 h-10 text-yellow-500" />,
      "13d": <BsSnow className="w-10 h-10 text-blue-200" />,
      "50d": <BsCloudFog className="w-10 h-10 text-gray-400" />,
    };

    return iconMap[dayIcon] || <BsSun className="w-10 h-10 text-yellow-400" />;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(price));
  };

  // 탭 스타일을 위한 함수 추가
  const getTabStyle = (city) => {
    return `px-4 py-2 rounded-lg transition-all duration-200 ${
      selectedCity === city
        ? "bg-blue-500 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!weatherData) return <div>날씨 데이터가 없습니다.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 도시 선택 탭 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <h2 className="text-xl font-medium col-span-2">지역별 날씨</h2>
        </div>
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-xl shadow-sm">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={getTabStyle(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 날씨 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-black">
            {selectedCity} 주간예보
          </h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* 전체 컨테이너에 동일한 width 적용 */}
        <div className="max-w-3xl mx-auto">
          {/* 오늘과 내일 날씨 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {weatherData.slice(0, 2).map((day, index) => {
              const date = new Date(day.dt * 1000);
              return (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg">
                        {index === 0 ? "오늘" : "내일"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {date.getMonth() + 1}.{date.getDate()}.
                      </div>
                      <div className="mt-2">
                        {getWeatherIcon(day.weather[0].icon)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">
                          {Math.round(day.main.temp_min)}°
                        </span>
                        <span className="text-gray-500">
                          {Math.round(day.main.temp)}°
                        </span>
                        <span className="text-red-500">
                          {Math.round(day.main.temp_max)}°
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">습도 {day.main.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">
                          강수확률 {day.pop || 0}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">
                          강수량 {day.rain ? day.rain.toFixed(1) : "0.0"}mm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 주간 날씨 */}
          <div className="grid grid-cols-6 gap-2">
            {weatherData.slice(0, 6).map((day, index) => {
              const date = new Date(day.dt * 1000);
              const weekday = new Intl.DateTimeFormat("ko-KR", {
                weekday: "short",
              }).format(date);
              return (
                <div key={index} className="text-center p-2">
                  <div className="font-medium">{weekday}</div>
                  <div className="text-sm text-gray-500">
                    {date.getMonth() + 1}.{date.getDate()}.
                  </div>
                  <div className="flex justify-center items-center my-2">
                    {getWeatherIcon(day.weather[0].icon)}
                  </div>
                  <div className="flex justify-center gap-2 text-sm">
                    <span className="text-blue-500">
                      {Math.round(day.main.temp_min)}°
                    </span>
                    <span className="text-gray-500">
                      {Math.round(day.main.temp)}°
                    </span>
                    <span className="text-red-500">
                      {Math.round(day.main.temp_max)}°
                    </span>
                  </div>
                  <div className="text-sm text-blue-500">{day.pop || 0}%</div>
                  <div className="text-sm text-blue-500">
                    {day.rain ? day.rain.toFixed(1) : "0.0"}mm
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 위성 이미지 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">한반도 위성 영상</h2>
          <span className="text-sm text-gray-500">
            {satelliteData?.data?.timestamp ? 
              new Date(satelliteData.data.timestamp).toLocaleString() : 
              '10분마다 업데이트'
            }
          </span>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-100">
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              {satelliteData?.data?.imageUrl && (
                <div className="w-full h-full">
                  <iframe
                    src={satelliteData.data.imageUrl}
                    title="한반도 위성 영상"
                    className="w-full h-full border-0"
                    style={{ 
                      minHeight: '700px',  // 높이 증가
                      width: '100%'
                    }}
                    sandbox="allow-same-origin allow-scripts"
                    loading="lazy"
                    onError={(e) => {
                      console.log("iframe 로딩 실패:", satelliteData.data.imageUrl);
                      const container = e.target.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="flex items-center justify-center h-full text-gray-500">
                            <div class="text-center">
                              <p>위성 영상을 불러올 수 없습니다</p>
                              <p class="text-sm mt-2">잠시 후 다시 시도해주세요</p>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            기상청 제공
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          * 위성 영상은 10분마다 업데이트됩니다
        </div>
      </div>
    </div>
  );
};

export default Weather;