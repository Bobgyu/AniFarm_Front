import React, { useState, useEffect } from "react";
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
  
  // useSelector를 분리해서 각각의 상태를 가져옴
  const selectedImage = useSelector((state) => state.imageModel.selectedImage);
  const result = useSelector((state) => state.imageModel.result);
  const isLoading = useSelector((state) => state.imageModel.isLoading);
  const error = useSelector((state) => state.imageModel.error);

  // 상태 변화 추적을 위한 useEffect들
  useEffect(() => {
    console.log("이미지 상태:", selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    console.log("로딩 상태:", isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log("결과 상태:", result);
  }, [result]);

  useEffect(() => {
    console.log("에러 상태:", error);
  }, [error]);

  const [selectedTab, setSelectedTab] = useState(0);

  const crops = [
    { value: "chamoe", label: "🍋참외" },
    { value: "strawberry", label: "🍓딸기" },
    { value: "kiwi", label: "🥝 키위" },
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

      // Canvas를 사용하여 이미지 다시 그리기
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // 새로 그린 이미지로 설정
        dispatch(setSelectedImage(canvas.toDataURL()));
      };
      img.src = URL.createObjectURL(file);
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

    try {
      let response;
      // 작물 타입에 따른 분석 요청
      switch (crops[selectedTab].value) {
        case "kiwi":
          response = await dispatch(analyzeImage({ formData, type: 'kiwi' })).unwrap();
          console.log("키위 분석 결과:", response);
          break;
        case "chamoe":
          response = await dispatch(analyzeImage({ formData, type: 'chamoe' })).unwrap();
          console.log("참외 분석 결과:", response);
          break;
        case "strawberry":
          response = await dispatch(analyzeImage({ formData, type: 'plant' })).unwrap();
          console.log("딸기 분석 결과:", response);
          break;
        default:
          break;
      }

      // 응답이 없는 경우 에러 처리
      if (!response) {
        throw new Error("분석 결과를 받지 못했습니다.");
      }

    } catch (err) {
      console.error("진단 중 오류 발생:", err);
      alert("진단 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box className="py-8">
        <Typography variant="h5" className="text-center mb-4">
          병충해 진단
        </Typography>

        <Paper className="p-6 mt-6 flex flex-col items-center border-2 border-gray-200 min-h-[600px]">
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

          <Box className="w-full mt-8 flex flex-col md:flex-row gap-2">
            <Box className="md:w-1/2 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              {!selectedImage ? (
                <Box className="w-full">
                  <Box className="flex justify-center flex-col items-center">
                    <label htmlFor="image-upload">
                      <Box className="w-[400px] h-[330px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                        <Box className="text-center">
                          <CloudUploadIcon sx={{ fontSize: 60 }} className="text-gray-400 mb-2" />
                          <Typography variant="body1" className="text-gray-500">
                            이미지를 업로드해주세요
                          </Typography>
                          <Typography variant="body2" className="text-gray-400 mt-1">
                            (최대 5MB)
                          </Typography>
                          <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            className="mt-4 min-w-[120px] h-[2.4rem]"
                          >
                            이미지 업로드
                          </Button>
                        </Box>
                      </Box>
                    </label>
                    
                    <Box className="mt-4 p-4 w-[400px] border-2 border-gray-300 rounded-lg">
                      <Typography variant="subtitle1" className="font-semibold mb-2 text-center">
                        진단 가능한 병해충
                      </Typography>
                      {selectedTab === 0 && (
                        <Box className="text-center">
                          <Typography variant="body2" className="text-gray-600">
                            참외 잎사귀의 다음 증상을 진단할 수 있습니다:
                          </Typography>
                          <Box className="mt-2 flex justify-center gap-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">흰가루병</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">노균병</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">정상</span>
                          </Box>
                        </Box>
                      )}
                      {selectedTab === 2 && (
                        <Box className="text-center">
                          <Typography variant="body2" className="text-gray-600">
                            키위 잎사귀의 다음 증상을 진단할 수 있습니다:
                          </Typography>
                          <Box className="mt-2 flex justify-center gap-4">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">점무늬병</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">총채벌레</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">정상</span>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <>
                <Box className="flex gap-4 mb-4 justify-center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDiagnosis}
                        disabled={isLoading}
                        className="min-w-[120px] h-[2.4rem]"
                      >
                        {isLoading ? "분석 중..." : "진단하기"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={resetStateHandler}
                        disabled={isLoading}
                        className="min-w-[120px] h-[2.4rem]"
                      >
                        다시 시도
                      </Button>
                    </Box>
                  <Box className="w-full">
                    <Typography variant="h6" className="mb-4 pb-2">
                    </Typography>
                    <Box className="flex justify-center">
                      <Box className="w-[400px] h-[330px] bg-white">
                        <img
                          src={selectedImage}
                          alt="선택된 이미지"
                          className="w-full h-full object-contain"
                        />
                      </Box>
                    </Box>
                    {!selectedImage && (
                      <Box className="mt-4 p-4 border-2 border-gray-300 rounded-lg">
                        <Typography variant="subtitle1" className="font-semibold mb-2">
                          진단 가능한 병해충
                        </Typography>
                        {selectedTab === 0 && (
                          <Typography variant="body2" className="flex gap-2">
                            참외: 
                            <span className="text-gray-600">흰가루병, 노균병, 정상</span>
                          </Typography>
                        )}
                        {selectedTab === 2 && (
                          <Typography variant="body2" className="flex gap-2">
                            키위: 
                            <span className="text-gray-600">점무늬병, 총채벌레, 정상</span>
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Box>

            <Box className="md:w-1/2 flex items-center justify-start mt-14">
              <Box className="w-[400px]">
                {result && (
                  <Box className="w-[400px] h-[340px] border-2 border-gray-300 rounded-lg p-4">
                    <Typography variant="h6" className="mb-3 border-b border-gray-200 pb-2">
                      진단 결과
                    </Typography>
                    <Paper
                      className={`p-3 ${
                        result.status === "healthy" 
                          ? "bg-green-50" 
                          : result.status === "invalid"
                            ? "bg-gray-50"  // 비식물일 경우 회색 배경
                            : "bg-red-50"   // 병충해일 경우 빨간색 배경
                      } transition-colors duration-300`}
                      sx={{ boxShadow: 'none' }}
                    >
                      <Box className="space-y-2 text-sm">
                        <Typography variant="body2">
                          <span className="font-semibold">상태: </span>
                          {result.status === "invalid"
                            ? "유효하지 않은 이미지"
                            : result.status === "healthy"
                              ? "정상"
                              : "병충해 감지"}
                        </Typography>
                        <Typography variant="body2">
                          <span className="font-semibold">진단 결과: </span>
                          {result.disease}
                        </Typography>
                        <Typography variant="body2" className="whitespace-pre-wrap">
                          <span className="font-semibold">상세 정보: </span>
                          {result.details}
                        </Typography>
                        <Typography variant="body2" className="whitespace-pre-wrap border-b border-gray-200 pb-2">
                          <span className="font-semibold">권장 조치: </span>
                          {result.recommendation}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {error && (
            <Typography color="error" className="mt-4">
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Pests;
