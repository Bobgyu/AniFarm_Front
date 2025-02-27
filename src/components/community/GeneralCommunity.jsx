import React from "react";
import CommunityNavigation from "./CommunityNavigation";
import Write from "./Write";
import { useSelector } from "react-redux";
import { selectPosts } from "../../redux/slices/writeSlice";

const GeneralCommunity = () => {
  const allPosts = useSelector(selectPosts);
  // 자유게시판 카테고리만 필터링
  const generalPosts = allPosts.filter((post) => post.category === "general");

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">자유게시판</h1>
        <p className="text-gray-600">자유롭게 이야기를 나눠보세요</p>
      </div>

      <CommunityNavigation />
      <Write posts={generalPosts} communityType="general" />
    </div>
  );
};

export default GeneralCommunity;
