'use client';

import type { Purchase } from '../../../types/purchase';
import { useRef } from "react";

interface PurchaseRejectionPopupProps {
  item: Purchase;
  onConfirm: (rejectionReason: string, adminNotes: string) => void;
  onCancel: () => void;
}

export default function PurchaseRejectionPopup({ item, onConfirm, onCancel }: PurchaseRejectionPopupProps) {
  const rejectionReasonRef = useRef<HTMLTextAreaElement>(null);
  const adminNotesRef = useRef<HTMLTextAreaElement>(null);

  // 결제방법 정보
  const paymentMethodInfo = {
    "agency": { name: "대행", colorClass: "text-blue-600" },
    "exchange_direct": { name: "거래소", colorClass: "text-purple-600" },
    "personal_wallet": { name: "개인", colorClass: "text-emerald-600" }
  } as const;

  const paymentInfo = paymentMethodInfo[item.payment_method as keyof typeof paymentMethodInfo] || { 
    name: '-', 
    colorClass: 'text-gray-500'
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
    const rejectionReason = rejectionReasonRef.current?.value || '';
    const adminNotes = adminNotesRef.current?.value || '';
    onConfirm(rejectionReason, adminNotes);
  };

  return (
    <div className="font-nexon leading-relaxed">
      {/* 헤더 */}
      

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

      

      {/* 거절 사유 입력 */}
      <div className="mt-4">
        <label className="block mb-2 text-slate-600 font-semibold text-sm">
          거절 사유 <span className="text-red-500">*</span>
        </label>
        <textarea 
          ref={rejectionReasonRef}
          placeholder="사용자에게 전달할 거절 사유를 입력해주세요."
          className="w-full min-h-24 p-3 border border-gray-300 rounded-lg text-sm font-nexon resize-y 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                     placeholder:text-gray-400"
          required
        />
        
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
          className="px-5 py-2.5 bg-red-600 text-white border-none rounded-lg text-sm font-semibold 
                     font-nexon cursor-pointer hover:bg-red-700 transition-colors duration-200"
        >
          거절
        </button>
      </div>
    </div>
  );
} 