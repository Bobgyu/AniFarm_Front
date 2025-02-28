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
          // 데이터를 가공하여 상품 등급만 필터링하고 1일전 가격(dpr2) 사용
          const processedData = response.data.data.data.item
            .filter(item => item.rank === '상품')
            .reduce((acc, item) => {
              // 가격이 '-'인 경우 제외
              if (item.dpr2 === '-') return acc;
              
              // 이미 해당 품목이 있고 현재 처리중인 품목의 가격이 더 낮은 경우 건너뛰기
              if (acc[item.item_name] && Number(acc[item.item_name].price.replace(/,/g, '')) <= Number(item.dpr2.replace(/,/g, ''))) {
                return acc;
              }
              
              acc[item.item_name] = {
                price: item.dpr2,
                unit: item.unit,
                date: item.day2.replace(/[()]/g, '')
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
          <Typography
            variant="h5"
            component="span"
            sx={{
              color: '#4B4BF7',
              mr: 2,
              borderBottom: '2px solid #4B4BF7',
              pb: 0.5
            }}
          >
            오늘
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            관심있는 품목 소비자 가격은?
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
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Test3;
