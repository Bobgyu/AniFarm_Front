import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoading,
  selectPosts,
  deletePost,
} from "../../redux/slices/writeSlice";
import WriteModal from "./WriteModal";
import { useNavigate } from "react-router-dom";

const Write = ({ posts }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePostClick = (postId) => {
    navigate(`/Community/${postId}`);
  };

  const handlePostDeleted = (deletedPostId) => {
    dispatch(deletePost(deletedPostId));
  };

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

  // 이메일을 마스킹하는 함수 수정 (첫 글자만 보여주는 버전)
  const formatUserEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    return `${username.slice(0, 2)}***@${domain}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65] mt-[-100px]" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-600">게시글이 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/6 md:w-1/2 px-4 py-3 text-center md:text-left whitespace-nowrap text-sm font-semibold text-gray-600">
                제목
              </th>
              <th className="w-1/6 md:w-1/6 px-4 py-3 text-center md:text-left whitespace-nowrap text-sm font-semibold text-gray-600">
                카테고리
              </th>
              <th className="w-1/6 md:w-1/6 px-4 py-3 text-center md:text-left whitespace-nowrap text-sm font-semibold text-gray-600">
                작성자
              </th>
              <th className="w-1/6 md:w-1/6 px-4 py-3 text-center md:text-left whitespace-nowrap text-sm font-semibold text-gray-600">
                작성일
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, index) => (
              <tr
                key={`post-${post.post_id || index}`}
                onClick={() => handlePostClick(post.post_id)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-4 text-left">
                  <div className="flex items-center">
                    <span className="text-gray-900">{post.title}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-left text-sm text-gray-600">
                  {getCategoryName(post.category)}
                </td>
                <td className="px-4 py-4 text-left text-sm text-gray-600">
                  {formatUserEmail(post.email)}
                </td>
                <td className="px-4 py-4 text-left text-sm text-gray-600">
                  {new Date(post.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2 mb-3">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum
                ? 'bg-[#3a9d1f] text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {selectedPost && (
        <WriteModal
          isOpen={!!selectedPost}
          onClose={() => {
            setSelectedPost(null);
            setModalMode(null);
          }}
          mode={modalMode}
          post={selectedPost}
          onPostDeleted={handlePostDeleted}
        />
      )}
    </div>
  );
};

export default Write;
