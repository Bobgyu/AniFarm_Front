import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Support = () => {
  const [activeTab, setActiveTab] = useState('support');
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'support' 
        ? '/api/support/programs'
        : '/api/education/programs';
      const response = await axios.get(`http://localhost:8000${endpoint}`);
      setPrograms(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / itemsPerPage));
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    try {
      const endpoint = activeTab === 'support'
        ? `/api/support/detail/${id}`
        : `/api/education/detail/${id}`;
      const response = await axios.get(`http://localhost:8000${endpoint}`);
      setSelectedProgram(response.data.data);
    } catch (err) {
      setError('상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleProgramClick = (program) => {
    if (program.url) {
      window.open(program.url, '_blank');
    } else {
      fetchDetail(program.id);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = programs.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-600">농업인 지원 프로그램</h1>

      {/* 탭 메뉴 */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 shadow-sm">
          <button
            className={`px-8 py-3 rounded-l-lg transition-colors duration-200 ${
              activeTab === 'support'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('support')}
          >
            지원사업
          </button>
          <button
            className={`px-8 py-3 rounded-r-lg transition-colors duration-200 ${
              activeTab === 'education'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('education')}
          >
            교육 프로그램
          </button>
        </div>
      </div>
      
      {/* 프로그램 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentItems.map((program) => (
          <motion.div
            key={program.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg p-6 cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow duration-200"
            onClick={() => handleProgramClick(program)}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 line-clamp-2">{program.title}</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium text-green-600">대상:</span> {program.target}
              </p>
              {activeTab === 'support' ? (
                <>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">신청기간:</span> {program.application_period}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">주관기관:</span> {program.organization}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">연락처:</span> {program.contact || '-'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">교육기간:</span> {program.period}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">신청기간:</span> {program.application_period}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">교육방법:</span> {program.eduMethod} {program.eduMethod2} {program.eduMethod3}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">교육인원:</span> {program.capacity}명
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">교육시간:</span> {program.eduTime}시간
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">수강료:</span> {program.price || '무료'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">주관기관:</span> {program.organization}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-green-600">연락처:</span> {program.contact || '-'}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            다음
          </button>
        </div>
      )}

      {/* 상세 정보 모달 */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProgram.title}</h2>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {activeTab === 'support' ? (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">사업 개요</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">지원 내용</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.support_content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">신청 자격</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.requirements}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">제출 서류</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.documents}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">교육 내용</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.content}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">신청 자격</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProgram.requirements}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">교육 정원</h3>
                    <p className="text-gray-700">{selectedProgram.capacity}명</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-600">교육비</h3>
                    <p className="text-gray-700">{selectedProgram.price || '무료'}</p>
                  </div>
                </>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2 text-green-600">문의처</h3>
                <p className="text-gray-700">{selectedProgram.contact || '-'}</p>
              </div>

              <div className="mt-6 pt-4 border-t">
                {activeTab === 'support' ? (
                  <>
                    <p className="text-sm text-gray-500">
                      신청기간: {selectedProgram.application_period}
                    </p>
                    <p className="text-sm text-gray-500">
                      주관기관: {selectedProgram.organization}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      교육기간: {selectedProgram.period}
                    </p>
                    <p className="text-sm text-gray-500">
                      신청기간: {selectedProgram.application_period}
                    </p>
                    <p className="text-sm text-gray-500">
                      교육방법: {selectedProgram.eduMethod} {selectedProgram.eduMethod2} {selectedProgram.eduMethod3}
                    </p>
                    <p className="text-sm text-gray-500">
                      교육시간: {selectedProgram.eduTime}시간
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Support;
