import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../redux/slices/loginslice";
import AnifarmLogo from "../../assets/main/aniform.png";
import Swal from "sweetalert2";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleMenuItemClick = (category, item) => {
    let path = '';
    
    // 상세 경로 매핑
    if (category === "재배 분야") {
      switch (item) {
        case "육성법":
          path = "/TrainingMethod";
          break;
        case "병충해":
          path = "/Pests";
          break;
        case "날씨":
          path = "/Test2";
          break;
        default:
          path = "/culture";
      }
    } else if (category === "판매 분야") {
      switch (item) {
        case "소비 트렌드":
          path = "/pricinginformation";
          break;
        case "가격 예측":
          path = "/sellinformation";
          break;
        default:
          path = "/sale";
      }
    }

    // 카테고리와 아이템 모두 파라미터로 전달
    const queryParams = new URLSearchParams({
      category: category,
      type: item
    });

    // 경로 이동
    navigate(`${path}?${queryParams.toString()}`);
    setIsMenuOpen(false);
  };

  const menuStructure = {
    "재배 분야": ["육성법", "병충해", "날씨" ],
    "판매 분야": ["소비 트렌드", "가격 예측"]
  };

  return (
    <div className="w-full flex justify-center shadow-custom sticky top-0 z-50">
      <div className="w-full p-1 pb-7 flex flex-col items-center relative overflow-hidden bg-white h-24">
        <div className="logo absolute left-4">
          <Link to="/">
            <img src={AnifarmLogo} alt="로고" className="w-[50px] y-[100px]" />
          </Link>
        </div>
        
        <div className="main-menu flex gap-8 justify-center items-center h-full mt-8">
          <Link 
            to="/culture" 
            className="text-lg font-semibold text-neutral-500 hover:text-black transition-all duration-100 px-6 py-2 hover:bg-gray-100 rounded-lg"
          >
            재배하기
          </Link>
          <Link 
            to="/sale" 
            className="text-lg font-semibold text-neutral-500 hover:text-black transition-all duration-100 px-6 py-2 hover:bg-gray-100 rounded-lg"
          >
            판매하기
          </Link>
        </div>

        <div className="head-all absolute right-4 top-8">
          <div className="head-top w-full text-xs md:text-sm info">
            <ul className="flex gap-4 md:gap-8 items-center justify-end mr-4">
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
              <li>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <div className="w-6 h-5 flex flex-col justify-between">
                    <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                    <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                    <span className="w-full h-0.5 bg-gray-600 rounded-full"></span>
                  </div>
                </button>
              </li>
            </ul>
          </div>
          
          {isMenuOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}>
              <div 
                className="absolute right-0 top-0 w-80 bg-white shadow-lg rounded-l-lg h-screen overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">메뉴</h2>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(menuStructure).map(([category, items]) => (
                      <div key={category} className="border rounded-lg">
                        <div className="font-semibold p-3 bg-gray-50 rounded-t-lg border-b">
                          {category}
                        </div>
                        <div className="p-3">
                          <div className="pl-4 space-y-2">
                            {items.map((item, index) => (
                              <div 
                                key={index} 
                                className="text-gray-600 hover:text-black cursor-pointer"
                                onClick={() => handleMenuItemClick(category, item)}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
