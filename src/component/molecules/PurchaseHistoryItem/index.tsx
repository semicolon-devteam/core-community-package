import ClipboardButton from "@atoms/ClipboardButton";
import type { Purchase } from "@model/purchase";
import { timeAgo } from "@util/dateUtil";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

// 상태별 색상 및 스타일
const statusStyles = {
  "requested": {
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-l-yellow-200",
    badge: "bg-yellow-100 text-yellow-800"
  },
  "approved": {
    bgColor: "bg-green-50",
    textColor: "text-green-700", 
    borderColor: "border-l-green-200",
    badge: "bg-green-100 text-green-800"
  },
  "cancelled": {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-l-red-200", 
    badge: "bg-red-100 text-red-800"
  },
  "rejected": {
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-l-red-200",
    badge: "bg-red-100 text-red-800"
  },
  "refunded": {
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-l-gray-200",
    badge: "bg-gray-100 text-gray-800"
  }
} as const;

const statusDisplayName = {
  "requested": "대기",
  "approved": "승인",
  "cancelled": "주문취소",
  "rejected": "거절",
  "refunded": "환불"
} as const;

// 결제방법 정보
const paymentMethodInfo = {
  "agency": {
    name: "대행업체",
    color: "text-blue-600"
  },
  "exchange_direct": {
    name: "거래소 직접송금",
    color: "text-purple-600"
  },
  "personal_wallet": {
    name: "개인지갑",
    color: "text-green-600"
  }
} as const;

// 결제방법 아이콘 컴포넌트들
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

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11.9998 7.11109C11.9998 6.89776 11.9998 6.79198 12.0709 6.72621C12.1438 6.66043 12.2434 6.66843 12.4443 6.68532C13.3397 6.76011 14.2017 7.05992 14.9503 7.55693C15.6989 8.05394 16.3098 8.73202 16.7263 9.52824C17.1427 10.3245 17.3513 11.213 17.3326 12.1113C17.3138 13.0097 17.0684 13.8888 16.6191 14.6669C16.1698 15.4451 15.5312 16.0971 14.7625 16.5625C13.9939 17.0279 13.1201 17.2915 12.2223 17.3289C11.3245 17.3663 10.4319 17.1762 9.62717 16.7764C8.82247 16.3765 8.13184 15.7799 7.61939 15.0418C7.50384 14.8764 7.44695 14.7938 7.46828 14.6987C7.48962 14.6035 7.58206 14.5511 7.76606 14.4444L11.7776 12.128C11.8861 12.0658 11.9403 12.0347 11.9696 11.9831C11.9998 11.9315 11.9998 11.8684 11.9998 11.7431V7.11109Z" fill="currentColor"/>
    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

interface PurchaseHistoryItemProps {
  item: Purchase;
}

