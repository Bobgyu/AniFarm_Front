import { createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../utils/requestMethods";

const initialState = {
  comments: [],
  myComments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // 로딩 상태
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // 에러 상태
    setError: (state, action) => {
      state.error = action.payload;
    },
    // 댓글 목록 설정
    setComments: (state, action) => {
      state.comments = action.payload;
      state.loading = false;
      state.error = null;
    },
    // 댓글 추가
    addComment: (state, action) => {
      state.comments.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },
    // 댓글 수정
    updateComment: (state, action) => {
      const { comment_id, content } = action.payload;
      const comment = state.comments.find((c) => c.comment_id === comment_id);
      if (comment) {
        comment.content = content;
      }
      state.loading = false;
      state.error = null;
    },
    // 댓글 삭제
    removeComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.comment_id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
    // 내 댓글 목록 설정
    setMyComments: (state, action) => {
      state.myComments = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

// 액션 생성자
export const {
  setLoading,
  setError,
  setComments,
  addComment,
  updateComment,
  removeComment,
  setMyComments,
} = commentSlice.actions;

// Thunk 액션 생성자
export const fetchComments = (postId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getRequest(`comments/${postId}`);
    // console.log("댓글 조회 응답:", response);

    if (Array.isArray(response)) {
      dispatch(setComments(response));
    } else if (response.data) {
      dispatch(setComments(response.data));
    }
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    dispatch(setError(error.message));
  }
};

export const createComment = (commentData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    console.log("댓글 작성 요청 데이터:", {
      post_id: commentData.post_id,
      content: commentData.content,
    });

    const response = await postRequest("comments", {
      body: JSON.stringify({
        post_id: commentData.post_id,
        content: commentData.content,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("댓글 작성 응답:", response);

    if (response && response.data) {
      dispatch(addComment(response.data));
      return response;
    } else {
      // console.error("서버 응답 내용:", response);
      throw new Error(response.message || "댓글 작성에 실패했습니다.");
    }
  } catch (error) {
    // console.error("댓글 작성 실패:", error);
    dispatch(setError(error.message));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const editComment = (commentId, content, postId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await putRequest(`comments/${commentId}`, {
      body: JSON.stringify({ content, post_id: postId }),
    });
    console.log("댓글 수정 응답:", response);

    if (response.message === "댓글이 수정되었습니다.") {
      dispatch(updateComment({ comment_id: commentId, content }));
    }
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    dispatch(setError(error.message));
  }
};

export const deleteComment = (commentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await deleteRequest(`comments/${commentId}`);
    // console.log("댓글 삭제 응답:", response);

    if (response.message === "댓글이 삭제되었습니다.") {
      dispatch(removeComment(commentId));
    }
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    dispatch(setError(error.message));
  }
};

export const fetchMyComments = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await getRequest("comments/my");
    console.log("내 댓글 조회 응답:", response);

    if (response.success) {
      dispatch(setMyComments(response.data));
    }
  } catch (error) {
    console.error("내 댓글 조회 실패:", error);
    dispatch(setError(error.message));
  }
};

export default commentSlice.reducer;
