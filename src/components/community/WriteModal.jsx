import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../redux/slices/writeSlice";
import Swal from "sweetalert2";

const CreatePostModal = ({ isOpen, onClose, communityType }) => {
  const dispatch = useDispatch();

  const getInitialCategory = () => {
    switch (communityType) {
      case "gardening":
        return "general";
      case "marketplace":
        return "marketplace";
      case "freeboard":
        return "general";
      default:
        return "general";
    }
  };

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: getInitialCategory(), // communityType 대신 적절한 초기 카테고리 설정
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[WriteModal] 게시글 작성 시작:", postData);

    try {
      const formData = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        community_type: communityType,
      };
      console.log("[WriteModal] 전송할 데이터:", formData);

      const result = await dispatch(createPost(formData)).unwrap();
      console.log("[WriteModal] 게시글 작성 성공:", result);

      Swal.fire({
        icon: "success",
        title: "게시글이 작성되었습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
    } catch (error) {
      console.error("[WriteModal] 게시글 작성 실패:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "로그인이 필요합니다",
          text: "게시글을 작성하려면 로그인이 필요합니다.",
          confirmButtonText: "로그인하기",
          showCancelButton: true,
          cancelButtonText: "취소"
        }).then((result) => {
          if (result.isConfirmed) {
            // 로그인 페이지로 이동하는 로직 추가 필요
            window.location.href = "/login";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "게시글 작성 실패",
          text: error.message || "게시글 작성 중 오류가 발생했습니다.",
        });
      }
    }
  };

  const isFormValid = () => {
    return (
      postData.title.trim() !== "" &&
      postData.content.trim() !== "" &&
      postData.category !== ""
    );
  };

  const getCategoryOptions = () => {
    switch (communityType) {
      case "gardening":
        return (
          <>
            <option value="general">일반 토론</option>
            <option value="food">식물 재배</option>
            <option value="indoor">실내 식물</option>
            <option value="pests">병충해 관리</option>
            <option value="hydroponic">수경 재배</option>
          </>
        );
      case "marketplace":
        return (
          <>
            <option value="question">질문하기</option>
            <option value="sell">판매하기</option>
            <option value="buy">구매하기</option>
          </>
        );
      case "freeboard":
        return null;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">새 게시글 작성</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {communityType !== "freeboard" && (
            <div>
              <label className="block font-semibold mb-1">카테고리</label>
              <select
                value={postData.category}
                onChange={(e) =>
                  setPostData({ ...postData, category: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {getCategoryOptions()}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">제목</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">내용</label>
            <textarea
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              required
              rows="6"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="내용을 입력하세요"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={!isFormValid()}
            >
              작성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
