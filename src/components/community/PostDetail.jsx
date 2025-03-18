import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  createComment,
  editComment,
  deleteComment,
  setLoading,
} from "../../redux/slices/commentSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8000";

const PostDetail = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state에서 댓글 데이터 가져오기
  const comments = useSelector((state) => state.comments.comments);
  const commentLoading = useSelector((state) => state.comments.loading);
  const commentError = useSelector((state) => state.comments.error);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // console.log("useEffect 실행, postId:", postId);
    fetchPostAndComments();

    const token = localStorage.getItem("token");
    // console.log("현재 토큰:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        // console.log("디코딩된 토큰:", decoded);
        setCurrentUser(decoded);
      } catch (error) {
        console.error("토큰 디코딩 실패:", error);
        localStorage.removeItem("token");
      }
    }
  }, [postId, dispatch]);

  const fetchPostAndComments = async () => {
    try {
      // 게시물 데이터 가져오기
      const response = await axios.get(`${BASE_URL}/api/posts/${postId}`);

      if (response.data.success && response.data.data) {
        setPost(response.data.data);
        // Redux thunk를 통해 댓글 데이터 가져오기
        await dispatch(fetchComments(postId));
      } else {
        throw new Error("게시물을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: "게시물을 불러오는 중 오류가 발생했습니다.",
      }).then(() => {
        navigate("/community");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "로그인이 필요합니다.",
          text: "다시 로그인해주세요.",
        });
        return;
      }

      const response = await axios.delete(`${BASE_URL}/api/write/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "게시글이 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate(-1);
        });
      }
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "인증 오류",
          text: "로그인이 필요하거나 인증이 만료되었습니다. 다시 로그인해주세요.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "오류 발생",
          text: "게시글 삭제 중 오류가 발생했습니다.",
        });
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "로그인 필요",
          text: "댓글을 작성하려면 로그인이 필요합니다.",
        });
        return;
      }

      // Redux thunk를 통해 댓글 작성
      const resultAction = await dispatch(
        createComment({
          post_id: parseInt(postId),
          content: newComment.trim(),
        })
      );

      if (createComment.fulfilled.match(resultAction)) {
        setNewComment("");
        // 댓글 작성 후 댓글 목록 새로고침
        await dispatch(fetchComments(postId));
        Swal.fire({
          icon: "success",
          title: "성공",
          text: "댓글이 작성되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
      } else if (createComment.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || "댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      
      Swal.fire({
        icon: "error",
        title: "댓글 작성 실패",
        text: error.message || "댓글 작성 중 오류가 발생했습니다.",
      });
    }
  };

  const handleEditPost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        await Swal.fire({
          icon: "error",
          title: "인증 오류",
          text: "로그인이 필요합니다.",
        });
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/posts/${postId}`,
        {
          title: post.title,
          content: post.content,
          category: post.category,
          community_type: post.community_type
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setIsEditing(false);
        await Swal.fire({
          icon: "success",
          title: "수정 완료",
          text: "게시글이 성공적으로 수정되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
        await fetchPostAndComments();
      } else {
        throw new Error(response.data.message || "게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      
      let errorMessage = "게시글 수정 중 오류가 발생했습니다.";
      if (error.response?.status === 401) {
        errorMessage = "로그인이 필요하거나 인증이 만료되었습니다.";
      } else if (error.response?.status === 403) {
        errorMessage = "게시글을 수정할 권한이 없습니다.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      await Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: errorMessage
      });
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      if (!editedContent.trim()) {
        Swal.fire({
          icon: "warning",
          title: "경고",
          text: "댓글 내용을 입력해주세요.",
        });
        return;
      }

      const result = await dispatch(editComment(commentId, editedContent, postId));
      
      if (result && result.success) {
        setEditingCommentId(null);
        setEditedContent("");
        
        // 댓글 목록 새로고침
        await dispatch(fetchComments(postId));
        
        Swal.fire({
          icon: "success",
          title: "성공",
          text: "댓글이 수정되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error(result?.message || "댓글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      Swal.fire({
        icon: "error",
        title: "오류",
        text: error.message || "댓글 수정에 실패했습니다.",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteComment(commentId));
        Swal.fire({
          icon: "success",
          title: "삭제 완료!",
          text: "댓글이 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: error.message || "댓글 삭제에 실패했습니다.",
        });
      }
    }
  };

  const getCategoryName = (category) => {
    const categories = {
      general: "일반 토론",
      food: "식물 재배",
      indoor: "실내 식물",
      pests: "병충해 관리",
      hydroponic: "수경 재배",
      question: "질문하기",
      marketplace: "판매하기",
      sell: "판매하기",
      buy: "구매하기",
      gardening: "재배하기"
    };
    return categories[category] || category;
  };

  const isPostAuthor = () => {
    return currentUser && post && post.email === currentUser.sub;
  };

  const isCommentAuthor = (comment) => {
    return currentUser && comment && comment.email === currentUser.sub;
  };

  if (loading || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0aab65] mt-[-100px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 뒤로가기 버튼 스타일 수정 */}
      <button
        onClick={() =>
          navigate(`/community/${post.community_type || "gardening"}`)
        }
        className="mb-4 bg-[#3a9d1f] text-white px-6 py-2 rounded-lg hover:bg-[#0aab65] flex items-center mt-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        목록으로 돌아가기
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="text-2xl font-bold w-full p-2 border rounded"
            />
          ) : (
            <h1 className="text-2xl font-bold">{post.title}</h1>
          )}
          <span className="text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600 mr-4">작성자: {post.email}</span>
          <span className="text-gray-600">
            카테고리: {getCategoryName(post.category)}
          </span>
        </div>
        <div className="border-t border-b py-4 mb-4">
          {isEditing ? (
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full p-2 border rounded"
              rows="6"
            />
          ) : (
            <p className="whitespace-pre-wrap">{post.content}</p>
          )}
        </div>
        {isPostAuthor() && (
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditPost}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="댓글을 작성하세요"
            rows="3"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#3a9d1f] text-white rounded hover:bg-[#0aab65]"
            disabled={!newComment.trim()}
          >
            댓글 작성
          </button>
        </form>
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.comment_id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{comment.email}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                {editingCommentId === comment.comment_id ? (
                  <div className="flex space-x-2">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="flex-1 p-2 border rounded"
                      rows="2"
                    />
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEditComment(comment.comment_id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                        disabled={!editedContent.trim()}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditedContent("");
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700">{comment.content}</p>
                    {isCommentAuthor(comment) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.comment_id);
                            setEditedContent(comment.content);
                          }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteComment(comment.comment_id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">댓글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
