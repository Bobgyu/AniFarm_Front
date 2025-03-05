import axios from "axios";

// 기본 URL 설정
const AUTH_BASE_URL = "http://localhost:8000";  // 인증 관련 요청용
const API_BASE_URL = "http://localhost:8000/api";  // 일반 API 요청용

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증용 axios 인스턴스 생성
const authAxiosInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 인증용 요청 인터셉터 추가
authAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRequest = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postRequest = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putRequest = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRequest = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// myMedi 요청 함수
export async function postMyMediRequest(url, options) {
  const defaultOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        JSON.stringify({
          status: response.status,
          msg: data.msg || "Request failed",
        })
      );
    }
    return { status: response.status, data }; // 성공 시 상태 코드와 데이터를 반환
  } catch (error) {
    // 네트워크 오류나 다른 오류를 처리
    throw error instanceof Error
      ? error
      : new Error(
          JSON.stringify({
            status: 500,
            msg: error.message || "Unknown error occurred",
          })
        );
  }
}

// useDispatch-업데이트 useSelector-가져오는거

export async function postFormRequest(url, options) {
  const response = await fetch(url, {
    ...options,
    headers:
      options.body instanceof FormData
        ? undefined
        : {
            "Content-Type": "application/json",
          },
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  // return await response.json(); // { status, data } 형태로 반환
  return { status: response.status, data: responseData }; // 상태 코드와 데이터를 함께 반환
}

/* ====== Common Patch Request Function ====== */
export async function patchRequest(url, options) {
  const token = getTokenWithExpiry();
  return await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// 토큰 관리 함수 추가
const getTokenWithExpiry = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const tokenData = localStorage.getItem("tokenExpiry");
  if (!tokenData) {
    // 토큰은 있지만 만료시간이 없는 경우, 현재 시간 기준으로 만료시간 설정
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("tokenExpiry", expiry.toString());
    return token;
  }

  const expiry = parseInt(tokenData);
  const now = new Date().getTime();

  if (now > expiry) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    return null;
  }
  return token;
};

// 로그인 요청 함수 수정
export const loginRequest = async (data) => {
  try {
    console.log("로그인 요청 데이터:", data);
    const response = await authAxiosInstance.post("/auth/login", data);
    console.log("로그인 응답 데이터:", response);
    return response.data;
  } catch (error) {
    console.error("로그인 요청 에러:", error.response?.data || error);
    throw error;
  }
};