export default function PurchaseHistoryItem({ item }: PurchaseHistoryItemProps) {
  const statusStyle = statusStyles[item.status as keyof typeof statusStyles] || statusStyles.requested;
  const paymentInfo = paymentMethodInfo[item.payment_method as keyof typeof paymentMethodInfo];


  const getPaymentIcon = () => {
    switch (item.payment_method) {
      case 'agency':
        return <AgencyIcon className={paymentInfo.color} />;
      case 'exchange_direct':
        return <ExchangeIcon className={paymentInfo.color} />;
      case 'personal_wallet':
        return <WalletIcon className={paymentInfo.color} />;
      default:
        return <AgencyIcon className={paymentInfo.color} />;
    }
  };
  console.log(item);
  return (
    <div
      className={`${statusStyle.bgColor} ${statusStyle.borderColor} border-l-4 border border-gray-200 rounded-xl p-6 mb-4 shadow-sm transition-all duration-200 hover:shadow-md`}
    >
      {/* 첫 번째 row: 코인 코드, 상태 vs 일시 */}
      <div className="flex flex-col sm:flex-row gap-4 md:items-center items-start justify-between mb-4">
        {/* 좌측: 코인 코드와 상태 */}
        <div className="flex items-center gap-3">
          <Image src={normalizeImageSrc(`/icons/coin/${item.coin_code}.svg`)} alt={item.coin_code} width={24} height={24} className="w-6 h-6" />
          <div className="font-bold text-lg text-gray-800">
            {item.coin_code}
          </div>
          <span className={`flex px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}>
            {statusDisplayName[item.status as keyof typeof statusDisplayName] || item.status}
            {item.status === 'approved' && (
              <div className="flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9998 7.11109C11.9998 6.89776 11.9998 6.79198 12.0709 6.72621C12.1438 6.66043 12.2434 6.66843 12.4443 6.68532C13.3397 6.76011 14.2017 7.05992 14.9503 7.55693C15.6989 8.05394 16.3098 8.73202 16.7263 9.52824C17.1427 10.3245 17.3513 11.213 17.3326 12.1113C17.3138 13.0097 17.0684 13.8888 16.6191 14.6669C16.1698 15.4451 15.5312 16.0971 14.7625 16.5625C13.9939 17.0279 13.1201 17.2915 12.2223 17.3289C11.3245 17.3663 10.4319 17.1762 9.62717 16.7764C8.82247 16.3765 8.13184 15.7799 7.61939 15.0418C7.50384 14.8764 7.44695 14.7938 7.46828 14.6987C7.48962 14.6035 7.58206 14.5511 7.76606 14.4444L11.7776 12.128C11.8861 12.0658 11.9403 12.0347 11.9696 11.9831C11.9998 11.9315 11.9998 11.8684 11.9998 11.7431V7.11109Z" fill="currentColor"></path><path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2"></path></svg>
                <span className="">({timeAgo(item.processed_at, false)})</span>
              </div>
            )}
            {item.status === 'rejected' && (
              <div className="flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9998 7.11109C11.9998 6.89776 11.9998 6.79198 12.0709 6.72621C12.1438 6.66043 12.2434 6.66843 12.4443 6.68532C13.3397 6.76011 14.2017 7.05992 14.9503 7.55693C15.6989 8.05394 16.3098 8.73202 16.7263 9.52824C17.1427 10.3245 17.3513 11.213 17.3326 12.1113C17.3138 13.0097 17.0684 13.8888 16.6191 14.6669C16.1698 15.4451 15.5312 16.0971 14.7625 16.5625C13.9939 17.0279 13.1201 17.2915 12.2223 17.3289C11.3245 17.3663 10.4319 17.1762 9.62717 16.7764C8.82247 16.3765 8.13184 15.7799 7.61939 15.0418C7.50384 14.8764 7.44695 14.7938 7.46828 14.6987C7.48962 14.6035 7.58206 14.5511 7.76606 14.4444L11.7776 12.128C11.8861 12.0658 11.9403 12.0347 11.9696 11.9831C11.9998 11.9315 11.9998 11.8684 11.9998 11.7431V7.11109Z" fill="currentColor"></path><path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" stroke="currentColor" strokeWidth="2"></path></svg>
                <span className="">({timeAgo(item.processed_at, false)})</span>
              </div>
            )}
          </span>
        </div>
        
        {/* 우측: 일시 */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <CalendarIcon />
            <span>{timeAgo(item.created_at, false)}</span>
          </div>
        </div>
      </div>

      {/* 두 번째 row: 2column 구조 */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">

      

        {/* 좌측 컬럼: 결제방법, 트랜잭션 정보 */}
        <div className="flex-1 space-y-2 flex flex-col gap-2 items-start">

          

          {/* 거절 사유 */}
          {item.status === 'rejected' && (
            <div className="bg-red-100 p-2 rounded-lg flex items-center gap-1 text-xs font-semibold ">
              <span className="text-xs text-red-800">거절 사유:</span>
              <span className="text-xs text-red-800">{item.rejection_reason}</span>
            </div>
          )}



          {/* 거래소 정보 (개인지갑 이체가 아닌 경우만) */}
          {item.payment_method !== 'personal_wallet' && item.exchange_name && (
            <div className="flex items-center gap-2">
              {getPaymentIcon()}
              <span className="text-sm text-gray-500">{item.payment_method === 'agency' ? '대행업체' : '거래소'}</span>
              <span className="text-sm text-gray-600">{item.exchange_name}</span>
            </div>
          )}

          {/* 트랜잭션 ID */}
          {item.transaction_id && (
            <div className="flex items-start gap-2">
              <span className="text-sm text-gray-500">트랜잭션 ID:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono break-all">
                  {item.transaction_id}
                </code>
                <ClipboardButton
                  text={item.transaction_id}
                  className="p-1"
                  successMessage="트랜잭션 ID가 복사되었습니다."
                />
              </div>
            </div>
          )}
        </div>
        
        {/* 우측 컬럼: 포인트 정보 */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-gray-400 text-base mb-1">
            <span>{item.deposit_amount.toLocaleString()} 원</span>
            <svg 
              width="16" 
              height="16" 
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
          <div className="text-[#ff7a00] font-bold text-2xl">
            {Math.floor(item.deposit_amount * 0.5).toLocaleString()} P
          </div>
        </div>
      </div>
    </div>
  );
} 