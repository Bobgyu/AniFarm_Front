import React from "react";
import { Link } from "react-router-dom";
import Traintestimg from "../../assets/Traintestimg.jpg";
import apple from "../../assets/images/apple.jpg";

// 육성법 
const TrainingMethod = () => {
  return (
    <>
      <main className="flex flex-col min-h-screen flex-grow">
        <div className="relative bg-cover bg-center w-full h-minscreen">
          <img
            src={Traintestimg}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-4">
                <p className="text-white text-opacity-80">trainingMethod</p>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="col-start-12 col-end-40 row-start-11 row-end-21 flex flex-col items-center justify-center text-center">
                  <div className="mb-4">
                    <h1 className="text-white text-2xl">작물 육성에</h1>
                    <h1 className="text-white text-2xl">도움이 되는</h1>
                    <h1 className="text-white text-2xl">
                      내용을 알려드립니다.
                    </h1>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/trainingDetail">
                  <button className="border border-white text-white font-bold py-2 px-4 hover:bg-white hover:text-black transition">
                    더 많은 정보 보기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <main className="w-full h-full flex justify-center items-center">
        <img className="w-[10%] h-auto" src={apple} alt="" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">카드 제목</div>
          <p className="text-gray-700 text-base">
            여기에 설명 텍스트가 들어갑니다. 이 텍스트는 카드의 내용을
            설명합니다.
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #태그1
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #태그2
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #태그3
          </span>
        </div>
      </main>
    </>
  );
};

export default TrainingMethod;
