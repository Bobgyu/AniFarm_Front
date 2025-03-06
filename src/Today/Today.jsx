import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  BsArrowUpCircleFill,
  BsArrowDownCircleFill,
  BsDashCircleFill,
} from "react-icons/bs";

const Today = () => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/price");

        if (response.data && response.data.data && response.data.data.item) {
          const processedData = response.data.data.item
            .filter((item) => item.rank === "상품")
            .reduce((acc, item) => {
              // 현재 시간 기준으로 사용할 가격 결정
              const now = new Date();
              const updateTime = new Date(now);
              updateTime.setHours(14, 0, 0, 0);
              const isBeforeUpdate = now < updateTime;

              // 당일 데이터가 없거나 오후 2시 이전이면 전날 데이터 사용
              const currentPrice =
                item.dpr1 === "-" || isBeforeUpdate ? item.dpr2 : item.dpr1;
              const comparisonPrice =
                item.dpr1 === "-" || isBeforeUpdate ? item.dpr3 : item.dpr2;

              // 가격이 없는 경우 제외
              if (currentPrice === "-" || comparisonPrice === "-") return acc;

              // 가격을 숫자로 변환
              const todayPrice = Number(currentPrice.replace(/,/g, ""));
              const yesterdayPrice = Number(comparisonPrice.replace(/,/g, ""));

              // 유효하지 않은 숫자인 경우 제외
              if (isNaN(todayPrice) || isNaN(yesterdayPrice)) return acc;

              // 이미 해당 품목이 있고 현재 처리중인 품목의 가격이 더 낮은 경우 건너뛰기
              if (
                acc[item.item_name] &&
                Number(acc[item.item_name].price.replace(/,/g, "")) <=
                  todayPrice
              ) {
                return acc;
              }

              // 가격 변동 계산 (전일 대비)
              const priceChange = todayPrice - yesterdayPrice;

              // 날짜 결정
              const displayDate =
                item.dpr1 === "-" || isBeforeUpdate
                  ? item.day2.replace(/[()]/g, "")
                  : item.day1.replace(/[()]/g, "");

              acc[item.item_name] = {
                price: currentPrice,
                unit: item.unit,
                date: displayDate,
                priceChange: priceChange,
                yesterdayPrice: yesterdayPrice,
              };
              return acc;
            }, {});

          // 빈 객체인 경우 처리
          if (Object.keys(processedData).length === 0) {
            setError("데이터가 없습니다.");
            return;
          }

          setPriceData(processedData);
        } else {
          setError("데이터 형식이 올바르지 않습니다.");
        }
      } catch (err) {
        setError("가격 데이터를 불러오는데 실패했습니다.");
        console.error("Error fetching price data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();

    // 오후 2시가 되면 자동으로 데이터 갱신
    const now = new Date();
    const updateTime = new Date(now);
    updateTime.setHours(14, 0, 0, 0);

    let timeUntilUpdate;
    if (now > updateTime) {
      updateTime.setDate(updateTime.getDate() + 1);
    }
    timeUntilUpdate = updateTime.getTime() - now.getTime();

    const updateTimer = setTimeout(fetchPriceData, timeUntilUpdate);

    return () => clearTimeout(updateTimer);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
  if (!priceData || typeof priceData !== "object") {
    console.log("Invalid data format:", priceData);
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span role="img" aria-label="money bag">
              💰
            </span>
            오늘의 채소 소비자 가격은?
          </Typography>
        </Box>
        <Typography variant="body2" align="right" sx={{ color: "#666" }}>
          가격단위: 원 기준일{" "}
          {Object.values(priceData || {})[0]?.date || "데이터 없음"}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {Object.entries(priceData || {}).map(([key, item]) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {key}
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    textAlign: "right",
                    mb: 1,
                  }}
                >
                  {item.unit}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                    {item.priceChange > 0 ? (
                      <>
                        <BsArrowUpCircleFill
                          style={{ color: "#ff4d4d", marginRight: "4px" }}
                        />
                        <Typography
                          sx={{ color: "#ff4d4d", fontSize: "0.9rem" }}
                        >
                          +{item.priceChange.toLocaleString()} (
                          {item.yesterdayPrice > 0
                            ? (
                                (item.priceChange / item.yesterdayPrice) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          %)
                        </Typography>
                      </>
                    ) : item.priceChange < 0 ? (
                      <>
                        <BsArrowDownCircleFill
                          style={{ color: "#4d79ff", marginRight: "4px" }}
                        />
                        <Typography
                          sx={{ color: "#4d79ff", fontSize: "0.9rem" }}
                        >
                          {item.priceChange.toLocaleString()} (
                          {item.yesterdayPrice > 0
                            ? (
                                (item.priceChange / item.yesterdayPrice) *
                                100
                              ).toFixed(1)
                            : "0.0"}
                          %)
                        </Typography>
                      </>
                    ) : (
                      <>
                        <BsDashCircleFill
                          style={{ color: "#666666", marginRight: "4px" }}
                        />
                        <Typography
                          sx={{ color: "#666666", fontSize: "0.9rem" }}
                        >
                          0 (0.0%)
                        </Typography>
                      </>
                    )}
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "right",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {parseInt(item.price.replace(/,/g, "")).toLocaleString()}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1rem",
                        ml: 0.5,
                        color: "#666",
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
