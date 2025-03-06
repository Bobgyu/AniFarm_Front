import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getRecommendation = (disease) => {
  switch (disease) {
    case "노균병":
      return "1. 식물 주변 공기가 잘 통하도록 해주고, 습기가 너무 많아지지 않게 조심해 주세요~ 🌬️🌿\n2. 병이 퍼지지 않게 주기적으로 살균제를 써주세요! 🧴✨\n3. 감염된 잎은 빨리 떼어내고, 다른 식물한테 옮지 않게 조심해야 해요! 🍃🚫";
    case "흰가루병":
      return "1.습도가 너무 높지 않도록 조절해주고, 식물 주변 공기를 시원하게 만들어주세요! 🌬️😌\n2. 식물 세포벽을 강하게 해주기 위해 규산질 비료나 유기농 자재를 사용하면 좋대요! 🌱💪\n3.  흰가루병에 강한 품종을 키우면 병에 걸릴 확률이 줄어들어요! 🌸👩‍🌾";
    case "유효하지 않은 이미지":
      return "이건 참외 식물이 아니에요! 참외 식물 이미지를 다시 올려주세요~ 🍈📸";
    default:
      return "작물이 건강하게 자라고 있어요! 지금처럼 잘 관리해주세요! 💚🌱";
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
