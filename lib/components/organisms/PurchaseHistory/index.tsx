"use client";

import LinkWithLoader from "@common/LinkWithLoader";
import { usePurchaseQuery } from "@hooks/queries/usePurchaseQuery";

import type { Purchase, PurchaseListResponse } from "@model/purchase";
import Board from "@molecules/Board";
import PurchaseHistoryItem from "@molecules/PurchaseHistoryItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 10;

const statusMapping = {
  "전체": undefined,
  "결제대기": "requested",
  "결제완료": "approved", 
  "주문취소": "cancelled"
} as const;

// 타입 가드 함수
const isPurchaseListResponse = (data: unknown): data is PurchaseListResponse => {
  return typeof data === 'object' && data !== null && 'items' in data && 'pagination' in data;
};

export default function PurchaseHistory() {

  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [periodType, setPeriodType] = useState("전체기간");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // API 파라미터 계산
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: PAGE_SIZE,
    status: statusMapping[selectedTab as keyof typeof statusMapping]
  }), [currentPage, selectedTab]);

  // API 호출
  const { data, isLoading, error, refetch } = usePurchaseQuery(queryParams);

  const handlePeriodTypeChange = (value: string) => {
    setPeriodType(value);
    if (value === "전체기간") {
      setStartDate("");
      setEndDate("");
    }
  };

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh) {
      refetch();
    }
  }, [searchParams, refetch]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
  };

  // 안전한 데이터 접근을 위한 처리
  const safeData = isPurchaseListResponse(data) ? data : null;

  // 날짜 필터링 (클라이언트 사이드)
  const filteredData = useMemo(() => {
    if (!safeData || !safeData.items) return [];
    
    let filtered = safeData.items;
    
    // 날짜 필터링
    if (periodType === "직접선택" && startDate && endDate) {
      filtered = filtered.filter((item: Purchase) => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    return filtered;
  }, [safeData, periodType, startDate, endDate]);

  if (error) {
    return (
      <div className="bg-[#fafbfc] min-h-screen p-8">
        <div className="text-center text-red-500">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // 안전한 data 접근을 위한 타입 가드

  return (
    <div className="bg-[#fafbfc] min-h-screen py-4">
      {/* 1번째 줄: 기간설정/날짜 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 pb-4 border-b-2 border-primary gap-2 sm:gap-0">
        {/* 기간설정 드롭다운 */}
        <div className="flex-1">
          <div className="relative flex items-center w-full sm:w-48">
            <select
              value={periodType}
              onChange={e => handlePeriodTypeChange(e.target.value)}
              className="w-full h-12 px-5 py-2 bg-white rounded-lg border border-border-default text-gray-700 text-base font-medium leading-normal appearance-none cursor-pointer"
            >
              <option value="전체기간">전체기간</option>
              <option value="직접선택">직접선택</option>
            </select>
            <img
              className="absolute right-3 w-6 h-6"
              src="/icons/dropdown-arrow.svg"
              alt="드롭다운"
            />
          </div>
        </div>
        {/* 날짜 입력 그룹 */}
        <div className="w-full sm:flex-1">
          <div className="flex items-stretch gap-2 sm:gap-4 sm:ml-4 flex-1">
            {/* 시작 날짜 */}
            <div className="relative flex items-center bg-white rounded-lg shadow px-6 h-12 flex-1 min-w-0 sm:w-full">
              <input
                type="date"
                className="appearance-none bg-transparent border-none outline-none text-gray-700 text-base w-full h-full placeholder:text-gray-400"
                placeholder="시작일"
                disabled={periodType === "전체기간"}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="text-gray-400 self-center">~</span>
            {/* 종료 날짜 */}
            <div className="relative flex items-center bg-white rounded-lg shadow px-6 h-12 flex-1 min-w-0 sm:w-full">
              <input
                type="date"
                className="appearance-none bg-transparent border-none outline-none text-gray-700 text-base w-full h-full placeholder:text-gray-400"
                placeholder="종료일"
                disabled={periodType === "전체기간"}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 2번째 줄: 탭 + 전체 페이지 + 새로고침 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-0">
        <div className="flex">
          {["전체", "결제대기", "결제완료", "주문취소"].map(tab => (
            <div
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 cursor-pointer ${
                selectedTab === tab
                  ? "border-b-2 border-primary text-primary font-bold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex flex-row items-center ml-auto">
          <span className="text-sm text-gray-500">
            전체 {safeData?.pagination?.currentPage || 1} / {safeData?.pagination?.totalPages || 1} 페이지
          </span>
          <button 
            className="ml-2" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            ⟳
          </button>
        </div>
      </div>
      
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      )}
      
      {/* 리스트 */}
      <div>
        {filteredData.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">구매 내역이 없습니다.</div>
          </div>
        ) : (
          filteredData.map((item: Purchase) => (
            <PurchaseHistoryItem key={item.id} item={item} />
          ))
        )}
      </div>
      
      {/* 페이지네이션 */}
      {safeData && safeData.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center my-8">
          <Board.Pagination
            currentPage={safeData.pagination.currentPage}
            totalPages={safeData.pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      
      {/* 구매하기 버튼 */}
      <div className="flex justify-end">
        <LinkWithLoader
          href="/me/point/purchase"
          className="bg-[#ff7a00] text-white border-none rounded-lg px-8 py-3 font-bold text-base cursor-pointer hover:bg-opacity-90 transition-all duration-200"
          message="포인트 구매 페이지로 이동합니다."
        >
          구매하기
        </LinkWithLoader>
      </div>
    </div>
  );
}