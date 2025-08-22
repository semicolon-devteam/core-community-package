'use client';

import ClipboardButton from "@atoms/ClipboardButton";
import { usePurchaseCommand } from "@hooks/commands/usePurchaseCommand";
import { useGlobalLoader } from "@hooks/common/useGlobalLoader";
import { useGlobalPopup } from "@hooks/common/useGlobalPopup";
import { usePurchaseQuery } from "@hooks/queries/usePurchaseQuery";
import { Purchase } from "@model/purchase";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";
import { useEffect, useState } from "react";
import PurchaseApprovalPopup from "./PurchaseApprovalPopup";
import PurchaseRejectionPopup from "./PurchaseRejectionPopup";

export default function PurchaseManage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<'requested' | 'approved' | 'rejected' | 'all'>('requested');
  
  const { data: purchaseData, isLoading, refetch } = usePurchaseQuery({
    page: currentPage,
    limit: 20,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });

  const { processPurchase } = usePurchaseCommand();
  const { popup, closeAll } = useGlobalPopup();
  const { showLoader, hideLoader } = useGlobalLoader();

  // 로딩 상태가 변경될 때마다 글로벌 로더 표시/숨김
  useEffect(() => {
    if (isLoading) {
      showLoader('구매 요청 데이터를 불러오는 중입니다...');
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  const handleStatusChange = async (item: Purchase, newStatus: 'approve' | 'reject') => {
    if (newStatus === 'approve') {
      // 승인 팝업 표시
      popup({
        width: '400px',
        title: '포인트 구매 승인',
        content: (
          <PurchaseApprovalPopup
            item={item}
            onConfirm={async (adminNotes: string) => {
              await processPurchase({
                id: item.id,
                status: 'approve',
                admin_notes: adminNotes
              });
              closeAll();
              refetch(); // 데이터 새로고침
            }}
            onCancel={() => {
              closeAll();
            }}
          />
        ),
        showConfirm: false,
        showCancel: false,
      });
    } else {
      // 거절 팝업 표시
      popup({
        width: '400px',
        title: '포인트 구매 거절',
        content: (
          <PurchaseRejectionPopup
            item={item}
            onConfirm={async (rejectionReason: string, adminNotes: string) => {
              await processPurchase({
                id: item.id,
                status: 'reject',
                rejection_reason: rejectionReason,
                admin_notes: adminNotes
              });
              closeAll();
              refetch(); // 데이터 새로고침
            }}
            onCancel={() => {
              closeAll();
            }}
          />
        ),
        showConfirm: false,
        showCancel: false,
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // 타입 가드 함수
  const isValidPurchaseData = (data: any): data is { items: Purchase[]; pagination: { totalItems: number; currentPage: number; totalPages: number } } => {
    return data && typeof data === 'object' && Array.isArray(data.items) && data.pagination;
  };

  const safeData = isValidPurchaseData(purchaseData) ? purchaseData : { items: [], pagination: { totalItems: 0, currentPage: 1, totalPages: 1 } };
  const purchases = safeData.items;
  const totalPages = Math.ceil((safeData.pagination.totalItems || 0) / 20);

  return (
    <div className="w-full bg-white rounded-2xl shadow-custom border border-border-default overflow-hidden p-5 whitespace-nowrap">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">포인트 구매 관리</h1>
        
        {/* 상태 필터 */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: '전체' },
            { value: 'requested', label: '대기' },
            { value: 'approved', label: '승인' },
            { value: 'rejected', label: '거절' }
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* 요청 건 수 표시 및 새로고침 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          총 {(safeData.pagination.totalItems || 0).toLocaleString()}개의 요청
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`}
          >
            <path
              d="M13.65 2.35C12.18 0.88 10.21 0 8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
              fill="currentColor"
            />
          </svg>
          새로고침
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">번호</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">닉네임</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">코인</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">수단</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">트랜잭션 ID</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">금액</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">신청일시</th>
              <th className="p-1 py-2 text-center text-sm font-medium text-gray-700 border-b whitespace-nowrap">처리/상태</th>
            </tr>
          </thead>
          <tbody>
            {safeData?.items?.length ? (
              safeData.items.map((item: Purchase, index: number) => {
                const datetime = new Date(item.created_at);
                const formattedDate = datetime.toLocaleDateString('ko-KR', { 
                  year: '2-digit', 
                  month: '2-digit', 
                  day: '2-digit' 
                }).replace(/\. /g, '.').replace(/\.$/, '');
                const formattedTime = datetime.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                });
                // 역순 번호 계산 (최신이 1번부터 시작)
                const rowNumber = (safeData.pagination?.totalItems || 0) - (((safeData.pagination?.currentPage || currentPage) - 1) * 20 + index);
                
                // 결제수단 아이콘 컴포넌트들
                const AgencyIcon = ({ className }: { className?: string }) => (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M3 18H17V8L10 2L3 8V18Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 18V13H13V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 9H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                );

                const ExchangeIcon = ({ className }: { className?: string }) => (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M3 17V7L6 4L9 7L13 3L17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 17H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="6" cy="4" r="1" fill="currentColor"/>
                    <circle cx="9" cy="7" r="1" fill="currentColor"/>
                    <circle cx="13" cy="3" r="1" fill="currentColor"/>
                    <circle cx="17" cy="7" r="1" fill="currentColor"/>
                  </svg>
                );

                const WalletIcon = ({ className }: { className?: string }) => (
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <path d="M17 7H16V5C16 3.895 15.105 3 14 3H4C2.895 3 2 3.895 2 5V15C2 16.105 2.895 17 4 17H14C15.105 17 16 16.105 16 15V13H17C17.552 13 18 12.552 18 12V8C18 7.448 17.552 7 17 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="14" cy="10" r="1" fill="currentColor"/>
                  </svg>
                );

                // 결제방법 정보
                const paymentMethodInfo = {
                  "agency": {
                    name: "대행",
                    color: "text-blue-600"
                  },
                  "exchange_direct": {
                    name: "거래소", 
                    color: "text-purple-600"
                  },
                  "personal_wallet": {
                    name: "개인",
                    color: "text-green-600"
                  }
                } as const;

                const getPaymentIcon = () => {
                  const paymentInfo = paymentMethodInfo[item.payment_method as keyof typeof paymentMethodInfo];
                  
                  switch (item.payment_method) {
                    case 'agency':
                      return <AgencyIcon className={paymentInfo.color} />;
                    case 'exchange_direct':
                      return <ExchangeIcon className={paymentInfo.color} />;
                    case 'personal_wallet':
                      return <WalletIcon className={paymentInfo.color} />;
                    default:
                      return null;
                  }
                };

                const paymentInfo = paymentMethodInfo[item.payment_method as keyof typeof paymentMethodInfo] || { name: '-', color: 'text-gray-400' };
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-1 text-sm text-center text-gray-900 border-b whitespace-nowrap">{rowNumber}</td>
                    <td className="p-1 text-sm text-gray-900 border-b whitespace-nowrap">{item.users?.nickname || '-'}</td>
                    <td className="p-1 border-b whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Image src={normalizeImageSrc(`/icons/coin/${item.coin_code}.svg`)} alt={item.coin_code} width={24} height={24} className="w-6 h-6" />
                      </div>
                    </td>
                    <td className="p-1 border-b">
                      <div className="flex flex-col items-center gap-0.5 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {getPaymentIcon()}
                          <span className="text-sm text-gray-600">
                            {paymentInfo.name}
                          </span>
                        </div>
                        {item.exchange_name && item.payment_method !== 'personal_wallet' && (
                          <div className="text-xs font-semibold text-white bg-primary rounded-lg px-1 py-0.5">
                            {item.exchange_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border-b whitespace-nowrap ">
                      <div className="max-w-48 flex justify-center">
                        {item.transaction_id ? (
                          <div className="flex items-center gap-1">
                            <code className="text-xs font-mono text-blue-600 break-all">
                              {item.transaction_id.substring(0, 10)}
                              {item.transaction_id.length > 10 && '...'}
                            </code>
                            <ClipboardButton text={item.transaction_id} />
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-1 text-right border-b whitespace-nowrap">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                          <span>{item.deposit_amount?.toLocaleString() || '0'} 원</span>
                          <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            className="text-gray-400"
                          >
                            <path 
                              d="M16 3L21 8L16 13M8 21L3 16L8 11M21 8H3M3 16H21" 
                              stroke="currentColor" 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="text-orange-500 font-bold text-sm">
                          {Math.floor((item.deposit_amount || 0) * 0.5).toLocaleString()} P
                        </div>
                      </div>
                    </td>
                    <td className="p-1 text-center border-b whitespace-nowrap">
                      <div className="text-sm">
                        <div>{formattedDate}</div>
                        <div className="text-gray-500">{formattedTime}</div>
                      </div>
                    </td>
                    <td className="p-1 text-center border-b whitespace-nowrap">
                      {item.status === 'requested' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusChange(item, 'approve')}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusChange(item, 'reject')}
                            className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                          >
                            거절
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center"> 
                          <span className={`text-sm font-medium ${
                            item.status === 'approved' ? 'text-green-500' :
                            item.status === 'rejected' ? 'text-red-500' :
                            item.status === 'cancelled' ? 'text-red-500' :
                            'text-orange-500'
                          }`}>
                            { item.status === 'approved' ? '승인' :
                              item.status === 'rejected' ? '거절' :
                              item.status === 'cancelled' ? '거절' :
                              '결제대기'
                            }
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.processed_at ? new Date(item.processed_at).toLocaleString('ko-KR', {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            }) : '-'}
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 whitespace-nowrap">
                  구매 요청 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
