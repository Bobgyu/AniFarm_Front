import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getRecommendation = (disease) => {
  switch (disease) {
    case "노균병":
      return "1. 식물 주변 공기가 잘 통하도록 해주고, 습기가 너무 많아지지 않게 조심해 주세요~ 🌬️🌿\n2. 병이 퍼지지 않게 주기적으로 살균제를 써주세요! 🧴✨\n3. 감염된 잎은 빨리 떼어내고, 다른 식물한테 옮지 않게 조심해야 해요! 🍃🚫";
    case "흰가루병":
      return "1.습도가 너무 높지 않도록 조절해주고, 식물 주변 공기를 시원하게 만들어주세요! 🌬️😌\n2. 식물 세포벽을 강하게 해주기 위해 규산질 비료나 유기농 자재를 사용하면 좋대요! 🌱💪\n3.  흰가루병에 강한 품종을 키우면 병에 걸릴 확률이 줄어들어요! 🌸👩‍🌾";
    case "정상":
      return "작물이 건강하게 자라고 있어요! 지금처럼 잘 관리해주세요! 💚🌱";
    case "비식물":
      return "식물의 잎사귀 이미지를 업로드해주세요 🌿";
    default:
      return "전문가와 상담이 필요할 것 같아요. 더 자세한 진단을 받아보세요! 🏥👨‍⚕️";
  }
};

