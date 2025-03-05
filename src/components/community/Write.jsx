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

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const navigate = useNavigate();

  const handlePostClick = (postId) => {
    navigate(`/Community/${postId}`);
  };

  const handlePostDeleted = (deletedPostId) => {
    // 삭제된 게시글은 deletePost thunk에서 자동으로 처리됨
    dispatch(deletePost(deletedPostId));
  };

  // 카테고리 매핑 함수 추가
  const getCategoryName = (category) => {
    const categories = {
      general: "일반 토론",
      food: "식물 재배",
      indoor: "실내 식물",
      pests: "병충해 관리",
      hydroponic: "수경 재배",
    };
    return categories[category] || category;
  };

  if (loading) {
    return <div className="text-center text-gray-600">로딩 중...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-600">게시글이 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              제목
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              카테고리
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              작성자
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
              작성일
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr
              key={`post-${post.post_id || index}`}
              onClick={() => handlePostClick(post.post_id)}
              className="border-b hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4">{post.title}</td>
              <td className="px-6 py-4">{getCategoryName(post.category)}</td>
              <td className="px-6 py-4">{post.email}</td>
              <td className="px-6 py-4">
                {new Date(post.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
