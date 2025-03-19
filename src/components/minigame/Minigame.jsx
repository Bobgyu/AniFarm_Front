import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const Minigame = () => {
  const [money, setMoney] = useState(1000);
  const [inventory, setInventory] = useState([]);
  const [crops, setCrops] = useState([]);
  const [message, setMessage] = useState('');
  const [season, setSeason] = useState('봄');
  const [weather, setWeather] = useState('맑음');
  const [farmSize, setFarmSize] = useState(10);
  const [tools, setTools] = useState({
    호미: { level: 1, durability: 100 }
  });
  const [fertilizers, setFertilizers] = useState({
    일반비료: 0,
    고급비료: 0,
    특급비료: 0
  });
  const [isGameOver, setIsGameOver] = useState(false);

  const cropTypes = {
    당근: {
      growthTime: 30,
      price: 80,
      sellPrice: 120,
      growthStages: ['🌱', '🥕'],
      season: ['봄', '가을'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    배추: {
      growthTime: 45,
      price: 100,
      sellPrice: 150,
      growthStages: ['🌱', '🥬'],
      season: ['봄', '가을'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    딸기: {
      growthTime: 60,
      price: 180,
      sellPrice: 300,
      growthStages: ['🌱', '🍓'],
      season: ['봄'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    토마토: {
      growthTime: 90,
      price: 120,
      sellPrice: 200,
      growthStages: ['🌱', '🍅'],
      season: ['여름'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    고구마: {
      growthTime: 120,
      price: 150,
      sellPrice: 250,
      growthStages: ['🌱', '🍠'],
      season: ['여름', '가을'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    옥수수: {
      growthTime: 180,
      price: 200,
      sellPrice: 350,
      growthStages: ['🌱', '🌽'],
      season: ['여름'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    무: {
      growthTime: 40,
      price: 90,
      sellPrice: 140,
      growthStages: ['🌱', '🥗'],
      season: ['겨울'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    },
    양배추: {
      growthTime: 70,
      price: 160,
      sellPrice: 280,
      growthStages: ['🌱', '🥬'],
      season: ['겨울'],
      fertilizerEffects: {
        일반비료: 0.7,
        고급비료: 0.5,
        특급비료: 0.3
      }
    }
  };

  const weatherEffects = {
    맑음: { growthSpeed: 0.9, qualityBonus: 1 },
    비: { growthSpeed: 1, qualityBonus: 1.1 },
    흐림: { growthSpeed: 1, qualityBonus: 0.9 },
    폭염: { growthSpeed: 1.1, qualityBonus: 0.7 },
    한파: { growthSpeed: 1.1, qualityBonus: 0.8 }
  };

  const shopItems = {
    호미: {
      price: 500,
      durability: 100
    },
    일반비료: {
      price: 50,
      amount: 1,
      description: '재배시간 30% 감소'
    },
    고급비료: {
      price: 100,
      amount: 1,
      description: '재배시간 50% 감소'
    },
    특급비료: {
      price: 200,
      amount: 1,
      description: '재배시간 70% 감소'
    }
  };

  const weatherDescriptions = {
    맑음: '재배시간 10% 감소',
    비: '기본 재배시간',
    흐림: '기본 재배시간',
    폭염: '재배시간 10% 증가 (여름 한정)',
    한파: '재배시간 10% 증가 (겨울 한정)'
  };

  useEffect(() => {
    const seasonInterval = setInterval(() => {
      setSeason(prev => {
        const nextSeason = {
          '봄': '여름',
          '여름': '가을',
          '가을': '겨울',
          '겨울': '봄'
        }[prev] || '봄';

        // 계절이 바뀔 때 날씨도 적절하게 변경
        if (nextSeason === '여름') {
          // 여름에는 한파 제외
          setWeather(['맑음', '비', '흐림', '폭염'][Math.floor(Math.random() * 4)]);
        } else if (nextSeason === '겨울') {
          // 겨울에는 폭염 제외
          setWeather(['맑음', '비', '흐림', '한파'][Math.floor(Math.random() * 4)]);
        } else {
          setWeather(['맑음', '비', '흐림'][Math.floor(Math.random() * 3)]);
        }

        return nextSeason;
      });
    }, 300000);

    return () => clearInterval(seasonInterval);
  }, []);

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      let possibleWeathers;
      switch(season) {
        case '여름':
          // 여름에는 한파 제외
          possibleWeathers = ['맑음', '비', '흐림', '폭염'];
          break;
        case '겨울':
          // 겨울에는 폭염 제외
          possibleWeathers = ['맑음', '비', '흐림', '한파'];
          break;
        default:
          possibleWeathers = ['맑음', '비', '흐림'];
      }
      const newWeather = possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)];
      setWeather(newWeather);
    }, 300000);

    return () => clearInterval(weatherInterval);
  }, [season]);

  const checkGameOver = () => {
    if (crops.length === 0) {
      const canAffordAnyCrop = Object.values(cropTypes).some(crop => money >= crop.price);
      if (!canAffordAnyCrop) {
        setIsGameOver(true);
        return true;
      }
    }
    return false;
  };

  const plantCrop = (type) => {
    if (crops.length >= farmSize) {
      setMessage('농장이 가득 찼습니다!');
      return;
    }
    if (money >= cropTypes[type].price) {
      if (!cropTypes[type].season.includes(season)) {
        setMessage(`${type}는 ${cropTypes[type].season.join(', ')} 에만 심을 수 있습니다!`);
        return;
      }
      setMoney(prev => prev - cropTypes[type].price);
      setCrops(prev => [...prev, {
        type,
        plantedAt: Date.now(),
        stage: 0,
        isGrown: false,
        quality: 1,
        fertilized: false
      }]);
      setMessage(`${type} 씨앗을 심었습니다!`);
    } else {
      setMessage('돈이 부족합니다!');
      checkGameOver();
    }
  };

  const harvestCrop = (index) => {
    const crop = crops[index];
    if (crop.isGrown) {
      if (tools.호미.durability <= 0) {
        if (money < shopItems.호미.price) {
          setIsGameOver(true);
          return;
        }
        setMessage('호미의 내구도가 다 떨어졌습니다. 새 호미가 필요합니다!');
        return;
      }

      // 수확 실패 확률 계산
      const baseFailureRate = 0.03; // 기본 3% 실패 확률
      const weatherMultiplier = (weather === '한파' || weather === '폭염') ? 2 : 1;
      const failureRate = baseFailureRate * weatherMultiplier;
      
      // 수확 성공/실패 결정
      if (Math.random() < failureRate) {
        setCrops(prev => prev.filter((_, i) => i !== index));
        setTools(prev => ({
          ...prev,
          호미: {
            ...prev.호미,
            durability: prev.호미.durability - 5
          }
        }));
        setMessage(`${crop.type} 수확에 실패했습니다! ${weather === '한파' || weather === '폭염' ? '(악천후로 인한 실패 확률 증가)' : ''}`);
        return;
      }

      setInventory(prev => [...prev, crop.type]);
      setCrops(prev => prev.filter((_, i) => i !== index));
      setTools(prev => ({
        ...prev,
        호미: {
          ...prev.호미,
          durability: prev.호미.durability - 5
        }
      }));
      setMessage(`${crop.type}을(를) 수확했습니다!`);

      // 수확 후 게임 오버 체크
      setTimeout(() => {
        checkGameOver();
      }, 0);
    }
  };

  const sellCrop = (type) => {
    setInventory(prev => {
      const newInventory = [...prev];
      const index = newInventory.indexOf(type);
      if (index > -1) {
        newInventory.splice(index, 1);
        setMoney(prev => prev + cropTypes[type].sellPrice);
        setMessage(`${type}을(를) ${cropTypes[type].sellPrice}원에 판매했습니다!`);
        
        // 판매 후 게임 오버 체크
        setTimeout(() => {
          checkGameOver();
        }, 0);
      }
      return newInventory;
    });
  };

  const handleToolUse = (toolName, cropIndex) => {
    if (tools[toolName].durability <= 0) {
      setMessage(`${toolName}의 내구도가 다 떨어졌습니다. 수리가 필요합니다!`);
      return false;
    }
    setTools(prev => ({
      ...prev,
      [toolName]: {
        ...prev[toolName],
        durability: prev[toolName].durability - 10
      }
    }));
    return true;
  };

  const handleFertilizerUse = (type, cropIndex) => {
    if (fertilizers[type] <= 0) {
      setMessage(`${type}가 부족합니다!`);
      return false;
    }
    setFertilizers(prev => ({
      ...prev,
      [type]: prev[type] - 1
    }));
    return true;
  };

  const manageCrop = (index, action) => {
    if (action.startsWith('fertilize_')) {
      const fertilizerType = action.replace('fertilize_', '');
      if (!handleFertilizerUse(fertilizerType, index)) return;
      setCrops(prev => prev.map((crop, i) => 
        i === index ? { 
          ...crop, 
          fertilized: true, 
          fertilizerType: fertilizerType,
          quality: crop.quality * 1.2 
        } : crop
      ));
      setMessage(`${fertilizerType}를 사용했습니다!`);
    }
  };

  const expandFarm = () => {
    const expansionCost = farmSize * 1000;
    if (money >= expansionCost) {
      setMoney(prev => {
        const newMoney = prev - expansionCost;
        // 확장 후 게임 오버 체크를 위해 setTimeout 사용
        setTimeout(() => {
          if (crops.length === 0 && newMoney < Math.min(...Object.values(cropTypes).map(crop => crop.price))) {
            setIsGameOver(true);
          }
        }, 0);
        return newMoney;
      });
      setFarmSize(prev => prev + 5);
      setMessage(`농장이 확장되었습니다! (${farmSize} → ${farmSize + 5})`);
    } else {
      setMessage(`농장 확장을 위해 ${expansionCost}원이 필요합니다.`);
    }
  };

  const saveGame = () => {
    const gameState = {
      money,
      inventory,
      crops,
      farmSize,
      tools,
      fertilizers,
      season,
      weather
    };
    localStorage.setItem('farmGame', JSON.stringify(gameState));
    setMessage('게임이 저장되었습니다!');
  };

  const loadGame = () => {
    const savedGame = localStorage.getItem('farmGame');
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      setMoney(gameState.money);
      setInventory(gameState.inventory);
      setCrops(gameState.crops);
      setFarmSize(gameState.farmSize);
      setTools(gameState.tools);
      setFertilizers(gameState.fertilizers);
      setSeason(gameState.season);
      setWeather(gameState.weather);
      setMessage('게임을 불러왔습니다!');
    }
  };

  const buyItem = (itemName) => {
    const item = shopItems[itemName];
    if (money >= item.price) {
      if (itemName === '호미' && tools.호미.durability > 0) {
        setMessage('아직 호미의 내구도가 남아있습니다!');
        return;
      }
      setMoney(prev => {
        const newMoney = prev - item.price;
        // 구매 후 게임 오버 체크를 위해 setTimeout 사용
        setTimeout(() => {
          if (crops.length === 0 && newMoney < Math.min(...Object.values(cropTypes).map(crop => crop.price))) {
            setIsGameOver(true);
          }
        }, 0);
        return newMoney;
      });

      if (itemName in tools) {
        setTools(prev => ({
          ...prev,
          [itemName]: { level: 1, durability: item.durability }
        }));
        setMessage(`${itemName}을(를) 구매했습니다!`);
      } else {
        setFertilizers(prev => ({
          ...prev,
          [itemName]: prev[itemName] + item.amount
        }));
        setMessage(`${itemName}을(를) 구매했습니다!`);
      }
    } else {
      setMessage('돈이 부족합니다!');
    }
  };

  const restartGame = () => {
    setMoney(1000);
    setInventory([]);
    setCrops([]);
    setFarmSize(10);
    setTools({
      호미: { level: 1, durability: 100 }
    });
    setFertilizers({
      일반비료: 0,
      고급비료: 0,
      특급비료: 0
    });
    setSeason('봄');
    setWeather('맑음');
    setIsGameOver(false);
    setMessage('');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCrops(prev => prev.map(crop => {
        const baseGrowthTime = cropTypes[crop.type].growthTime * 1000;
        const fertilizerMultiplier = crop.fertilized ? 
          cropTypes[crop.type].fertilizerEffects[crop.fertilizerType] : 1;
        const seasonMultiplier = cropTypes[crop.type].season.includes(season) ? 1 : 0.5;
        const weatherMultiplier = weatherEffects[weather].growthSpeed;
        const timePassed = Date.now() - crop.plantedAt;
        
        const totalGrowthTime = baseGrowthTime * fertilizerMultiplier * weatherMultiplier / seasonMultiplier;
        
        if (timePassed >= totalGrowthTime && !crop.isGrown) {
          const qualityBonus = weatherEffects[weather].qualityBonus;
          const finalQuality = crop.quality * qualityBonus * (crop.fertilized ? 1.2 : 1);
          
          setMessage(`${crop.type}이(가) 다 자랐습니다! (품질: ${finalQuality.toFixed(1)})`);
          return { ...crop, stage: 1, isGrown: true, quality: finalQuality };
        }
        return crop;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [weather, season]);

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">🌾 농작물 미니게임 🌾</h2>
        
        <div className="text-xl text-center mb-4">
          보유 금액: <span className="font-bold text-green-600">{money}원</span>
        </div>
        
        {message && (
          <div className="text-center mb-4 text-blue-600">{message}</div>
        )}

        <div className="flex justify-between mb-4">
          <div className="text-lg">
            계절: {season} {season === '봄' ? '🌸' : season === '여름' ? '☀️' : season === '가을' ? '🍁' : '❄️'}
          </div>
          <div className="text-lg relative group">
            <div className="cursor-help">
              날씨: {weather} {
                weather === '맑음' ? '☀️' : 
                weather === '비' ? '🌧️' : 
                weather === '흐림' ? '☁️' : 
                weather === '폭염' ? '🌡️' : '❄️'
              }
            </div>
            <div className="absolute hidden group-hover:block bg-black text-white text-sm p-2 rounded-lg -bottom-12 right-0 whitespace-nowrap z-10">
              {weatherDescriptions[weather]}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">도구 상태</h3>
            {Object.entries(tools).map(([name, tool]) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span>내구도: {tool.durability}%</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">보유 비료</h3>
            {Object.entries(fertilizers).map(([name, amount]) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span>{amount}개</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">씨앗 구매</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(cropTypes).map(([type, info]) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg ${
                  money >= info.price 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300'
                } text-white transition-colors`}
                onClick={() => plantCrop(type)}
                disabled={money < info.price}
              >
                {type} 심기 ({info.price}원)
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">농장 ({crops.length}/{farmSize}칸)</h3>
          <div className="grid grid-cols-5 gap-4">
            {crops.slice(0, farmSize).map((crop, index) => {
              const baseGrowthTime = cropTypes[crop.type].growthTime * 1000;
              const fertilizerMultiplier = crop.fertilized ? 
                cropTypes[crop.type].fertilizerEffects[crop.fertilizerType] : 1;
              const seasonMultiplier = cropTypes[crop.type].season.includes(season) ? 1 : 0.5;
              const weatherMultiplier = weatherEffects[weather].growthSpeed;
              const timePassed = Date.now() - crop.plantedAt;
              
              const totalGrowthTime = baseGrowthTime * fertilizerMultiplier * weatherMultiplier / seasonMultiplier;
              const timeLeft = Math.max(0, totalGrowthTime - timePassed);
              const secondsLeft = Math.ceil(timeLeft / 1000);

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className="relative text-4xl cursor-pointer p-4 bg-green-100 rounded-lg flex flex-col items-center justify-center"
                  onClick={() => harvestCrop(index)}
                >
                  <div>{cropTypes[crop.type].growthStages[crop.stage]}</div>
                  {!crop.isGrown && (
                    <div className="absolute bottom-1 text-sm font-bold text-gray-700">
                      {secondsLeft}초
                    </div>
                  )}
                  {!crop.fertilized && !crop.isGrown && (
                    <div className="absolute top-0 right-0 flex flex-col gap-1">
                      {Object.keys(fertilizers).map(type => (
                        fertilizers[type] > 0 && (
                          <button
                            key={type}
                            onClick={(e) => {
                              e.stopPropagation();
                              manageCrop(index, `fertilize_${type}`);
                            }}
                            className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                          >
                            {type.charAt(0)}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {[...Array(Math.max(0, farmSize - crops.length))].map((_, index) => (
              <div
                key={`empty-${index}`}
                className="text-4xl p-4 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                🟫
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">인벤토리</h3>
          <div className="grid grid-cols-5 gap-4">
            {inventory.map((type, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="text-4xl cursor-pointer p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg flex flex-col items-center"
                onClick={() => sellCrop(type)}
              >
                <div>{cropTypes[type].growthStages[1]}</div>
                <div className="text-sm mt-2">{cropTypes[type].sellPrice}원</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">상점</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(shopItems).map(([itemName, info]) => (
              <motion.button
                key={itemName}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg ${
                  money >= info.price && (itemName !== '호미' || tools.호미.durability <= 0)
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-300'
                } text-white transition-colors flex flex-col items-center`}
                onClick={() => buyItem(itemName)}
                disabled={money < info.price || (itemName === '호미' && tools.호미.durability > 0)}
              >
                <div>{itemName} ({info.price}원)</div>
                {info.description && (
                  <div className="text-xs mt-1">{info.description}</div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-full mb-4 p-2 bg-blue-500 text-white rounded-lg"
          onClick={expandFarm}
        >
          농장 확장 ({farmSize * 1000}원)
        </motion.button>

        <div className="flex gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 p-2 bg-green-500 text-white rounded-lg"
            onClick={saveGame}
          >
            게임 저장
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex-1 p-2 bg-yellow-500 text-white rounded-lg"
            onClick={loadGame}
          >
            게임 불러오기
          </motion.button>
        </div>

        {isGameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
              <h2 className="text-2xl font-bold text-center mb-4">게임 오버</h2>
              <p className="text-center mb-6">
                씨앗을 구매할 수 없습니다.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={restartGame}
                >
                  다시 시작
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  onClick={loadGame}
                >
                  저장된 게임 불러오기
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Minigame;