// 식물 분류 Thunk
export const analyzePlantFirst = createAsyncThunk(
  "imageModel/analyzePlantFirst",
  async (formData, { rejectWithValue }) => {
    try {
      // 1단계: 식물 분류
      const response = await fetch("http://localhost:8000/plant_predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      console.log("Plant classification result:", data);

      if (data.data.predicted_class === "비식물") {
        return {
          status: "invalid",
          disease: "잎사귀가 아닙니다",
          confidence: (data.data.confidence * 100).toFixed(1),
          details: "식물이 아닌 이미지가 감지되었습니다.",
          recommendation: "식물의 잎사귀 이미지를 업로드해주세요 🌿"
        };
      }

      return { isPlant: true };
    } catch (error) {
      return rejectWithValue("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  }
);

// 이미지 분석 요청 Thunk
export const analyzeImage = createAsyncThunk(
  "imageModel/analyzeImage",
  async ({ formData, type }, { dispatch, rejectWithValue }) => {
    try {
      // 먼저 식물 분류 수행
      const plantResponse = await fetch("http://localhost:8000/plant_predict", {
        method: "POST",
        body: formData,
      });

      if (!plantResponse.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const plantData = await plantResponse.json();
      console.log("식물 분류 결과:", plantData);

      // 비식물인 경우 바로 결과 반환
      if (plantData.predicted_class === "비식물") {
        return {
          status: "invalid",
          disease: "비식물",
          confidence: (plantData.confidence * 100).toFixed(1),
          details: "식물이 아닌 이미지가 감지되었습니다.",
          recommendation: "식물의 잎사귀 이미지를 업로드해주세요 🌿"
        };
      }

      // 식물인 경우 질병 분석 진행
      const endpoint = `http://localhost:8000/${type}_predict`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      console.log("질병 분석 결과:", data);

      return {
        status: data.predicted_class === "정상" ? "healthy" : "diseased",
        disease: data.predicted_class,
        confidence: (data.confidence * 100).toFixed(1),
        details: `진단 신뢰도: ${(data.confidence * 100).toFixed(1)}%\n${
          Object.entries(data.class_probabilities)
            .map(([key, value]) => `${key}: ${(value * 100).toFixed(1)}%`)
            .join('\n')
        }`,
        recommendation: getRecommendation(data.predicted_class)
      };

    } catch (error) {
      console.error("에러 발생:", error);
      return rejectWithValue("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  }
);

// 키위 이미지 분석을 위한 Thunk
export const analyzeKiwiImage = createAsyncThunk(
  "imageModel/analyzeKiwiImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/kiwi_predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();
      
      // 클래스 한글 매핑
      const koreanClassNames = {
        "잎_점무늬병": "잎 점무늬병",
        "잎_정상": "정상",
        "잎_총채벌레": "총채벌레 피해"
      };

      return {
        status: data.class === "잎_정상" ? "healthy" : "diseased",
        disease: koreanClassNames[data.class] || data.class,
        confidence: (data.confidence * 100).toFixed(1),
        details: `진단 신뢰도: ${(data.confidence * 100).toFixed(1)}%`,
        recommendation: getKiwiRecommendation(data.class),
      };
    } catch (error) {
      return rejectWithValue("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  }
);

// 키위 질병에 대한 추천사항
const getKiwiRecommendation = (disease) => {
  switch (disease) {
    case "잎_점무늬병":
      return "1. 통풍과 햇빛이 잘 들도록 관리해주세요 🌞\n2. 감염된 잎은 즉시 제거하고 소각해주세요 🍂\n3. 적절한 살균제를 정기적으로 살포해주세요 🌱\n4. 과습하지 않도록 물 관리에 주의해주세요 💧";
    case "잎_총채벌레":
      return "1. 정기적으로 잎을 살펴보고 초기 발견이 중요해요 👀\n2. 적절한 살충제를 사용해 방제해주세요 🧪\n3. 황색 점착트랩을 설치하면 예방에 도움이 됩니다 🪤\n4. 주변 잡초를 제거하고 청결한 환경을 유지해주세요 🌿";
    case "잎_정상":
      return "키위가 건강하게 자라고 있어요! 현재의 관리 방법을 유지해주세요 💚\n1. 적절한 물 관리를 계속해주세요 💧\n2. 정기적인 관찰을 유지해주세요 👀\n3. 영양분 공급을 잘 해주세요 🌱";
    default:
      return "정확한 진단이 어렵습니다. 전문가와 상담해보세요 🤔";
  }
};

// 참외 이미지 분석을 위한 새로운 Thunk 추가
export const analyzeChamoeImage = createAsyncThunk(
  "imageModel/analyzeChamoeImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/chamoe_predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 응답에 문제가 있습니다.");
      }

      const data = await response.json();

      if (data.success) {
        const result = data.data;
        return {
          status: result.predicted_class === "정상" ? "healthy" : "diseased",
          disease: result.predicted_class,
          confidence: (result.confidence * 100).toFixed(1),
          details: `진단 결과 상세:\n${Object.entries(result.class_probabilities)
            .map(([key, value]) => `${key}: ${(value * 100).toFixed(1)}%`)
            .join('\n')}`,
          recommendation: getChamoeRecommendation(result.predicted_class),
        };
      } else {
        return rejectWithValue(
          data.error || "이미지 분석 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      return rejectWithValue("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  }
);

// 참외 질병에 대한 추천사항
const getChamoeRecommendation = (disease) => {
  switch (disease) {
    case "노균병":
      return "1. 통풍이 잘 되도록 관리하고 과습을 방지해주세요 🌬️\n2. 병든 잎은 즉시 제거하고 적절한 살균제를 사용하세요 🍃\n3. 야간 온도 관리와 습도 조절에 신경 써주세요 🌙";
    case "흰가루병":
      return "1. 일조량을 충분히 확보하고 통풍을 개선해주세요 ☀️\n2. 질소 비료는 적정량만 사용하세요 🌱\n3. 예방적 살균제 처리가 효과적입니다 💪";
    case "정상":
      return "참외가 건강하게 자라고 있어요! 현재의 관리 방법을 유지해주세요 💚";
    default:
      return "알 수 없는 상태입니다. 전문가와 상담해보세요 🤔";
  }
};

const initialState = {
  selectedImage: null,
  result: null,
  isLoading: false,
  error: null,
  isPlant: null,  // 식물 여부 상태 추가
};

const imageModelSlice = createSlice({
  name: "imageModel",
  initialState,
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
      state.result = null;
      state.error = null;
      state.isPlant = null;  // 이미지가 변경되면 식물 여부도 초기화
    },
    resetState: (state) => {
      state.selectedImage = null;
      state.result = null;
      state.error = null;
      state.isLoading = false;
      state.isPlant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 식물 분류 처리
      .addCase(analyzePlantFirst.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzePlantFirst.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.isPlant) {
          state.isPlant = true;
        } else {
          state.result = action.payload;
        }
      })
      .addCase(analyzePlantFirst.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 기존 리듀서들 유지
      .addCase(analyzeKiwiImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeKiwiImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(analyzeKiwiImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(analyzeChamoeImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeChamoeImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(analyzeChamoeImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(analyzeImage.pending, (state) => {
        console.log("분석 시작");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        console.log("분석 완료:", action.payload);
        state.isLoading = false;
        state.result = action.payload;
        state.error = null;
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        console.log("분석 실패:", action.error);
        state.isLoading = false;
        state.error = action.payload || "알 수 없는 오류가 발생했습니다.";
        state.result = null;
      });
  },
});

export const { setSelectedImage, resetState } = imageModelSlice.actions;
export default imageModelSlice.reducer;
