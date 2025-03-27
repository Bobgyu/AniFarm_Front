import React, { useState, useEffect } from "react";
import axios from "axios";

const AgricultureGoalSetting = ({ onComplete, method }) => {
  const [formData, setFormData] = useState({
    targetIncome: "",
    cultivationArea: "",
    selectedCrops: [],
    investmentAmount: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 모든 작물 데이터 로드
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/crop-data");
        if (response.data.success) {
          const formattedCrops = response.data.data.map((crop) => ({
            id: crop.id,
            crop_name: crop.crop_name,
            region: crop.region,
            hourly_sales: crop.revenue_per_hour,
            sales_per_area: crop.revenue_per_3_3m,
          }));
          setCrops(formattedCrops);
        } else {
          setError("작물 데이터를 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("작물 데이터 로드 중 오류 발생:", error);
        setError("작물 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  // 작물 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const response = await axios.get("http://localhost:8000/api/crop-data");
      if (response.data.success) {
        const formattedCrops = response.data.data.map((crop) => ({
          id: crop.id,
          crop_name: crop.crop_name,
          region: crop.region,
          hourly_sales: crop.revenue_per_hour,
          sales_per_area: crop.revenue_per_3_3m,
        }));
        setCrops(formattedCrops);
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/crop-data/${encodeURIComponent(searchTerm)}`
      );
      if (response.data.success) {
        const formattedCrops = response.data.data.map((crop) => ({
          id: crop.id,
          crop_name: crop.crop_name,
          region: crop.region,
          hourly_sales: crop.revenue_per_hour,
          sales_per_area: crop.revenue_per_3_3m,
        }));
        setCrops(formattedCrops);
      } else {
        setError("작물 검색에 실패했습니다.");
      }
    } catch (error) {
      console.error("작물 검색 중 오류 발생:", error);
      setError("작물 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 작물 검색 필터링 (클라이언트 사이드)
  const filteredCrops = searchTerm
    ? crops.filter((crop) =>
        crop?.crop_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : crops;

  // 작물 추가 핸들러
  const handleAddCrop = (crop) => {
    if (
      !formData.selectedCrops.find(
        (selected) => selected.crop_name === crop.crop_name
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedCrops: [...prev.selectedCrops, crop],
      }));
    }
  };

  // 작물 제거 핸들러
  const handleRemoveCrop = (cropName) => {
    setFormData((prev) => ({
      ...prev,
      selectedCrops: prev.selectedCrops.filter(
        (crop) => crop.crop_name !== cropName
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {method === "income"
            ? "기대소득 대비 농업 목표 설정"
            : "재배면적 대비 농업 목표 설정"}
        </h2>
        <p className="text-gray-600">
          {method === "income"
            ? "기대소득에 맞는 재배면적과 경영비를 알아보세요"
            : "재배면적에 맞는 예상소득을 확인해보세요"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 작물 검색 및 선택 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
            희망재배 작물을 선택해주세요
          </h3>

          {/* 검색창 */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="원하는 작물명을 검색해주세요."
                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-3 bg-[#3a9d1f] text-white rounded-md hover:bg-[#2d7a17] transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "검색 중..." : "검색"}
              </button>
            </div>
          </div>

          {/* 검색 결과 테이블 */}
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      작물명
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      지역
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      시간당 매출
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      3.3m당 매출
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      항목추가
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        데이터를 불러오는 중...
                      </td>
                    </tr>
                  ) : filteredCrops.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredCrops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {crop.crop_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {crop.region || "전국"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {crop.hourly_sales
                            ? `${crop.hourly_sales.toLocaleString()}원`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {crop.sales_per_area
                            ? `${crop.sales_per_area.toLocaleString()}원`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleAddCrop(crop)}
                            className="px-4 py-1 text-sm text-white bg-[#ff6b3d] rounded hover:bg-[#e85d33] transition-colors duration-200"
                          >
                            추가하기
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 선택된 작물 목록 */}
          {formData.selectedCrops.length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-700 mb-3">
                선택된 작물
              </h4>
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      작물명
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                      지역
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      시간당 매출
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                      3.3m당 매출
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      삭제
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.selectedCrops.map((crop) => (
                    <tr key={crop.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {crop.crop_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {crop.region || "전국"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {crop.hourly_sales ? `${crop.hourly_sales}원` : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {crop.sales_per_area ? `${crop.sales_per_area}원` : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCrop(crop.crop_name)}
                          className="px-4 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600 transition-colors duration-200"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 경영 목표 설정 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
            경영 목표 설정
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {method === "income" ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    월 목표 소득 (원)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="targetIncome"
                      value={formData.targetIncome}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
                      placeholder="예: 50000000"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">
                      원
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    투자 금액 (원)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
                      placeholder="예: 10000000"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">
                      원
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    재배 면적 (㎡)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="cultivationArea"
                      value={formData.cultivationArea}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
                      placeholder="예: 1000"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">
                      ㎡
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    투자 금액 (원)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
                      placeholder="예: 10000000"
                      required
                    />
                    <span className="absolute right-3 top-3 text-gray-500">
                      원
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#3a9d1f] text-white rounded-md hover:bg-[#2d7a17] transition-colors duration-200 font-medium"
          >
            분석 시작하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgricultureGoalSetting;
