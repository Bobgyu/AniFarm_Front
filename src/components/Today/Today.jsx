import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { BsArrowUpCircleFill, BsArrowDownCircleFill, BsDashCircleFill } from 'react-icons/bs';

const Today = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('200'); // 기본값은 채소류
  const [frozenData, setFrozenData] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/price');
        console.log('API Response:', response.data);

        // 현재 시간이 오후 3시 이전인지 확인
        const now = new Date();
        const updateTime = new Date();
        updateTime.setHours(15, 0, 0, 0);
        
        // 새로운 데이터 처리 로직
        if (response.data && response.data.data && response.data.data.item) {
          // 가장 최근의 유효한 데이터를 찾기 위한 임시 저장소
          const latestValidData = {};
          let hasValidDpr1Data = false; // dpr1 데이터가 있는지 확인하는 플래그
          
          response.data.data.item
            .filter(item => item.rank === '상품')
            .forEach(item => {
              const itemName = item.item_name;
              const hasDpr1 = item.dpr1 !== '-';
              const hasDpr2 = item.dpr2 !== '-';
              
              if (hasDpr1) hasValidDpr1Data = true;
              
              console.log('Processing item:', itemName, { 
                dpr1: item.dpr1, 
                dpr2: item.dpr2, 
                day1: item.day1, 
                day2: item.day2,
                category_code: item.category_code 
              });

              // 현재 아이템의 데이터가 유효한지 확인
              if (!hasDpr1 && !hasDpr2) return;

              // 이미 저장된 데이터가 없거나, 현재 데이터가 더 최신인 경우
              if (!latestValidData[itemName] || 
                  (hasDpr1 && new Date(item.day1.replace(/[()]/g, '')) > new Date(latestValidData[itemName].date))) {
                
                const price = hasDpr1 ? item.dpr1 : item.dpr2;
                const date = hasDpr1 ? item.day1 : item.day2;
                const previousPrice = hasDpr2 ? item.dpr2 : price;
                const previousDate = hasDpr2 ? item.day2 : date;
                
                const currentPrice = Number(price.replace(/,/g, ''));
                const lastPrice = Number(previousPrice.replace(/,/g, ''));
                
                latestValidData[itemName] = {
                  price: price,
                  unit: item.unit,
                  date: date.replace(/[()]/g, ''),
                  previousDate: previousDate.replace(/[()]/g, ''),
                  priceChange: currentPrice - lastPrice,
                  yesterdayPrice: lastPrice,
                  category_code: item.category_code,
                  category_name: item.category_name,
                  hasDpr1: hasDpr1
                };
              }
            });
          
          console.log('Processed Data:', latestValidData);

          // 데이터 업데이트 및 프리징 로직
          if (now >= updateTime) {
            // 오후 3시 이후
            if (!hasValidDpr1Data && frozenData) {
              // dpr1 데이터가 없고 프리징된 데이터가 있으면 프리징된 데이터 사용
              console.log('Using frozen data due to missing dpr1 data');
              setPriceData(frozenData);
            } else {
              // 새로운 데이터가 있으면 업데이트 및 프리징
              setPriceData(latestValidData);
              setFrozenData(latestValidData);
              setIsFrozen(true);
            }
          } else {
            // 오후 3시 이전
            if (frozenData) {
              console.log('Using frozen data before 3 PM');
              setPriceData(frozenData);
            } else {
              setPriceData(latestValidData);
              setFrozenData(latestValidData);
              setIsFrozen(true);
            }
          }
        } else {
          console.error('Invalid API response structure:', response.data);
          setError('데이터 형식이 올바르지 않습니다.');
        }
      } catch (err) {
        setError('가격 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching price data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();

    // 매일 오후 3시에 데이터 업데이트
    const now = new Date();
    const updateTime = new Date(now);
    updateTime.setHours(15, 0, 0, 0);

    let timeUntilUpdate;
    if (now > updateTime) {
      updateTime.setDate(updateTime.getDate() + 1);
    }
    timeUntilUpdate = updateTime.getTime() - now.getTime();

    const updateTimer = setTimeout(() => {
      fetchPriceData();
    }, timeUntilUpdate);

    return () => clearTimeout(updateTimer);
  }, [frozenData, isFrozen]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!priceData || typeof priceData !== 'object') {
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          데이터 형식이 올바르지 않습니다.
        </Typography>
      </Container>
    );
  }

  // 현재 선택된 카테고리의 데이터만 필터링
  const filteredData = Object.entries(priceData).filter(([_, item]) => item.category_code === selectedCategory);

  // 필터링된 데이터가 없는 경우 처리
  if (filteredData.length === 0) {
    return (
      <Container>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 4
          }}>
            <span role="img" aria-label="money bag">💰</span>
            오늘의 농산물 소비자 가격은?
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={selectedCategory} 
            onChange={handleCategoryChange} 
            aria-label="category tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.2rem',
                fontWeight: 'bold',
                minWidth: '120px',
                padding: '12px 24px'
              }
            }}
          >
            <Tab 
              label="채소류" 
              value="200" 
              sx={{ 
                '&.Mui-selected': {
                  color: '#2e7d32'
                }
              }}
            />
            <Tab 
              label="곡물류" 
              value="100"
              sx={{ 
                '&.Mui-selected': {
                  color: '#ed6c02'
                }
              }}
            />
          </Tabs>
        </Box>
        <Typography variant="h6" align="center" sx={{ mt: 4, color: '#666' }}>
          선택한 카테고리의 데이터가 없습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 4
          }}>
            <span role="img" aria-label="money bag">💰</span>
            오늘의 농산물 소비자 가격은?
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={selectedCategory} 
            onChange={handleCategoryChange} 
            aria-label="category tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.2rem',
                fontWeight: 'bold',
                minWidth: '120px',
                padding: '12px 24px'
              }
            }}
          >
            <Tab 
              label="채소류" 
              value="200" 
              sx={{ 
                '&.Mui-selected': {
                  color: '#2e7d32'
                }
              }}
            />
            <Tab 
              label="곡물류" 
              value="100"
              sx={{ 
                '&.Mui-selected': {
                  color: '#ed6c02'
                }
              }}
            />
          </Tabs>
        </Box>
        <Typography variant="body2" align="right" sx={{ color: '#666' }}>
          가격단위: 원    기준일 {filteredData[0]?.[1]?.date || ''}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {filteredData.map(([key, item]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {key}
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    textAlign: 'right',
                    mb: 1
                  }}
                >
                  {item.unit}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mr: 2,
                    flex: 1
                  }}>
                    {item.priceChange > 0 ? (
                      <>
                        <BsArrowUpCircleFill style={{ color: '#ff4d4d', marginRight: '4px', flexShrink: 0, marginTop: '4px' }} />
                        <Typography sx={{ 
                          color: '#ff4d4d', 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          wordBreak: 'break-word'
                        }}>
                          +{item.priceChange.toLocaleString()} ({((item.priceChange / item.yesterdayPrice) * 100).toFixed(1)}%)
                        </Typography>
                      </>
                    ) : item.priceChange < 0 ? (
                      <>
                        <BsArrowDownCircleFill style={{ color: '#4d79ff', marginRight: '4px', flexShrink: 0, marginTop: '4px' }} />
                        <Typography sx={{ 
                          color: '#4d79ff', 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          wordBreak: 'break-word'
                        }}>
                          {item.priceChange.toLocaleString()} ({((item.priceChange / item.yesterdayPrice) * 100).toFixed(1)}%)
                        </Typography>
                      </>
                    ) : (
                      <>
                        <BsDashCircleFill style={{ color: '#666666', marginRight: '4px', flexShrink: 0, marginTop: '4px' }} />
                        <Typography sx={{ 
                          color: '#666666', 
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          wordBreak: 'break-word'
                        }}>
                          0 (0.0%)
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      textAlign: 'right',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                      flexShrink: 0
                    }}
                  >
                    {parseInt(item.price.replace(/,/g, '')).toLocaleString()}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '1rem' },
                        ml: 0.5,
                        color: '#666'
                      }}
                    >
                      원
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Today;
