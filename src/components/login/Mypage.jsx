import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, fetchDeleteAuthData, fetchUpdateAuthData } from "../../redux/slices/authslice";
import { fetchMyPosts } from "../../redux/slices/writeSlice";
import { fetchMyComments } from "../../redux/slices/commentSlice";
import { FaUser, FaEnvelope, FaCalendar, FaComments, FaPen } from "react-icons/fa";
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

  const myPosts = useSelector((state) => state.write.myPosts);
  const myComments = useSelector((state) => state.comments.myComments);

  // 선택된 카테고리 상태 추가
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // 페이지네이션 함수
  const paginate = (items, pageNumber) => {
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    return items?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];
  };

  // 전체 페이지 수 계산
  const getTotalPages = (items) => {
    return Math.ceil((items?.length || 0) / ITEMS_PER_PAGE);
  };

  // 필터링된 게시글 목록
  const filteredPosts = useMemo(() => {
    if (!myPosts) return [];
    if (selectedCategory === 'all') return myPosts;

    return myPosts.filter(post => {
      switch(selectedCategory) {
        case 'growing':
          return post.community_type !== 'freeboard' && 
                 ['food', 'indoor', 'pests', 'hydroponic', 'general'].includes(post.category);
        case 'market':
          return post.community_type !== 'freeboard' && 
                 ['sell', 'buy'].includes(post.category);
        case 'free':
          return post.community_type === 'freeboard';
        default:
          return true;
      }
    });
  }, [myPosts, selectedCategory]);

  // 현재 페이지의 게시글/댓글
  const currentPosts = paginate(filteredPosts, currentPostPage);
  const currentComments = paginate(myComments, currentCommentPage);

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPostPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserInfo());
    dispatch(fetchMyPosts());
    dispatch(fetchMyComments());
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
    <div className="min-h-[calc(100vh-64px)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* 프로필 섹션 */}
          <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
            {userInfo && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center drop-shadow-[4px_4px_12px_rgba(34,197,94,0.4)]">
                    <FaUser className="text-green-500 text-3xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-green-600">내 정보</h2>
                </div>

                <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
                  <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
                    <FaEnvelope className="text-green-500 text-lg" />
                    <p className="text-gray-900 text-lg">이메일</p>
                  </div>
                  <p className="text-gray-900 text-lg pl-9">{userInfo.data?.email}</p>
                </div>

                <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
                  <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
                    <FaCalendar className="text-green-500 text-lg" />
                    <p className="text-gray-900 text-lg">생년월일</p>
                  </div>
                  <p className="text-gray-900 text-lg pl-9">
                    {userInfo.data?.birth_date || '정보 없음'}
                  </p>
                </div>

                <div className="bg-white/50 p-5 rounded-xl border border-gray-300">
                  <div className="flex items-center space-x-5 mb-3 border-b border-gray-300 pb-3">
                    <FaCalendar className="text-green-500 text-lg" />
                    <p className="text-gray-900 text-lg">가입일</p>
                  </div>
                  <p className="text-gray-900 text-lg pl-9">
                    {userInfo.data?.created_at ? userInfo.data.created_at.split(' ')[0] : '정보 없음'}
                  </p>
                </div>

                {/* 비밀번호 변경 및 회원 탈퇴 버튼 */}
                <div className="space-y-4 pt-5 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-3 px-4 bg-[#3db451] text-white rounded-lg hover:bg-[#36a575] transition-colors text-lg"
                  >
                    비밀번호 재설정
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2 px-4 bg-[#c41e3a] text-white rounded-lg hover:bg-[#a01830] transition-colors text-base border-2 border-red-700"
                  >
                    회원 탈퇴
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 활동 내역 섹션 */}
          <div className="flex-1 max-w-xl space-y-6">
            {/* 내 게시글 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <FaPen className="text-green-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  내 게시글 ({myPosts?.length || 0})
                </h2>
              </div>

              {/* 카테고리 필터 버튼 */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setSelectedCategory('growing')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'growing'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  재배하기
                </button>
                <button
                  onClick={() => setSelectedCategory('market')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'market'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  판매/구매
                </button>
                <button
                  onClick={() => setSelectedCategory('free')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'free'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  자유게시판
                </button>
              </div>

              {/* 필터링된 게시글 목록 */}
              <div className="max-h-[300px] overflow-y-auto">
                {filteredPosts.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {currentPosts.map((post) => (
                        <div
                          key={post.post_id}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/Community/${post.post_id}`)}
                        >
                          <h3 className="font-medium text-gray-900">{post.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-500">
                              {post.community_type === 'freeboard' 
                                ? '자유게시판' 
                                : getCategoryName(post.category)}
                            </span>
                            <p className="text-sm text-gray-500">
                              {new Date(post.created_at || post.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* 게시글 페이지네이션 */}
                    {getTotalPages(filteredPosts) > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: getTotalPages(filteredPosts) }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPostPage(pageNum)}
                            className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                              currentPostPage === pageNum
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {selectedCategory === 'all' 
                      ? '작성한 게시글이 없습니다.' 
                      : '해당 카테고리의 게시글이 없습니다.'}
                  </p>
                )}
              </div>
            </div>

            {/* 내 댓글 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <FaComments className="text-green-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  내 댓글 ({myComments?.length || 0})
                </h2>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {myComments?.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {currentComments.map((comment) => (
                        <div
                          key={comment.comment_id}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => navigate(`/Community/${comment.post_id}`)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900 truncate flex-1">
                              게시글: {comment.post_title}
                            </h3>
                            <span className="text-sm text-gray-500 ml-2">
                              {comment.community_type === 'freeboard' 
                                ? '자유게시판' 
                                : getCategoryName(comment.category)}
                            </span>
                          </div>
                          <p className="text-gray-700 break-words">
                            {comment.content}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(comment.created_at || comment.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* 댓글 페이지네이션 */}
                    {getTotalPages(myComments) > 1 && (
                      <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: getTotalPages(myComments) }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentCommentPage(pageNum)}
                            className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                              currentCommentPage === pageNum
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">작성한 댓글이 없습니다.</p>
                )}
              </div>
            </div>
          </div>
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

// Write.jsx의 getCategoryName 함수도 가져와서 사용
const getCategoryName = (category) => {
  const categories = {
    general: "일반 토론",
    food: "식물 재배",
    indoor: "실내 식물",
    pests: "병충해 관리",
    hydroponic: "수경 재배",
    question: "질문하기",
    sell: "판매하기",
    buy: "구매하기"
  };
  return categories[category] || category;
};

export default Mypage;
