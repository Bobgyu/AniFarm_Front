import React from "react";
import AnifarmLogo from "../../assets/main/aniform.png";

const Footer = () => {

  const navigateToTest4 = () => {
    window.location.href = "/test4";
  };

  return (
    <footer className="flex justify-center items-center border-t w-full h-24">
      <div className="w-full max-w-7xl px-4">
        <div className="flex justify-between items-center w-full h-full">
          {/* 로고 및 주소 정보 */}
          <div className="flex items-center">
            <img
              src={AnifarmLogo}
              alt="Logo"
              className="w-[50px] mr-4"
            />
            <p className="text-sm text-gray-600">
              (08503) 서울 금천구 가산디지털2로 144 현대테라타워 가산DK A동 20층
              &nbsp;
              <br className="hidden md:block" />
              대표전화: 02-2038-0800 | FAX: 02-000-0000
            </p>
          </div>

          {/* 버튼 추가 */}
          <div className="flex items-center hover:text-green-500">
            <button onClick={navigateToTest4}>Test4</button>
          </div>

          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Copyright © 2025 AnIfarmAll rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
