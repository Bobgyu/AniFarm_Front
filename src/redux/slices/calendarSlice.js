import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8000'  // 기본 URL 설정
});

// 캘린더 데이터 저장 액션
export const saveCalendarData = createAsyncThunk(
  'calendar/saveCalendarData',
  async (calendarData) => {
    try {
      const response = await api.post('/api/growth_calendar/save', calendarData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // console.error('API 에러:', error);
      throw error;
    }
  }
);

// 사용자의 캘린더 데이터 조회 액션
export const fetchUserCalendar = createAsyncThunk(
  'calendar/fetchUserCalendar',
  async () => {
    try {
      const response = await api.get('/api/growth_calendar/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      // console.error('API 에러:', error);
      throw error;
    }
  }
);

// 캘린더 데이터 삭제 액션 추가
export const deleteCalendarData = createAsyncThunk(
  'calendar/deleteCalendarData',
  async (calendarId) => {
    const response = await api.delete(`/api/growth_calendar/${calendarId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return { ...response.data, calendarId };
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    calendarData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 저장 상태 처리
      .addCase(saveCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarData.push(action.payload.data);
      })
      .addCase(saveCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 조회 상태 처리
      .addCase(fetchUserCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarData = action.payload.data;
      })
      .addCase(fetchUserCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // 삭제 상태 처리
      .addCase(deleteCalendarData.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        state.calendarData = state.calendarData.filter(
          item => item.id !== action.payload.data.id
        );
      })
      .addCase(deleteCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default calendarSlice.reducer; 