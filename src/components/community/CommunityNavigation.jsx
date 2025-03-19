import React from "react";
import { Link, useLocation } from "react-router-dom";

const CommunityNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path) ? "bg-[#0aab65]" : "bg-[#3a9d1f]";
  };

  return (
    <div className="w-full p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gardening Community
        </h1>
        <p className="text-gray-600">The Forum</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Link
          to="/community/gardening"
          className={`${isActive("/gardening")} 
            text-white px-8 py-3 rounded-lg 
            hover:bg-[#0aab65] transition-colors
            font-semibold text-lg`}
        >
          재배하기
        </Link>
        <Link
          to="/community/marketplace"
          className={`${isActive("/marketplace")} 
            text-white px-8 py-3 rounded-lg 
            hover:bg-[#0aab65] transition-colors
            font-semibold text-lg`}
        >
          판매하기
        </Link>
        <Link
          to="/community/freeboard"
          className={`${isActive("/freeboard")} 
            text-white px-8 py-3 rounded-lg 
            hover:bg-[#0aab65] transition-colors
            font-semibold text-lg`}
        >
          자유게시판
        </Link>
      </div>
    </div>
  );
};

export default CommunityNavigation;
