import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  createComment,
  editComment,
  deleteComment,
} from "../../redux/slices/commentSlice";
import {
  getRequest,
  putRequest,
  deleteRequest,
} from "../../utils/requestMethods";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
      // console.log("게시물 ID:", postId);
      // 게시물 데이터 가져오기
      const postResponse = await getRequest(`write/${postId}`);
      // console.log("게시물 서버 응답:", postResponse);

      if (postResponse.success && postResponse.data) {
        setPost(postResponse.data);
        // Redux thunk를 통해 댓글 데이터 가져오기
        dispatch(fetchComments(postId));
      } else {
        console.error("게시물 데이터가 없습니다:", postResponse);
        Swal.fire({
          icon: "error",
          title: "데이터 로드 실패",
          text: "게시물을 불러올 수 없습니다.",
        }).then(() => {
          navigate("/community");
        });
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
      const response = await deleteRequest(`write/${postId}`);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "게시글이 삭제되었습니다.",
          showConfirmButton: false,
          timer: 1500,
        });

        // 게시글의 community_type을 사용
        if (post && post.community_type) {
          navigate(`/community/${post.community_type}`);
        } else {
          // 기본값으로 gardening 사용
          navigate("/community/gardening");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "게시글 삭제 실패",
        text: error.message,
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Redux thunk를 통해 댓글 작성
      await dispatch(
        createComment({
          post_id: parseInt(postId),
          content: newComment,
        })
      );

      setNewComment("");
      // 댓글 작성 후 댓글 목록 새로고침
      dispatch(fetchComments(postId));
      Swal.fire("성공", "댓글이 작성되었습니다.", "success");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      Swal.fire("오류", "로그인이 필요합니다.", "error");
    }
  };

  const handleEditPost = async () => {
    try {
      const requestData = {
        title: post.title,
        content: post.content,
      };

      // console.log("게시글 수정 요청:", requestData);
      // console.log("요청 URL:", `write/${postId}`);

      const response = await putRequest(`write/${postId}`, {
        body: JSON.stringify(requestData),
      });

      // console.log("게시글 수정 응답:", response);

      if (response.success) {
        setIsEditing(false);
        await Swal.fire({
          icon: "success",
          title: "수정 완료",
          text: "게시글이 성공적으로 수정되었습니다.",
        });
        await fetchPostAndComments();
      } else {
        throw new Error(response.message || "게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      await Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: error.message || "게시글 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      // Redux thunk를 통해 댓글 수정
      await dispatch(editComment(commentId, editedContent, postId));

      setEditingCommentId(null);
      setEditedContent("");
      Swal.fire("성공", "댓글이 수정되었습니다.", "success");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      Swal.fire("오류", "댓글 수정에 실패했습니다.", "error");
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
        // Redux thunk를 통해 댓글 삭제
        await dispatch(deleteComment(commentId));
        Swal.fire("삭제 완료!", "댓글이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        Swal.fire("오류", "댓글 삭제에 실패했습니다.", "error");
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
    };
    return categories[category] || category;
  };

  const isPostAuthor = () => {
    return currentUser && post.user_id === currentUser.id;
  };

  const isCommentAuthor = (comment) => {
    return currentUser && comment.user_id === currentUser.id;
  };

  if (loading || !post) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

      <div className="bg-white rounded-lg shadow-md p-6">
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
