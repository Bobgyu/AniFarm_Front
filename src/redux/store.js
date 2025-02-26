import { combineReducers, configureStore } from "@reduxjs/toolkit";
// combineReducers: 여러 리듀서를 하나로 합쳐주는 함수
// configureStore: 스토어를 생성하는 함수
import authReducer from "./slices/authslice";
import loginReducer from "./slices/loginslice";
import apiReducer from "./slices/apiSlice";
import writeReducer from "./slices/writeSlice";
import commentReducer from "./slices/commentSlice";
import imageModelReducer from "./slices/imageModelSlice";

const store = configureStore({
  reducer: combineReducers({
    auth: authReducer, // 값은 만드는 이름
    login: loginReducer,
    apis: apiReducer,
    write: writeReducer,
    comments: commentReducer,
    imageModel: imageModelReducer,
  }),
});

export default store;
