import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/slices/loginslice";
import AnifarmLogo from "../../assets/main/aniform.png";
import Swal from "sweetalert2";

const Header2 = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃",
      text: "정말 로그아웃 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(clearToken());

        Swal.fire({
          title: "로그아웃 완료",
          text: "로그아웃 되었습니다.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/");
      }
    });
  };

  return (
    <div className="w-full flex justify-center shadow-custom sticky top-0 z-50">
      <div className="w-full p-1 flex justify-between items-center relative overflow-hidden bg-white">
        <div className="logo left-0">
          <Link to="/">
            <img src={AnifarmLogo} alt="로고" className="w-[50px] y-[100px]" />
          </Link>
        </div>
        <div className="head-all">
          <div className="head-top w-full text-xs md:text-sm info">
            <ul className="flex gap-2 md:gap-6 items-center justify-end">
              {user !== null ? (
                <>
                  <li className="text-neutral-500 hover:text-black transition-all duration-100">
                    <button onClick={handleLogout}>로그아웃</button>
                  </li>
                  <li className="text-neutral-500 hover:text-black transition-all duration-100">
                    <Link to="/mypage">마이페이지</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-neutral-500 hover:text-black transition-all duration-100">
                    <Link to="/login">로그인</Link>
                  </li>
                  <li className="text-neutral-500 hover:text-black transition-all duration-100">
                    <Link to="/register">회원가입</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header2;
