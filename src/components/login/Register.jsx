import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
  fetchPostAuthData,
  fetchPostEmailVerificationData,
  resetAuthState,
  verifyEmail,
} from "../../redux/slices/authslice.js";

/* - Redux Hooks: useDispatch로 액션을 디스패치하고, useSelector로 Redux 상태에서 인증 관련 데이터를 가져옵니다. */
const Register = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { verificationCode, isEmailVerified } = useSelector(
    (state) => state.auth
  );
  console.log("verificationCode", verificationCode);
  console.log("isEmailVerified", isEmailVerified);

  /* React Router: useNavigate로 페이지 이동을 처리합니다. */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      Swal.fire({
        icon: "info",
        title: "알림",
        text: "이미 로그인된 상태입니다.",
      }).then(() => {
        navigator("/");
      });
    }
  }, [navigator]);

  /* - 로그인 상태 확인: 컴포넌트가 마운트될 때 로컬 스토리지에서 토큰을 확인하여 이미 로그인된 상태라면 홈으로 리다이렉트합니다. */
  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  /* - 인증 상태 초기화: 컴포넌트가 언마운트될 때 인증 상태를 초기화합니다. */
  const [value, setValue] = useState({
    email: "",
    password: "",
    birth_date: "",
    confirm_password: "",
  });

  const [userInputCode, setUserInputCode] = useState("");

  /* State 관리: 사용자 입력값과 인증 코드를 관리하기 위한 상태를 정의합니다. */
  const handleSendVerification = async () => {
    if (!value.email) {
      await Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "이메일을 입력해주세요.",
      });
      return;
    }
    try {
      const result = await dispatch(
        fetchPostEmailVerificationData(value.email)
      ).unwrap();
      if (result.message) {
        await Swal.fire({
          icon: "success",
          title: "인증코드 발송",
          text: result.message,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "발송 실패",
        text: "인증 코드 발송에 실패했습니다.",
      });
    }
  };

  /* - 인증 코드 발송: 이메일 입력 후 인증 코드를 발송하는 함수입니다. 이메일이 입력되지 않으면 경고를 표시합니다. */
  const handleVerifyCode = async () => {
    if (!userInputCode) {
      await Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "인증 코드를 입력해주세요.",
      });
      return;
    }

    if (userInputCode === verificationCode?.data?.verificationCode) {
      dispatch(verifyEmail());
      await Swal.fire({
        icon: "success",
        title: "인증 완료",
        text: "이메일 인증이 완료되었습니다.",
      });
    } else {
      await Swal.fire({
        icon: "error",
        title: "인증 실패",
        text: "인증코드가 일치하지 않습니다.",
      });
    }
  };

  /*  인증 코드 확인: 사용자가 입력한 인증 코드가 서버에서 발송한 코드와 일치하는지 확인합니다. */
  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value || "",
    });
  };

  /* - 입력값 변경 처리: 입력 필드의 값이 변경될 때 상태를 업데이트합니다. */
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /* - 오늘 날짜 가져오기: 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수입니다. */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(value.birth_date);
    const today = new Date();

    if (selectedDate > today) {
      await Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "생년월일은 오늘 이후의 날짜를 선택할 수 없습니다.",
      });
      return;
    }

    if (!isEmailVerified) {
      await Swal.fire({
        icon: "warning",
        title: "인증 필요",
        text: "이메일 인증이 필요합니다.",
      });
      return;
    }

    if (
      value.email === "" ||
      value.password === "" ||
      value.confirm_password === "" ||
      value.birth_date === ""
    ) {
      await Swal.fire({
        icon: "warning",
        title: "입력 오류",
        text: "모든 항목은 필수 입력값입니다.",
      });
      return;
    }
    if (value.password !== value.confirm_password) {
      await Swal.fire({
        icon: "error",
        title: "비밀번호 불일치",
        text: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    const data = {
      email: value.email,
      password: value.password,
      birth_date: value.birth_date,
    };

    try {
      const response = await dispatch(fetchPostAuthData(data)).unwrap();
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "회원가입 성공",
          text: response.data.msg,
        });
        navigator("/login");
        return;
      }
      if (response.data.success === false) {
        await Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: response.data.msg,
        });
        return;
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: error.msg,
      });
    }
  };

  /* - 회원가입 처리: 폼 제출 시 호출되며, 입력값의 유효성을 검사하고, 이메일 인증이 완료되었는지 확인합니다. 모든 조건이 충족되면 서버에 회원가입 요청을 보냅니다. */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full m-4 space-y-8 p-10 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold text-gray-800">
            회원가입
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            계정을 생성하세요
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
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 appearance-none relative block px-4 py-3 border border-[#8bd05c] placeholder-[#8bd05c]/40 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bd05c] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#8bd05c]"
                  name="email"
                  onChange={handleChange}
                />
                <button
                  onClick={handleSendVerification}
                  type="button"
                  className="px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  인증코드 발송
                </button>
              </div>
            </div>

            {verificationCode && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  이메일 확인
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="인증코드 입력"
                    className="flex-1 appearance-none relative block px-4 py-3 border border-[#8bd05c] placeholder-[#8bd05c]/40 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bd05c] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#8bd05c]"
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                  />
                  <button
                    onClick={handleVerifyCode}
                    type="button"
                    className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                type="password"
                placeholder="Password"
                className="appearance-none relative block w-full px-4 py-3 border border-[#8bd05c] placeholder-[#8bd05c]/40 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bd05c] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#8bd05c]"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="appearance-none relative block w-full px-4 py-3 border border-[#8bd05c] placeholder-[#8bd05c]/40 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bd05c] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#8bd05c]"
                name="confirm_password"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                생년월일
              </label>
              <input
                type={`${
                  window.innerWidth < 768
                    ? value.birth_date
                      ? "date"
                      : "text"
                    : "date"
                }`}
                className="appearance-none relative block w-full px-4 py-3 border border-[#8bd05c] placeholder-[#8bd05c]/40 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bd05c] focus:border-transparent transition-all duration-200 ease-in-out hover:border-[#8bd05c]"
                name="birth_date"
                onChange={handleChange}
                max={getTodayDate()}
                required
                placeholder="YYYY-MM-DD"
                onFocus={(e) => (e.target.type = "date")}
                value={value.birth_date}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-[#8bd05c] text-white rounded-xl hover:bg-[#7dbb52] transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8bd05c] shadow-sm hover:shadow-md"
            >
              가입하기
            </button>
            <Link to="/" className="flex-1">
              <button
                type="button"
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                취소
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
