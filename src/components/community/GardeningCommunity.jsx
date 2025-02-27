import React from "react";
import CommunityNavigation from "./CommunityNavigation";
import Write from "./Write";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/writeSlice";

const GardeningCommunity = () => {
  const allPosts = useSelector(selectPosts);
  // 재배하기 관련 카테고리만 필터링
  const gardeningPosts = allPosts.filter((post) =>
    ["food", "indoor", "pests", "hydroponic"].includes(post.category)
  );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          재배하기 커뮤니티
        </h1>
        <p className="text-gray-600">식물 재배에 대한 정보를 공유해보세요</p>
      </div>

      <CommunityNavigation />
      <Write posts={gardeningPosts} communityType="gardening" />
    </div>
  );
};

export default GardeningCommunity;
