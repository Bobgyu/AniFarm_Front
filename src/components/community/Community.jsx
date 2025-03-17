import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getPostsStart,
  getPostsSuccess,
  getPostsFailure,
  selectPosts,
  fetchPosts,
  selectLoading,
} from "../../redux/slices/writeSlice";
import Write from "./Write";
import CommunityNavigation from "./CommunityNavigation";
import CreatePostModal from "./WriteModal";
import { getRequest } from "../../utils/requestMethods";

const Community = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const postsData = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          { id: "general", name: "일반 토론" },
          { id: "food", name: "식물 재배" },
          { id: "indoor", name: "실내 식물" },
          { id: "pests", name: "병충해 관리" },
          { id: "hydroponic", name: "수경 재배" },
        ];
      case "marketplace":
        return [
          { id: "all", name: "전체" },
          { id: "question", name: "질문하기" },
          { id: "sell", name: "판매하기" },
          { id: "buy", name: "구매하기" },
        ];
      case "freeboard":
        return [
          { id: "all", name: "전체" },
        ];
      default:
        return [{ id: "all", name: "전체" }];
    }
  };

  const categories = getCategoriesByType();

  // 게시글 가져오기
  useEffect(() => {
    dispatch(fetchPosts(communityType));
  }, [dispatch, communityType]);

  // 게시글 필터링
  const filteredPosts = useMemo(() => {
    if (!postsData?.data || !Array.isArray(postsData.data)) {
      console.log("[Community] 유효한 게시글 데이터가 없음");
      return [];
    }

    const filtered = postsData.data.filter((post) => {
      if (!post) return false;

      const matchesSearch =
        searchTerm === "" ||
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        communityType === "freeboard" || 
        selectedCategory === "all" || 
        post.category === selectedCategory;
        
      const matchesCommunityType = post.community_type === communityType;

      return matchesSearch && matchesCategory && matchesCommunityType;
    });

    return filtered;
  }, [postsData, searchTerm, selectedCategory, communityType]);

  // 카테고리 이름 변환 함수 추가
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <CommunityNavigation />

      <div className="flex justify-between items-center mb-6">
        {communityType !== "freeboard" && (
          <div ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 cursor-pointer hover:text-gray-800 border border-gray-300 rounded-lg px-4 py-2 flex items-center"
            >
              {getCategoryName(selectedCategory)}
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
        )}

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
          dispatch(fetchPosts(communityType));
        }}
        communityType={communityType}
      />
    </div>
  );
};

export default Community;
