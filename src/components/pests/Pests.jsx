import React, { useState } from "react";
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Pests = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
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

      setIsLoading(true);
      setError(null);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);

      try {
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
            Math.max(data.downy_probability, data.powdery_probability) * 100;

          setResult({
            status: data.result === "정상" ? "healthy" : "diseased",
            disease: data.result,
            confidence: confidence.toFixed(1),
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
    }
  };

  const getRecommendation = (disease) => {
    switch (disease) {
      case "노균병":
        return "1. 통풍과 환기를 개선하세요.\n2. 적절한 살균제를 사용하세요.\n3. 병든 잎은 즉시 제거하세요.";
      case "흰가루병":
        return "1. 습도를 낮추고 통풍을 개선하세요.\n2. 규산질 비료를 사용하세요.\n3. 저항성 품종을 선택하세요.";
      default:
        return "작물이 건강한 상태입니다. 현재 관리 방법을 유지하세요.";
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          작물 병충해 진단
        </Typography>

        <Paper
          sx={{
            p: 3,
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 3 }}
              disabled={isLoading}
            >
              {isLoading ? "분석 중..." : "이미지 업로드"}
            </Button>
          </label>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {selectedImage && (
            <Box sx={{ mt: 2, width: "100%", maxWidth: 500 }}>
              <img
                src={selectedImage}
                alt="선택된 이미지"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Box>
          )}

          {isLoading && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography>이미지 분석 중...</Typography>
            </Box>
          )}

          {result && (
            <Box sx={{ mt: 3, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                진단 결과
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: result.status === "healthy" ? "#e8f5e9" : "#ffebee",
                  transition: "background-color 0.3s",
                }}
              >
                <Typography variant="body1" gutterBottom>
                  상태: {result.status === "healthy" ? "정상" : "병충해 감지"}
                </Typography>
                {result.status === "diseased" && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      진단된 병명: {result.disease}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      신뢰도: {result.confidence}%
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      권장 조치: {result.recommendation}
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Pests;
