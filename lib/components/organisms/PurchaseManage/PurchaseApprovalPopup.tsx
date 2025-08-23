'use client';

import { setApiLoaderText } from "@config/axios";
import { useAppDispatch } from "@hooks/common";
import { useUserPointQuery } from "@hooks/queries/useUserQuery";
import type { Purchase } from '../../../types/purchase';
import { showToast } from "@redux/Features/Toast/toastSlice";
import { useEffect, useRef } from "react";

interface PurchaseApprovalPopupProps {
  item: Purchase;
  onConfirm: (adminNotes: string) => void;
  onCancel: () => void;
}

export default function PurchaseApprovalPopup({ item, onConfirm, onCancel }: PurchaseApprovalPopupProps) {
  const adminNotesRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  
  const { data: userPoint, error: userPointError, isLoading } = useUserPointQuery(item.user_id);

  // 포인트 로딩 상태에 따른 로더 텍스트 설정
  useEffect(() => {
    if (isLoading) {
      setApiLoaderText('포인트 정보를 가져오는 중입니다.');
    }
  }, [isLoading]);

  if (userPointError) {
    dispatch(showToast({
      title: "실패",
      content: "포인트 정보를 불러오는 중 오류가 발생했습니다.",
      headerTextColor: "text-red-500",
      remainTime: "방금",
    }));
  }
  
  const currentPoint = Number(userPoint || 0);
  const givePoint = Math.floor((item.deposit_amount || 0) * 0.5);
  const finalPoint = currentPoint + givePoint;

  // 결제방법 정보
  const paymentMethodInfo = {
    "agency": { name: "대행", colorClass: "text-blue-600", badgeClass: "bg-blue-100 text-blue-800" },
    "exchange_direct": { name: "거래소", colorClass: "text-purple-600", badgeClass: "bg-purple-100 text-purple-800" },
    "personal_wallet": { name: "개인", colorClass: "text-emerald-600", badgeClass: "bg-emerald-100 text-emerald-800" }
  } as const;

  const paymentInfo = paymentMethodInfo[item.payment_method as keyof typeof paymentMethodInfo] || { 
    name: '-', 
    colorClass: 'text-gray-500',
    badgeClass: 'bg-gray-100 text-gray-800'
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ko-KR', { 
        year: '2-digit', 
        month: '2-digit', 
        day: '2-digit' 
      }).replace(/\. /g, '.').replace(/\.$/, ''),
      time: date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };
  };

  const datetime = formatDate(item.created_at);

  const handleConfirm = () => {
    const adminNotes = adminNotesRef.current?.value || '';
    onConfirm(adminNotes);
  };

  return (
    <div className="font-nexon leading-relaxed">

      {/* 구매 정보 */}
      <div className="mb-5 space-y-3">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">사용자</span>
          <span className="font-bold text-sm text-slate-800">{item.users?.nickname || '알 수 없음'}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">신청일시</span>
          <span className="font-bold text-sm text-slate-800">{datetime.date} {datetime.time}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">코인</span>
          <span className="font-bold text-sm text-slate-800 uppercase">{item.coin_code}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">결제수단</span>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${paymentInfo.colorClass}`}>{paymentInfo.name}</span>
            {item.exchange_name && item.payment_method !== 'personal_wallet' && (
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                {item.exchange_name}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">결제금액</span>
          <span className="font-bold text-sm text-red-500">{item.deposit_amount?.toLocaleString()} 원</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <span className="text-slate-600 font-semibold text-sm">트랜잭션 ID</span>
          <span className="font-bold text-xs font-mono text-blue-600 break-all">{item.transaction_id}</span>
        </div>
      </div>

      {/* 포인트 변화 */}
      <div className="mb-5 p-4 bg-sky-50 rounded-lg border border-sky-200">
 
        
        <div className="space-y-2">
          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-600 font-semibold text-sm">현재 포인트</span>
            <span className="font-bold text-sm text-gray-600">{currentPoint.toLocaleString()} P</span>
          </div>
          
          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-600 font-semibold text-sm">지급포인트</span>
            <span className="font-bold text-sm text-emerald-600">+{givePoint.toLocaleString()} P</span>
          </div>
          
          <div className="h-px bg-sky-300 my-2"></div>
          
          <div className="flex justify-between items-center py-1.5">
            <span className="text-sky-700 font-bold text-sm">최종 포인트</span>
            <span className="font-bold text-base text-sky-700">{finalPoint.toLocaleString()} P</span>
          </div>
        </div>
      </div>

      {/* 관리자 메모 */}
      <div className="mt-4">
        <label className="block mb-2 text-slate-600 font-semibold text-sm">
          관리자 메모 (선택사항)
        </label>
        <textarea 
          ref={adminNotesRef}
          placeholder="승인과 관련된 메모를 입력하세요..."
          className="w-full min-h-20 p-3 border text-black border-gray-300 rounded-lg text-sm font-nexon resize-y 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder:text-gray-400"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 border-none rounded-lg text-sm font-semibold 
                     font-nexon cursor-pointer hover:bg-gray-200 transition-colors duration-200"
        >
          취소
        </button>
        <button
          onClick={handleConfirm}
          className="px-5 py-2.5 bg-emerald-600 text-white border-none rounded-lg text-sm font-semibold 
                     font-nexon cursor-pointer hover:bg-emerald-700 transition-colors duration-200"
        >
          승인
        </button>
      </div>
    </div>
  );
} 