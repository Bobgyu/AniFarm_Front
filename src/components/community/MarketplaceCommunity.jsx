import React from "react";
import CommunityNavigation from "./CommunityNavigation";
import Write from "./Write";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/writeSlice";

const MarketplaceCommunity = () => {
  const allPosts = useSelector(selectPosts);
  // 판매하기 관련 카테고리만 필터링
  const marketPosts = allPosts.filter(
    (post) => post.category === "marketplace"
  );

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          판매하기 커뮤니티
        </h1>
        <p className="text-gray-600">식물과 관련된 물품을 거래해보세요</p>
      </div>

      <CommunityNavigation />
      <Write posts={marketPosts} communityType="marketplace" />
    </div>
  );
};

export default MarketplaceCommunity;
