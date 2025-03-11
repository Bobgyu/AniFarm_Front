import React from "react";
import AnifarmLogo from "../../assets/main/aniform.png";

const Footer = () => {

  const navigateToTest4 = () => {
    window.location.href = "/test4";
  };



  return (
    <footer className="flex justify-center items-center border-t w-full h-[auto] ">
      <div className="w-2/3">
      <div className="flex justify-between flex-wrap w-full h-full px-4">
        {/* 로고 및 주소 정보 */}
        <div className="py-2 md:py-4 flex items-center">
          <img
            src={AnifarmLogo}
            alt="Logo"
            className="w-[30px] md:w-[50px] mb-2 mr-2"
          />
          <p className="text-xs md:text-sm text-gray-600">
            (08503) 서울 금천구 가산디지털2로 144 현대테라타워 가산DK A동 20층
            &nbsp;
            <br className="hidden md:block" />
            대표전화: 02-2038-0800 | FAX: 02-000-0000
          </p>
        </div>

        {/* 버튼 추가 */}
        <div className="py-2 md:py-4 hover:text-green-500">
          <button onClick={navigateToTest4}>Test4</button>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-300 my-2 md:my-4"></div>

        {/* 저작권 정보 */}
        <div className="py-1 md:py-4 text-center">
          <p className="text-xs md:text-sm text-gray-500 mt-12">
            Copyright © 2025 AnIfarmAll rights reserved.
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
