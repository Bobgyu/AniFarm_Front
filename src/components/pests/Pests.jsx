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
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedImage,
  resetState,
  analyzeImage,
} from "../../redux/slices/imageModelSlice";

const Pests = () => {
  const dispatch = useDispatch();
  const { selectedImage, result, isLoading, error } = useSelector(
    (state) => state.imageModel
  );
  const [selectedTab, setSelectedTab] = useState(0);

  const crops = [
    { value: "chamoe", label: "🍋참외" },
    { value: "strawberry", label: "🍓딸기" },
    { value: "kiwi", label: "🥝키위" },
  ];

  const resetStateHandler = () => {
    dispatch(resetState());
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    resetStateHandler();
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

      dispatch(setSelectedImage(URL.createObjectURL(file)));
    }
  };

  const handleDiagnosis = async () => {
    if (!selectedImage) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    const fileInput = document.getElementById("image-upload");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    dispatch(analyzeImage(formData));
  };

  return (
    <Container maxWidth="md">
      <Box className="py-8">
        <Typography variant="h4" className="text-center mb-4">
          병충해 진단
        </Typography>

        <Paper className="p-6 mt-6 flex flex-col items-center border-2 border-gray-200">
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

          <Box className="flex gap-4 h-24 mt-6">
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
                onClick={resetStateHandler}
                disabled={isLoading}
                className="min-w-[120px] h-[2.4rem]"
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
              <Box className="mt-2 w-full max-w-[500px] pb-4">
                <Typography variant="h6" className="mb-4 pb-2">
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
