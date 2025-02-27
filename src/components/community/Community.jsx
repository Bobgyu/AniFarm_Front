import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  selectPosts,
} from "../../redux/slices/writeSlice";
import Write from "./Write";
import CommunityNavigation from "./CommunityNavigation";
import CreatePostModal from "./WriteModal";
import { getRequest } from "../../utils/requestMethods";

const Community = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const posts = useSelector(selectPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 현재 커뮤니티 타입 결정
  const getCommunityType = () => {
    if (location.pathname.includes("/gardening")) return "gardening";
    if (location.pathname.includes("/marketplace")) return "marketplace";
    if (location.pathname.includes("/freeboard")) return "freeboard";
    return "freeboard"; // 기본값
  };

  const communityType = getCommunityType();

  // 커뮤니티 타입별 카테고리 설정
  const getCategoriesByType = () => {
    switch (communityType) {
      case "gardening":
        return [
          { id: "all", name: "전체" },
          { id: "food", name: "식물 재배" },
          { id: "indoor", name: "실내 식물" },
          { id: "pests", name: "병충해 관리" },
          { id: "hydroponic", name: "수경 재배" },
        ];
      case "marketplace":
        return [
          { id: "all", name: "전체" },
          { id: "marketplace", name: "판매/구매" },
        ];
      case "general":
        return [
          { id: "all", name: "전체" },
          { id: "general", name: "자유게시판" },
        ];
      default:
        return [{ id: "all", name: "전체" }];
    }
  };

  const categories = getCategoriesByType();

  // 게시글 가져오기
  const fetchPosts = async () => {
    dispatch(getPostsStart());
    try {
      // 특정 커뮤니티 타입의 게시글만 가져오기
      const response = await getRequest(`write/community/${communityType}`);
      dispatch(getPostsSuccess(response.data));
    } catch (err) {
      dispatch(getPostsFailure(err.message));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [communityType]); // communityType이 변경될 때마다 게시글 다시 가져오기

  // 게시글 필터링
  const filteredPosts = (posts || []).filter((post) => {
    if (!post) return false;

    const matchesSearch =
      searchTerm === "" ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesCommunityType = post.community_type === communityType;

    return matchesSearch && matchesCategory && matchesCommunityType;
  });

  return (
    <div className="container mx-auto p-4">
      <CommunityNavigation />

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-600 cursor-pointer hover:text-gray-800 border border-gray-300 rounded-lg px-4 py-2 flex items-center"
          >
            {selectedCategory === "all" ? "전체" : selectedCategory}
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
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
            placeholder="검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            글쓰기
          </button>
        </div>
      </div>

      <Write posts={filteredPosts} />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchPosts();
        }}
        communityType={communityType}
      />
    </div>
  );
};

export default Community;
