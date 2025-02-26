import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

// 이미지 분석 요청 Thunk
export const analyzeImage = createAsyncThunk(
  "imageModel/analyzeImage",
  async (formData, { rejectWithValue }) => {
    try {
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

        return {
          status: data.result === "정상" ? "healthy" : "diseased",
          disease: data.result,
          confidence: confidence.toFixed(1),
          details: data.details,
          recommendation: getRecommendation(data.result),
          probabilities: data.probabilities,
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

const initialState = {
  selectedImage: null,
  result: null,
  isLoading: false,
  error: null,
};

const imageModelSlice = createSlice({
  name: "imageModel",
  initialState,
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
      state.result = null;
      state.error = null;
    },
    resetState: (state) => {
      state.selectedImage = null;
      state.result = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedImage, resetState } = imageModelSlice.actions;
export default imageModelSlice.reducer;
