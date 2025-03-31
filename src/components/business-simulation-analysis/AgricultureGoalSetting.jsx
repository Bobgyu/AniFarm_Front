import React, { useState, useEffect } from "react";
import axios from "axios";

const AgricultureGoalSetting = ({ onComplete, method }) => {
  const [formData, setFormData] = useState({
    cultivationArea: "",
    selectedCrops: [],
  });

  const [areaUnit, setAreaUnit] = useState("pyeong"); // pyeong 또는 m2
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
          setCrops(response.data.data);
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
        setCrops(response.data.data);
      }
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/crop-data/${encodeURIComponent(searchTerm)}`
      );
      if (response.data.success) {
        setCrops([response.data.data]);
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

  const handleQuickAdd = (field, amount) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? Number(prev[field]) + amount : amount,
    }));
  };

  const handleAreaUnitChange = (unit) => {
    setAreaUnit(unit);
    if (formData.cultivationArea) {
      const currentValue = Number(formData.cultivationArea);
      if (unit === "m2") {
        // 평에서 m²로 변환 (1평 = 3.3058m²)
        setFormData((prev) => ({
          ...prev,
          cultivationArea: (currentValue * 3.3058).toFixed(2),
        }));
      } else {
        // m²에서 평으로 변환
        setFormData((prev) => ({
          ...prev,
          cultivationArea: (currentValue / 3.3058).toFixed(2),
        }));
      }
    }
  };

  if (error) {
    return <div className="text-red-600 text-center p-4">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          재배면적 대비 농업 목표 설정
        </h2>
        <p className="text-gray-600">재배면적에 맞는 예상소득을 확인해보세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 재배면적 입력 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-6 bg-[#3a9d1f] rounded mr-2"></span>
            재배면적을 입력해주세요
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  name="cultivationArea"
                  value={formData.cultivationArea}
                  onChange={handleChange}
                  placeholder="재배면적을 입력해주세요"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3a9d1f] focus:border-[#3a9d1f]"
                  min="0"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAreaUnitChange("pyeong")}
                  className={`px-4 py-2 rounded-md ${
                    areaUnit === "pyeong"
                      ? "bg-[#3a9d1f] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  평
                </button>
                <button
                  type="button"
                  onClick={() => handleAreaUnitChange("m2")}
                  className={`px-4 py-2 rounded-md ${
                    areaUnit === "m2"
                      ? "bg-[#3a9d1f] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  m²
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[100, 200, 300, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickAdd("cultivationArea", amount)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200"
                >
                  +{amount}
                  {areaUnit === "pyeong" ? "평" : "m²"}
                </button>
              ))}
            </div>
          </div>
        </div>

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
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      작물명
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      시간당 매출
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      3.3m²당 매출
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                      연간 매출
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
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {crop.revenue_per_hour
                            ? `${crop.revenue_per_hour.toLocaleString()}원`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {crop.revenue_per_3_3m
                            ? `${crop.revenue_per_3_3m.toLocaleString()}원`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">
                          {crop.annual_sales
                            ? `${crop.annual_sales.toLocaleString()}원`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleAddCrop(crop)}
                            className="px-3 py-1 bg-[#3a9d1f] text-white text-sm rounded hover:bg-[#2d7a17] transition-colors duration-200"
                          >
                            추가
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
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-2">선택된 작물</h4>
              <div className="flex flex-wrap gap-2">
                {formData.selectedCrops.map((crop) => (
                  <div
                    key={crop.crop_name}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
                  >
                    <span>{crop.crop_name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCrop(crop.crop_name)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 분석 시작 버튼 */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-[#3a9d1f] text-white rounded-md hover:bg-[#2d7a17] transition-colors duration-200"
            disabled={
              !formData.cultivationArea || formData.selectedCrops.length === 0
            }
          >
            분석 시작하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgricultureGoalSetting;
