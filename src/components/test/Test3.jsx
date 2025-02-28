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

const Test3 = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/price');
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        if (response.data.success) {
          const processedData = response.data.data.data.item
            .filter(item => item.rank === '상품')
            .reduce((acc, item) => {
              // 가격이 '-'인 경우 제외
              if (item.dpr1 === '-') return acc;
              
              // 이미 해당 품목이 있고 현재 처리중인 품목의 가격이 더 낮은 경우 건너뛰기
              if (acc[item.item_name] && Number(acc[item.item_name].price.replace(/,/g, '')) <= Number(item.dpr1.replace(/,/g, ''))) {
                return acc;
              }
              
              // 가격 변동 계산 수정 (당일 가격과 전일 가격 비교)
              const todayPrice = Number(item.dpr1.replace(/,/g, '')); // 당일 가격
              const yesterdayPrice = Number(item.dpr2.replace(/,/g, '')); // 1일전 가격
              const priceChange = todayPrice - yesterdayPrice;
              
              acc[item.item_name] = {
                price: item.dpr1, // 당일 가격 사용
                unit: item.unit,
                date: item.day1.replace(/[()]/g, ''), // 당일 날짜 사용
                priceChange: priceChange
              };
              return acc;
            }, {});
          setPriceData(processedData);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('가격 데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching price data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
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
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {item.priceChange > 0 ? (
                      <>
                        <BsArrowUpCircleFill style={{ color: '#ff4d4d', marginRight: '4px' }} />
                        <Typography sx={{ color: '#ff4d4d', fontSize: '0.9rem' }}>
                          +{item.priceChange.toLocaleString()}
                        </Typography>
                      </>
                    ) : item.priceChange < 0 ? (
                      <>
                        <BsArrowDownCircleFill style={{ color: '#4d79ff', marginRight: '4px' }} />
                        <Typography sx={{ color: '#4d79ff', fontSize: '0.9rem' }}>
                          {item.priceChange.toLocaleString()}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <BsDashCircleFill style={{ color: '#666666', marginRight: '4px' }} />
                        <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
                          0
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
                      justifyContent: 'flex-end'
                    }}
                  >
                    {parseInt(item.price.replace(/,/g, '')).toLocaleString()}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: '1rem',
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

export default Test3;
