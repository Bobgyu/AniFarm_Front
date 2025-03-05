import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../../redux/slices/authslice";
import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";

const Mypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userInfoLoading, userInfoError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserInfo());
  }, [dispatch, navigate]);

  // 디버깅을 위한 로그 추가
  useEffect(() => {
    console.log("User Info:", userInfo);
  }, [userInfo]);

  if (userInfoLoading) {
    return (
      <div className="flex justify-center items-center h-screen pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800" />
      </div>
    );
  }

  if (userInfoError) {
    // 토큰이 만료되었거나 유효하지 않은 경우
    if (userInfoError.includes("인증이 만료되었습니다") || userInfoError.includes("401")) {
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }

    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{userInfoError}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gray-50 mt-16">
      <div className="flex w-full p-4 gap-4">
        <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {userInfo && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FaUser className="text-green-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-green-600">내 정보</h2>
              </div>

              <div className="bg-white/50 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <FaEnvelope className="text-green-500" />
                  <p className="text-gray-600">이메일</p>
                </div>
                <p className="text-gray-900 font-medium">{userInfo.data?.email}</p>
              </div>

              <div className="bg-white/50 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <FaCalendar className="text-green-500" />
                  <p className="text-gray-600">생년월일</p>
                </div>
                <p className="text-gray-900 font-medium">
                  {userInfo.data?.birth_date || '정보 없음'}
                </p>
              </div>

              <div className="bg-white/50 p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <FaCalendar className="text-green-500" />
                  <p className="text-gray-600">가입일</p>
                </div>
                <p className="text-gray-900 font-medium">
                  {userInfo.data?.created_at ? userInfo.data.created_at.split(' ')[0] : '정보 없음'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage;
