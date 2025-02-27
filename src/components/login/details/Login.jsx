import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../../redux/slices/authslice";
import { setToken } from "../../../redux/slices/loginslice";
import Swal from "sweetalert2";

const Login = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("로그인 시도:", value);

    if (value.email === "" || value.password === "") {
      await Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "이메일, 비밀번호는 필수 입력값입니다.",
      });
      return;
    }

    try {
      // console.log("loginUser 디스패치 전");
      const response = await dispatch(loginUser(value)).unwrap();
      // console.log("로그인 응답 데이터:", response);

      // response에 token이 있는지 확인
      if (response && response.token) {
        dispatch(setToken(response.token));
        await Swal.fire({
          icon: "success",
          text: "로그인에 성공했습니다.",
          timer: 1500,
          showConfirmButton: false,
        });
        navigator("/");
        return;
      }

      // 토큰이 없는 경우
      await Swal.fire({
        icon: "error",
        title: "로그인에 실패했습니다.",
        text: "이메일 또는 비밀번호를 확인해주세요.",
      });
    } catch (error) {
      console.error("로그인 에러:", error);
      await Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: error || "로그인 처리 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-white">
      <div className="max-w-md w-full m-4 space-y-8 p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold bg-gradient-to-r from-green-900 via-green-600 to-green-400 bg-clip-text text-transparent">
            로그인
          </h2>
          <p className="mt-2 text-center text-base text-gray-900 font-medium">
            계정에 로그인하세요
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                type="email"
                placeholder="Email"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-green-200"
                name="email"
                onChange={handleChange}
                id="emailInput"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-green-200"
                name="password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-900 via-green-600 to-green-400 hover:from-green-800 hover:via-green-500 hover:to-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              로그인 하기
            </button>
            <Link to="/register">
              <button
                className="mt-3 w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ease-in-out"
                to="/register"
              >
                이메일 회원가입
              </button>
            </Link>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <Link
            to="/findpwd"
            className="hover:text-green-500 transition-colors duration-200"
          >
            비밀번호 찾기
          </Link>
          <span className="mx-2">|</span>
          <Link
            to="/register"
            className="hover:text-green-500 transition-colors duration-200"
          >
            회원가입 하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
