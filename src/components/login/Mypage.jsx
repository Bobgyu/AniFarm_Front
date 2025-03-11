import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, fetchDeleteAuthData, fetchUpdateAuthData } from "../../redux/slices/authslice";
import { FaUser, FaEnvelope, FaCalendar } from "react-icons/fa";
import Swal from 'sweetalert2';

const Mypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userInfoLoading, userInfoError } = useSelector(
    (state) => state.auth
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

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
    // console.log("User Info:", userInfo);
  }, [userInfo]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '새 비밀번호가 일치하지 않습니다.'
      });
      return;
    }

    try {
      const result = await dispatch(fetchUpdateAuthData({
        current_password: passwords.current,
        new_password: passwords.new
      })).unwrap();

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: '성공',
          text: '비밀번호가 성공적으로 변경되었습니다.'
        });
        setShowPasswordModal(false);
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        throw new Error(result.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: error.message || '비밀번호 변경에 실패했습니다.'
      });
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '회원 탈퇴',
      text: '탈퇴를 결정하시기 전에 다시 한 번 고민해 보시겠어요? 삭제 후에는 복구할 수 없어요.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(fetchDeleteAuthData()).unwrap();
        localStorage.removeItem('token');
        navigate('/');
        Swal.fire(
          '탈퇴 완료',
          '회원 탈퇴가 완료되었습니다.',
          'success'
        );
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: '오류',
          text: error.message || '회원 탈퇴에 실패했습니다.'
        });
      }
    }
  };

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
    <div className="min-h-[calc(100vh-64px)] w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

              {/* 비밀번호 변경 및 회원 탈퇴 버튼 */}
              <div className="space-y-3 pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2 px-4 bg-[#3a9d1f] text-white rounded-lg hover:bg-[#0aab65] transition-colors"
                >
                  비밀번호 재설정
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">비밀번호 변경</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 border border-gray-400 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  변경
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mypage;
