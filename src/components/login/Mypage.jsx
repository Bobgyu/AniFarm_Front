import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo, fetchDeleteAuthData, fetchUpdateAuthData } from "../../redux/slices/authslice";
import { fetchMyPosts } from "../../redux/slices/writeSlice";
import { fetchMyComments } from "../../redux/slices/commentSlice";
import { FaUser, FaEnvelope, FaCalendar, FaComments, FaPen, FaEllipsisV, FaList, FaSeedling, FaStore, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  // 댓글 필터링을 위한 상태 추가
  const [selectedCommentCategory, setSelectedCommentCategory] = useState('all');

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

  // 필터링된 댓글 목록
  const filteredComments = useMemo(() => {
    if (!myComments) return [];
    if (selectedCommentCategory === 'all') return myComments;

    return myComments.filter(comment => {
      switch(selectedCommentCategory) {
        case 'growing':
          return comment.community_type === 'gardening';
        case 'market':
          return comment.community_type === 'marketplace';
        case 'free':
          return comment.community_type === 'freeboard';
        default:
          return true;
      }
    });
  }, [myComments, selectedCommentCategory]);

  // 현재 페이지의 게시글/댓글
  const currentPosts = paginate(filteredPosts, currentPostPage);
  const currentComments = paginate(filteredComments, currentCommentPage);

  // 카테고리 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPostPage(1);
  }, [selectedCategory]);

  // 카테고리 변경 시 댓글 페이지 초기화
  useEffect(() => {
    setCurrentCommentPage(1);
  }, [selectedCommentCategory]);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65] mt-[-100px]" />
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
          {/* 프로필 섹션 수정 */}
          <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-5 sticky top-[120px] h-fit max-h-[calc(100vh-120px)]">
            {userInfo && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-green-600 border-b border-gray-200 pb-4">내 정보</h2>

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
          <div className="flex-1 space-y-6">
            {/* 내 게시글 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <FaPen className="text-green-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  내 게시글 ({myPosts?.length || 0})
                </h2>
              </div>

              {/* 게시글 카테고리 필터 버튼 */}
              <div className="flex gap-3 mb-4">
                {[
                  { id: 'all', label: '전체', icon: <FaList /> },
                  { id: 'growing', label: '재배하기', icon: <FaSeedling /> },
                  { id: 'market', label: '판매/구매', icon: <FaStore /> },
                  { id: 'free', label: '자유게시판', icon: <FaComments /> }
                ].map(button => (
                  <button
                    key={button.id}
                    onClick={() => setSelectedCategory(button.id)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                      ${selectedCategory === button.id
                        ? 'bg-green-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {button.icon}
                    {button.label}
                  </button>
                ))}
              </div>

              {/* 게시글 목록 */}
              <div className="space-y-3">
                {currentPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 relative group"
                    onClick={() => navigate(`/Community/${post.post_id}`)}
                  >
                    {/* 더보기 버튼 추가 */}
                    <button 
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        // 더보기 메뉴 표시 로직
                      }}
                    >
                      <FaEllipsisV className="text-gray-500 hover:text-gray-700" />
                    </button>

                    {/* 게시글 제목 */}
                    <div className="mb-3">
                      <h3 
                        className="font-medium text-gray-900 truncate"
                        title={post.title}
                      >
                        {post.title}
                      </h3>
                    </div>

                    {/* 게시글 정보 */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        {/* 카테고리 태그 스타일 적용 */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${post.community_type === 'gardening' ? 'bg-green-100 text-green-800' : 
                            post.community_type === 'marketplace' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {post.community_type === 'freeboard' 
                            ? '자유게시판' 
                            : getCategoryName(post.category)}
                        </span>
                      </div>
                      {/* 날짜를 하단에 오른쪽 정렬 */}
                      <p className="text-xs text-gray-500 text-right">
                        {new Date(post.created_at || post.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\./g, '.').slice(0, -1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 게시글 페이지네이션 */}
              {getTotalPages(filteredPosts) > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPostPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPostPage === 1}
                    className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <FaChevronLeft />
                  </button>
                  {Array.from({ length: getTotalPages(filteredPosts) }, (_, i) => i + 1)
                    .filter(num => {
                      const distance = Math.abs(num - currentPostPage);
                      return distance <= 2 || num === 1 || num === getTotalPages(filteredPosts);
                    })
                    .map((pageNum, index, array) => (
                      <React.Fragment key={pageNum}>
                        {index > 0 && array[index - 1] !== pageNum - 1 && (
                          <span className="text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPostPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 
                            ${currentPostPage === pageNum
                              ? 'bg-green-600 text-white font-medium transform scale-110'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                          {pageNum}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setCurrentPostPage(prev => 
                      Math.min(prev + 1, getTotalPages(filteredPosts))
                    )}
                    disabled={currentPostPage === getTotalPages(filteredPosts)}
                    className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>

            {/* 내 댓글 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <FaComments className="text-green-500 text-xl" />
                <h2 className="text-xl font-semibold text-gray-800">
                  내 댓글 ({myComments?.length || 0})
                </h2>
              </div>

              {/* 댓글 카테고리 필터 버튼 */}
              <div className="flex gap-3 mb-4">
                {[
                  { id: 'all', label: '전체', icon: <FaList /> },
                  { id: 'growing', label: '재배하기', icon: <FaSeedling /> },
                  { id: 'market', label: '판매/구매', icon: <FaStore /> },
                  { id: 'free', label: '자유게시판', icon: <FaComments /> }
                ].map(button => (
                  <button
                    key={button.id}
                    onClick={() => setSelectedCommentCategory(button.id)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
                      ${selectedCommentCategory === button.id
                        ? 'bg-green-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {button.icon}
                    {button.label}
                  </button>
                ))}
              </div>

              {filteredComments.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {currentComments.map((comment) => (
                      <div
                        key={comment.comment_id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 relative group"
                        onClick={() => navigate(`/Community/${comment.post_id}`)}
                      >
                        {/* 더보기 버튼 추가 */}
                        <button 
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 더보기 메뉴 표시 로직
                          }}
                        >
                          <FaEllipsisV className="text-gray-500 hover:text-gray-700" />
                        </button>

                        {/* 댓글 내용 */}
                        <div className="mb-3">
                          <h3 
                            className="font-medium text-gray-900 truncate"
                            title={comment.content}
                          >
                            {comment.content}
                          </h3>
                        </div>

                        {/* 게시글 정보 */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* 카테고리 태그 스타일 적용 */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${comment.community_type === 'gardening' ? 'bg-green-100 text-green-800' : 
                                comment.community_type === 'marketplace' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}
                            >
                              {getCommunityTypeName(comment.community_type)}
                            </span>
                            <span className="text-sm text-gray-900 truncate flex-1" title={comment.post_title}>
                              {comment.post_title}
                            </span>
                          </div>
                          {/* 날짜를 하단에 오른쪽 정렬 */}
                          <p className="text-xs text-gray-500 text-right">
                            {new Date(comment.created_at || comment.date).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\./g, '.').slice(0, -1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 페이지네이션 개선 */}
                  {getTotalPages(filteredComments) > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setCurrentCommentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentCommentPage === 1}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <FaChevronLeft />
                      </button>
                      {Array.from({ length: getTotalPages(filteredComments) }, (_, i) => i + 1)
                        .filter(num => {
                          const distance = Math.abs(num - currentCommentPage);
                          return distance <= 2 || num === 1 || num === getTotalPages(filteredComments);
                        })
                        .map((pageNum, index, array) => (
                          <React.Fragment key={pageNum}>
                            {index > 0 && array[index - 1] !== pageNum - 1 && (
                              <span className="text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentCommentPage(pageNum)}
                              className={`px-4 py-2 rounded-lg transition-all duration-200 
                                ${currentCommentPage === pageNum
                                  ? 'bg-green-600 text-white font-medium transform scale-110'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                              {pageNum}
                            </button>
                          </React.Fragment>
                        ))}
                      <button
                        onClick={() => setCurrentCommentPage(prev => 
                          Math.min(prev + 1, getTotalPages(filteredComments))
                        )}
                        disabled={currentCommentPage === getTotalPages(filteredComments)}
                        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {selectedCommentCategory === 'all' 
                    ? '작성한 댓글이 없습니다.' 
                    : '해당 카테고리의 댓글이 없습니다.'}
                </p>
              )}
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

// community_type에 따른 이름 반환 함수 추가
const getCommunityTypeName = (type) => {
  const types = {
    marketplace: "판매하기",
    gardening: "재배하기",
    freeboard: "자유게시판"
  };
  return types[type] || type;
};

export default Mypage;
