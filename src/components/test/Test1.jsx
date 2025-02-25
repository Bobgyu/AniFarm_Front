import React, { useState, useEffect } from "react";
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

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!weatherData) return <div>날씨 데이터가 없습니다.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 도시 선택 드롭다운 추가 */}
      <div className="mb-4">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* 날씨 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4 text-black">
          {selectedCity} 주간예보
        </h2>
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
    </div>
  );
};

export default Weather;