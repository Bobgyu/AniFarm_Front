import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  selectPosts,
} from "../../redux/slices/writeSlice";
import Write from "./Write";
import CreatePostModal from "./WriteModal";
import { getRequest } from "../../utils/requestMethods";

const Community = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { id: "all", name: "전체" },
    { id: "general", name: "일반 토론" },
    { id: "food", name: "식물 재배" },
    { id: "indoor", name: "실내 식물" },
    { id: "pests", name: "병충해 관리" },
    { id: "hydroponic", name: "수경 재배" },
  ];

  const fetchPosts = async () => {
    dispatch(getPostsStart());
    try {
      const response = await getRequest("write");
      dispatch(getPostsSuccess(response.data));
    } catch (err) {
      console.error("Error fetching posts:", err);
      dispatch(getPostsFailure(err.message || "게시글 로딩 실패"));
    }
  };

  // 컴포넌트 마운트 시 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, [dispatch]);

  // 모달 닫을 때 게시글 목록 새로고침
  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchPosts(); // 모달이 닫힐 때 게시글 목록 새로고침
  };

  // 필터링 함수 수정
  const filteredPosts = posts.filter((post) => {
    if (!post.title) return false;

    const postTitle = post.title.toString().toLowerCase();
    const searchQuery = searchTerm.toLowerCase();

    // 제목으로만 검색하도록 수정
    const searchMatch = postTitle.includes(searchQuery);

    // 카테고리 필터링
    const categoryMatch =
      selectedCategory === "all" || post.category === selectedCategory;

    return searchMatch && categoryMatch;
  });

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId) => {
    // console.log("선택된 카테고리 ID:", categoryId);
    setSelectedCategory(categoryId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* 헤더 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Gardening Community
        </h1>
        <h2 className="text-2xl text-gray-600">The Forum</h2>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-600 cursor-pointer hover:text-gray-800 border border-gray-300 rounded-lg px-4 py-2 flex items-center"
          >
            {categories.find((cat) => cat.id === selectedCategory)?.name ||
              "Categories"}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Create New Post
          </button>
        </div>
      </div>

      {/* Write 컴포넌트에 필터링된 게시물 전달 */}
      <Write posts={filteredPosts} />

      {/* 새 게시글 작성 모달 */}
      <CreatePostModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default Community;
