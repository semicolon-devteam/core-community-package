'use client';

import { Skeleton } from "@atoms/Skeleton";
import { useAuth } from "@hooks/User/useAuth";
import { useAuthGuard } from "@hooks/common/useAuthGuard";
import { usePointHistoryQuery } from "@hooks/queries/usePointQuery";
import type { PointTransaction } from '../../../types/point';
import Pagination from "@molecules/Board/Pagination";
import AuthErrorHandler from "@organisms/AuthErrorHandler";
import { useState } from "react";

interface PointHistoryContainerProps {
  initialPoint?: number;
  initialPointHistory?: {
    items: PointTransaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  } | null;
  userId: string;
}

function PointHistoryItem({ transaction }: { transaction: PointTransaction }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'EARN': return '획득';
      case 'USE': return '사용';
      case 'REFUND': return '환불';
      case 'EXPIRE': return '만료';
      case 'REVOKE': return '회수';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EARN': 
      case 'REFUND': 
        return 'text-green-600 bg-green-50';
      case 'USE':
      case 'EXPIRE':
      case 'REVOKE':
        return 'text-red-600 bg-red-50';
      default: 
        return 'text-gray-600 bg-gray-50';
    }
  };

  const isPositive = ['EARN', 'REFUND'].includes(transaction.transaction_type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.transaction_type)}`}>
              {getTypeLabel(transaction.transaction_type)}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(transaction.created_at)}
            </span>
          </div>
          <div className="border-t border-gray-100 ">
            <p className="text-gray-700 text-sm">
              {transaction.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{transaction.amount.toLocaleString()}P
          </div>
          <div className="text-sm text-gray-500">
            잔액: {transaction.balance_after.toLocaleString()}P
          </div>
        </div>
      </div>
      

    </div>
  );
}

// 스켈레톤 아이템 컴포넌트
function PointHistorySkeleton() {
  return (
    <div className="space-y-4">
      {/* 5개의 스켈레톤 아이템 표시 */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-32 h-5" />
            </div>
            <div className="text-right">
              <Skeleton className="w-20 h-6 ml-auto mb-1" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-3">
            <Skeleton className="w-full h-4 mb-2" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PointHistoryContainer({ 
  initialPoint, 
  initialPointHistory, 
  userId 
}: PointHistoryContainerProps) {
  // 인증 상태 및 사용자 정보 확인
  const { user } = useAuth();
  const { hasPermission, errorType, isLoading: authLoading } = useAuthGuard({
    requiredLevel: 0, // 로그인한 모든 사용자 접근 가능
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const pageSize = 10;

  // React Query로 포인트 히스토리 조회
  const {
    data: pointHistoryData,
    error: queryError,
    isLoading: isQueryLoading,
  } = usePointHistoryQuery({
    userId,
    page: currentPage,
    pageSize,
    enabled: hasPermission && !authLoading,
    initialData: initialPointHistory,
  });

  // 초기 데이터가 있으면 React Query에 initialData로 설정
  const histories = pointHistoryData?.items || initialPointHistory?.items || [];
  const totalPages = pointHistoryData?.totalPages || initialPointHistory?.totalPages || 0;
  const totalCount = pointHistoryData?.totalCount || initialPointHistory?.totalCount || 0;

  // 페이지 변경 시 스켈레톤 로더 표시 로직
  const handlePageChange = async (page: number) => {
    if (page !== currentPage) {
      setIsPaginating(true);
      
      // 페이지 변경 전에 잠시 대기하여 스켈레톤이 보이도록 함
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setCurrentPage(page);
      
      // 스크롤을 위로
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // React Query가 새 데이터를 가져온 후 스켈레톤 숨김
      setTimeout(() => {
        setIsPaginating(false);
      }, 300);
    }
  };


  // 인증 에러 처리 (공통 AuthErrorHandler 사용)
  if (errorType) {
    return <AuthErrorHandler errorType={errorType} redirectTo="/" />;
  }

  // React Query 에러 상태
  if (queryError) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-lg mb-4">⚠️</div>
        <p className="text-gray-600">
          {queryError instanceof Error ? queryError.message : "포인트 내역을 불러오는 중 오류가 발생했습니다."}
        </p>
      </div>
    );
  }

  // 초기 로딩 중이거나 인증 체크 중인 경우 아무것도 표시하지 않음 (글로벌 로더가 표시됨)
  if (authLoading || (isQueryLoading && currentPage === 1 && !initialPointHistory)) {
    return null;
  }

  // 권한이 없는 경우 (이미 AuthErrorHandler에서 처리되지만 추가 안전장치)
  if (!hasPermission || !user) {
    return null;
  }

  const currentPoint = user?.point || initialPoint || 0;

  return (
    <>
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">포인트 내역</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            포인트 획득 및 사용 내역을 확인할 수 있습니다.
          </p>
          <div className="text-right">
            <p className="text-sm text-gray-500">현재 보유 포인트</p>
            <p className="text-xl font-bold text-primary">
              {currentPoint.toLocaleString()}P
            </p>
          </div>
        </div>
      </div>

      {/* 포인트 히스토리 목록 */}
      <div className="space-y-4">
        {isPaginating ? (
          <PointHistorySkeleton />
        ) : histories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg mb-4">💰</div>
            <p className="text-gray-600 mb-4">포인트 내역이 없습니다.</p>
            <p className="text-sm text-gray-500">
              활동을 통해 포인트를 획득해보세요!
            </p>
          </div>
        ) : (
          <>
            {histories.map((transaction) => (
              <PointHistoryItem 
                key={transaction.id} 
                transaction={transaction} 
              />
            ))}
          </>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 총 개수 표시 */}
      {histories.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          총 {totalCount}개의 포인트 내역
        </div>
      )}
    </>
  );
}