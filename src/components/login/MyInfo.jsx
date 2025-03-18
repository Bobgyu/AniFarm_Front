import React from 'react';
import { FaEnvelope, FaCalendar } from 'react-icons/fa';
import Swal from 'sweetalert2';

const MyInfo = ({ userInfo, onPasswordChange, onDeleteAccount }) => {
  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sticky top-[88px] h-fit max-h-[calc(100vh-120px)]">
      {userInfo && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-green-600 border-b border-gray-200 pb-4">내 정보</h2>
          
          {/* 이메일 정보 */}
          <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
            <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
              <FaEnvelope className="text-green-500 text-lg" />
              <p className="text-gray-900 text-lg">이메일</p>
            </div>
            <p className="text-gray-900 text-lg pl-9">{userInfo.data?.email}</p>
          </div>

          {/* 생년월일 정보 */}
          <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
            <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
              <FaCalendar className="text-green-500 text-lg" />
              <p className="text-gray-900 text-lg">생년월일</p>
            </div>
            <p className="text-gray-900 text-lg pl-9">
              {userInfo.data?.birth_date || '정보 없음'}
            </p>
          </div>

          {/* 가입일 정보 */}
          <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
            <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
              <FaCalendar className="text-green-500 text-lg" />
              <p className="text-gray-900 text-lg">가입일</p>
            </div>
            <p className="text-gray-900 text-lg pl-9">
              {userInfo.data?.created_at ? userInfo.data.created_at.split(' ')[0] : '정보 없음'}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="space-y-4 pt-5 mt-4 border-t border-gray-200">
            <button
              onClick={onPasswordChange}
              className="w-full py-3 px-4 bg-[#3db451] text-white rounded-lg hover:bg-[#36a575] transition-colors text-lg"
            >
              비밀번호 재설정
            </button>
            <button
              onClick={onDeleteAccount}
              className="w-full py-2 px-4 bg-[#c41e3a] text-white rounded-lg hover:bg-[#a01830] transition-colors text-base border-2 border-red-700"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInfo; 