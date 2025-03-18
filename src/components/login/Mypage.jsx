import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, fetchDeleteAuthData, fetchUpdateAuthData } from "../../redux/slices/authslice";
import MyInfo from './MyInfo';
import MyPosts from './MyPosts';
import MyComments from './MyComments';
import PasswordModal from './PasswordModal';
import Swal from 'sweetalert2';

const Mypage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, userInfoLoading, userInfoError } = useSelector((state) => state.auth);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserInfo());
  }, [dispatch, navigate]);

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
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
        Swal.fire('탈퇴 완료', '회원 탈퇴가 완료되었습니다.', 'success');
      } catch (error) {
        Swal.fire('오류', error.message || '회원 탈퇴에 실패했습니다.', 'error');
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
    <div className="min-h-[calc(100vh-64px)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <MyInfo 
            userInfo={userInfo}
            onPasswordChange={handlePasswordChange}
            onDeleteAccount={handleDeleteAccount}
          />
          <div className="flex-1 space-y-6">
            <MyPosts />
            <MyComments />
          </div>
        </div>
      </div>
      {showPasswordModal && (
        <PasswordModal 
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordChange}
        />
      )}
    </div>
  );
};

export default Mypage;
