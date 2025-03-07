import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { BsArrowUpCircleFill, BsArrowDownCircleFill, BsDashCircleFill } from 'react-icons/bs';

const Today = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/price');
       
        if (response.data && response.data.data && response.data.data.item) {
          const processedData = response.data.data.item
            .filter(item => item.rank === '상품')
            .reduce((acc, item) => {
              const now = new Date();
              const updateTime = new Date(now);
              updateTime.setHours(15, 0, 0, 0);
              const isBeforeUpdate = now < updateTime;

              // 오후 3시 이전: 하루 전 데이터(dpr2) 표시
              // 오후 3시 이후: 당일 데이터(dpr1) 표시
              // 항상 전날 데이터(dpr2)와 비교
              const currentPrice = isBeforeUpdate ? item.dpr2 : (item.dpr1 === '-' ? item.dpr2 : item.dpr1);
              const previousPrice = item.dpr2;
              
              // 가격이 없거나 '-' 인 경우 제외
              if (currentPrice === '-' || previousPrice === '-') return acc;
              
              // 이미 해당 품목이 있고 현재 처리중인 품목의 가격이 더 낮은 경우 건너뛰기
              if (acc[item.item_name] && Number(acc[item.item_name].price.replace(/,/g, '')) <= Number(currentPrice.replace(/,/g, ''))) {
                return acc;
              }
              
              // 가격 변동 계산 (전일 대비)
              const todayPrice = Number(currentPrice.replace(/,/g, '')); // 현재 표시할 가격
              const yesterdayPrice = Number(previousPrice.replace(/,/g, '')); // 전일 가격
              const priceChange = todayPrice - yesterdayPrice;
              
              // 날짜 결정
              const displayDate = isBeforeUpdate ? item.day2.replace(/[()]/g, '') : (item.dpr1 === '-' ? item.day2.replace(/[()]/g, '') : item.day1.replace(/[()]/g, ''));
              const previousDate = item.day2.replace(/[()]/g, ''); // 항상 전날 날짜 사용
              
              acc[item.item_name] = {
                price: currentPrice,
                unit: item.unit,
                date: displayDate,
                previousDate: previousDate,
                priceChange: priceChange,
                yesterdayPrice: yesterdayPrice
              };
              return acc;
            }, {});
          
          console.log('Processed Data:', processedData); // 디버깅용 로그 추가
          setPriceData(processedData);
        } else {
          console.error('Invalid API response structure:', response.data); // 디버깅용 로그 추가
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

    // 오후 3시가 되면 자동으로 데이터 갱신
    const now = new Date();
    const updateTime = new Date(now);
    updateTime.setHours(15, 0, 0, 0);

    let timeUntilUpdate;
    if (now > updateTime) {
      // 이미 오후 3시가 지났다면 다음날 오후 3시로 설정
      updateTime.setDate(updateTime.getDate() + 1);
    }
    timeUntilUpdate = updateTime.getTime() - now.getTime();

    const updateTimer = setTimeout(() => {
      fetchPriceData();
    }, timeUntilUpdate);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearTimeout(updateTimer);
  }, []);

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

  // 데이터가 없거나 올바르지 않은 형식일 경우 처리
  if (!priceData || typeof priceData !== 'object') {
    console.log('Invalid data format:', priceData);
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          데이터 형식이 올바르지 않습니다.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <span role="img" aria-label="money bag">💰</span>
            오늘의 채소 소비자 가격은?
          </Typography>
        </Box>
        <Typography variant="body2" align="right" sx={{ color: '#666' }}>
          가격단위: 원    기준일 {Object.values(priceData)[0]?.date || ''}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {Object.entries(priceData).map(([key, item]) => (
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
