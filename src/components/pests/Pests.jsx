import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Pests = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const crops = [
    { value: "chamoe", label: "🍋참외" },
    { value: "strawberry", label: "🍓딸기" },
    { value: "tomato", label: "🥝키위" },
  ];

  const resetState = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    resetState();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDiagnosis = async () => {
    if (!selectedImage) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileInput = document.getElementById("image-upload");
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();

      if (data.success) {
        const confidence =
          data.result === "유효하지 않은 이미지"
            ? data.plant_probability * 100
            : Object.values(data.probabilities)[
                Object.values(data.probabilities).length - 1
              ] * 100;

        setResult({
          status: data.result === "정상" ? "healthy" : "diseased",
          disease: data.result,
          confidence: confidence.toFixed(1),
          details: data.details,
          recommendation: getRecommendation(data.result),
        });
      } else {
        setError(data.error || "이미지 분석 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("서버 연결에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendation = (disease) => {
    switch (disease) {
      case "노균병":
        return "1. 식물 주변의 통풍을 원활하게 하고 습도가 높아지지 않도록 관리하세요.\n2. 병의 예방과 확산 방지를 위해 적절한 살균제를 주기적으로 사용하세요.\n3. 감염된 잎은 즉시 제거하고, 주변 식물로 전염되지 않도록 주의하세요.";
      case "흰가루병":
        return "1. 습도가 너무 높아지지 않도록 관리하고, 식물 주변의 공기 흐름을 원활하게 하여 통풍을 개선하세요.\n2. 식물의 세포벽을 강화하고 저항력을 높이기 위해 규산질 비료나 유기농 자재를 적절히 사용하세요.\n3. 흰가루병에 강한 저항성을 가진 품종을 선택하여 재배하면 발생 위험을 줄일 수 있습니다.";
      case "유효하지 않은 이미지":
        return "참외 식물이 아닙니다. 참외 식물 이미지를 업로드해주세요.";
      default:
        return "작물이 건강한 상태입니다. 현재 관리 방법을 유지하세요.";
    }
  };

  return (
    <Container maxWidth="md">
      <Box className="py-8">
        <Typography variant="h4" className="text-center mb-4">
          병충해 진단
        </Typography>

        <Paper className="p-6 mt-6 flex flex-col items-center">
          <Box className="w-full border-b border-gray-200">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              className="min-h-[48px]"
            >
              {crops.map((crop, index) => (
                <Tab
                  key={crop.value}
                  label={crop.label}
                  className="min-h-[48px]"
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "normal",
                    "&.Mui-selected": {
                      fontWeight: "bold",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box className="flex gap-4 h-56 mt-6">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                이미지 업로드
              </Button>
            </label>
            {selectedImage && (
              <Button
                variant="outlined"
                color="primary"
                onClick={resetState}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                다시 시도
              </Button>
            )}
          </Box>

          {error && (
            <Typography color="error" className="mt-4">
              {error}
            </Typography>
          )}

          {selectedImage && (
            <>
              <Box className="mt-2 w-full max-w-[500px]">
                <Typography variant="h6" className="mb-4">
                  업로드된 이미지
                </Typography>
                <img
                  src={selectedImage}
                  alt="선택된 이미지"
                  className="w-full rounded-lg"
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleDiagnosis}
                disabled={isLoading}
                className="mt-12 mb-6 min-w-[200px] h-12"
              >
                {isLoading ? "분석 중..." : "진단하기"}
              </Button>
            </>
          )}

          {isLoading && (
            <Box className="mt-4 text-center">
              <Typography>이미지 분석 중...</Typography>
            </Box>
          )}

          {result && (
            <Box className="mt-6 w-full">
              <Typography variant="h6" className="mb-4">
                진단 결과
              </Typography>
              <Paper
                className={`p-4 ${
                  result.status === "healthy" ? "bg-green-50" : "bg-red-50"
                } transition-colors duration-300`}
              >
                <Typography className="mb-2">
                  상태:{" "}
                  {result.disease === "유효하지 않은 이미지"
                    ? "유효하지 않은 이미지"
                    : result.status === "healthy"
                    ? "정상"
                    : "병충해 감지"}
                </Typography>
                <Typography className="mb-2">
                  {result.disease === "유효하지 않은 이미지"
                    ? "참외 식물 인식 확률"
                    : "진단 결과"}
                  : {result.disease}
                </Typography>
                <Typography className="mb-2">
                  신뢰도: {result.confidence}%
                </Typography>
                <Typography className="whitespace-pre-line">
                  상세 정보: {result.details}
                </Typography>
                <Typography className="whitespace-pre-line mt-4">
                  권장 조치: {result.recommendation}
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Pests;
