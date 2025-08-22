'use client';

import ClipboardButton from '@atoms/ClipboardButton';
import Collapse from '@atoms/Collapse';
import CustomSelect from '@atoms/CustomSelect';
import RadioButton from '@atoms/RadioButton/RadioButton';
import LinkWithLoader from '@common/LinkWithLoader';
import { usePurchaseCommand } from '@hooks/commands/usePurchaseCommand';
import { useAppDispatch, useGlobalPopup, useRouterWithLoader } from '@hooks/common';
import { useDeviceType } from '@hooks/common/useDeviceType';
import { useCoinQuery } from '@hooks/queries/useCoinQuery';
import { PurchaseRequest } from '@model/purchase';
import { showToast } from '@redux/Features/Toast/toastSlice';
import { normalizeImageSrc } from '@util/imageUtil';
import { useEffect, useState } from 'react';

interface PurchaseOption {
  id: string; 
  title: string;
  description: string;
  link: string;
  introductionImage?: string;
}

const paymentMethods: { id: "agency" | "exchange_direct" | "personal_wallet", name: string }[] = [
  {
    id: 'agency',
    name: '대행업체 이용',
  },
  {
    id: 'exchange_direct',
    name: '거래소 직접 송금',
  },
  {
    id: 'personal_wallet',
    name: '개인지갑 전송',
  }
];


const agencyList: PurchaseOption[] = [
  {
    id: '1',
    title: '1번 업체 바로가기',
    description: '※ 업무 처리속도 빠름 / 해외 IP 접속불가.',
    link: 'https://www.google.com',

  },
  {
    id: '2',
    title: '2번 업체 바로가기',
    description: '※ 업무 처리속도 보통 / 해외 IP 접속불가.',
    link: 'https://www.google.com',
  },
  {
    id: '3',
    title: '3번 업체 바로가기',
    description: '※ 24시간 / 오픈카톡 간편신청.',
    link: 'https://www.google.com', 
  },
];

export default function PointPurchase() {
  const { data: coins } = useCoinQuery();
  const { requestPurchase } = usePurchaseCommand();
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceType();
  const { alert } = useGlobalPopup();

  const router = useRouterWithLoader();
  const [selectedPurchase, setSelectedPurchase] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('agency');
  const [purchaseAmount, setPurchaseAmount] = useState<number>(25000);
  const [exchangeName, setExchangeName] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<any>(null);


  // selectedCoin과 selectedPurchase 동기화
  useEffect(() => {
    if (selectedCoin) {
      setSelectedPurchase(selectedCoin.coin_code);
    }
  }, [selectedCoin]);
  

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleCancel = () => {
    // 취소 로직
  };

  const handlePurchase = async () => {
    // 트랜잭션 ID 검증
    

    // 구매 로직
    const purchaseData: PurchaseRequest = {
      coin_id: coins?.find(item => item.coin_code === selectedPurchase)?.coin_code || '',
      purchase_amount: purchaseAmount,
      payment_method: selectedPaymentMethod as "agency" | "exchange_direct" | "personal_wallet",
      exchange_name: exchangeName,
      transaction_id: transactionId,
      wallet_address: coins?.find(item => item.coin_code === selectedPurchase)?.metadata.wallet_address || '',
    };
    const response = await requestPurchase(purchaseData);
    if (response.successOrNot === 'Y') {
      dispatch(showToast({
        title: '결제 요청이 완료되었습니다.',
        content: '결제 요청이 완료되었습니다. 관리자 승인 후 포인트가 지급됩니다.',
        headerTextColor: 'text-green-500',
      }));
      router.push('/me/point/purchase/history?refresh=true');
    } else {
      dispatch(showToast({
        title: '결제 요청에 실패했습니다.',
        content: response.message || '결제 요청 중 오류가 발생했습니다.',
        headerTextColor: 'text-red-500',
      }));
    }
  };


  return (
    <div className="w-full bg-white rounded-2xl shadow-custom border border-border-default overflow-hidden p-5">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary font-nexon">
            포인트 구매
          </h1>
          <LinkWithLoader href="/me/point/purchase/history" className="px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-lg text-sm font-nexon">
            구매 내역 보기
          </LinkWithLoader>
          
        </div>

        {/* 알림 메시지 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="text-primary">📢</div>
            <p className="text-primary text-sm font-bold font-nexon text-wrap">
              가상화폐를 결제 금액만큼 시세에 맞게 지갑 주소로 전송한 후 트랜잭션ID를 입력하세요.
            </p>
          </div>
        </div>

        {/* 포인트 충전 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <h3 className="text-text-primary font-medium font-nexon">포인트 충전 안내</h3>
          </div>
          <div className="text-text-secondary text-sm font-semibold font-nexon space-y-1">
            <p>최소 <span className="text-blue-500 font-medium">25,000</span>원 부터 충전 가능합니다.</p>
            <p>업금 금액의 <span className="text-blue-500 font-medium">50%</span> 포인트로 지급됩니다.</p>
            <p className="text-blue-500">(25,000원 = 12,500P)</p>
          </div>
          <div className="mt-3 text-red-500 text-sm font-nexon text-wrap">
            ※ 쪽지 발송, 자료 다운로드, 유료 게시물 열람, 포인트 선물, 경험치 구매에 사용 가능.
          </div>
        </div>

        {/* 결제 방법 선택 */}
        <Collapse title="현금 결제 방법 알아보기" defaultExpanded={false} className="mb-6">
          <div className="space-y-4">
            <p className="text-text-secondary text-sm font-nexon mb-4 text-wrap">
              가상화폐로 직접 결제가 어려운 분들은 구매대행 업체를 이용하여 결제할 수 있습니다. <br/>
              구매대행 이용 시 업체 수수료가 발생하며 이는 구매자(회원) 부담입니다.
            </p>
            
            <div className="space-y-3">
              {agencyList.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-primary cursor-pointer text-white px-5 py-2 rounded text-sm font-nexon"
                        onClick={() => {
                          window.open(option.link, '_blank');
                        }}
                      >
                        {option.title}
                      </div>
                      { option.introductionImage && (
                        <div className="bg-gray-600 cursor-pointer text-white p-2 rounded text-sm font-nexon"
                          onClick={() => {
                            // 이미지 URL을 새 창에서 열기
                            const imageUrl = normalizeImageSrc(option.introductionImage || '');
                            if (imageUrl) {
                              window.open(imageUrl, '_blank', 'width=600,height=400');
                            }
                          }}
                        >
                          이용 안내
                        </div>
                      )}
                    </div>
                    <p className="text-text-secondary text-xs font-nexon">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-orange-800 font-medium font-nexon mb-2">
                익명성 100% 보장
              </h4>
              <p className="text-text-secondary text-sm font-nexon mb-2 text-wrap">
                구매대행 업체는 본 사이트와 아무런 연관이 없으며 구글 검색을 통해 찾은 100% 합법 가상화폐 구매대행 업체입니다. <br/>
                구매대행 업체는 지갑 주소만 보고 어느 사이트 지갑 주소인지 알 방법이 없습니다. <br/>
                특정 사이트 충전임을 직접 밝히지 않는 이상 그 누구도 알 수 없습니다.
              </p>
            </div>
          </div>
        </Collapse>

        {/* 결제정보 입력 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-text-primary font-medium font-nexon mb-4">결제정보 입력</h3>
          
          <div className="space-y-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'}`}>
                <label htmlFor="coinCode" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                  코인선택 <span className="text-red-500">*</span>
                </label>
                <div className="flex-1">
                  <CustomSelect<any>
                    options={coins?.map((coin) => ({
                      id: coin.coin_code,
                      label: `${coin.coin_name} (${coin.coin_symbol})`,
                      value: coin,
                      icon: `/icons/coin/${coin.coin_code}.svg`
                    })) || []}
                    value={selectedCoin}
                    onChange={(option) => setSelectedCoin(option.value)}
                    placeholder="코인을 선택해주세요"
                    showIcon={true}
                    maxHeight="240px"
                  />
                </div>
              </div>
            </div>

            <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'}`}>
              <label htmlFor="walletAddress" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                지갑주소 <span className="text-red-500">*</span>
              </label>
              <div className="relative flex-1">
                <input
                  name="walletAddress"
                  type="text"
                  disabled
                  placeholder="선택한 지갑주소가 노출됩니다."
                  value={coins?.find(item => item.coin_code === selectedPurchase)?.metadata?.wallet_address || ''}
                  className="w-full h-10 px-3 pr-12 border bg-gray-200 border-gray-300 rounded-lg text-text-primary text-sm font-nexon focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <ClipboardButton
                    text={coins?.find(item => item.coin_code === selectedPurchase)?.metadata?.wallet_address || ''}
                    className="p-1"
                    successMessage="지갑 주소가 복사되었습니다."
                    disabled={!coins?.find(item => item.coin_code === selectedPurchase)?.metadata?.wallet_address}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'}`}>
                <label htmlFor="purchaseAmount" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                  결제금액 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-1 gap-2">
                  <input
                    name="purchaseAmount"
                    type="text"
                    placeholder="최소 25,000원부터 입력 가능합니다."
                    value={purchaseAmount.toLocaleString()}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value.replace(/,/g, '')))}
                    className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-text-primary text-sm font-nexon focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setPurchaseAmount(25000)}
                    className="bg-white hover:bg-gray-200 border border-primary text-primary text-[11px] font-medium font-nexon px-4 py-0.5 rounded hover:bg-opacity-90 transition-all duration-200 ml-1 inline-block"
                  >
                    최소
                  </button>
                </div>
              </div>
              {/* 헬퍼 텍스트: 50% 계산 표시 */}
              {purchaseAmount > 0 && (
                <div className={`${isMobile ? 'ml-0' : 'ml-24'} text-xs text-gray-500`}>
                  적립 예상 포인트: <b className='text-primary'>{Math.floor(purchaseAmount * 0.5).toLocaleString()}P</b> (50%)
                </div>
              )}
            </div>

            <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center gap-4'}`}>
              <label htmlFor="paymentMethod" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                결제방법 <span className="text-red-500">*</span>
              </label>
              <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center gap-6'}`}>
                {paymentMethods.map((item) => (
                  <RadioButton
                    key={item.id}
                    checked={selectedPaymentMethod === item.id}
                    onChange={handlePaymentMethodChange}
                    name="paymentMethod"
                    value={item.id}
                  >
                    {item.name}
                  </RadioButton>
                ))}
              </div>
            </div>

            {(selectedPaymentMethod === 'agency' || selectedPaymentMethod === 'exchange_direct') && (
            <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'}`}>
              <label htmlFor="exchangeName" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                {
                  selectedPaymentMethod === 'agency' 
                    ? '대행업체명' 
                    : '거래소명' 
                }
              </label>
              <input
                name="exchangeName"
                type="text"
                value={exchangeName}
                onChange={(e) => setExchangeName(e.target.value)}
                placeholder={
                  selectedPaymentMethod === 'agency' 
                    ? '대행업체명을 입력해주세요.' 
                    : '거래소명을 입력해주세요.'
                }
                className={`sm:flex sm:flex-1 h-10 px-3 border border-gray-300 rounded-lg text-text-primary text-sm font-nexon focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
            )}
            <div>
              <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-4'}`}>
                <label htmlFor="transactionId" className={`text-text-tertiary text-sm font-nexon ${isMobile ? 'w-full' : 'w-20 flex-shrink-0'}`}>
                  트랜잭션 ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="transactionId"
                  type="text"
                  placeholder="TXID는 결제지갑 주소 형식의 영문+숫자 조합입니다."
                  className={`sm:flex sm:flex-1 h-10 px-3 border rounded-lg text-text-primary text-sm font-nexon focus:outline-none focus:ring-2 border-gray-300 focus:ring-orange-500`}
                  value={transactionId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTransactionId(value);
                    
                  }}
                />
              </div>
              <p className={`text-orange-500 text-xs font-nexon mt-1 ${isMobile ? 'ml-0' : 'ml-24'} text-wrap`}>
                ※ 가상화폐를 결제 금액만큼 시세에 맞춰 지갑 주소로 전송한 후 트랜잭션 ID를 입력하세요.
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 h-12 bg-gray-600 text-white rounded-lg font-medium font-nexon hover:bg-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handlePurchase}
            className="flex-1 h-12 bg-orange-500 text-white rounded-lg font-medium font-nexon hover:bg-orange-600 transition-colors"
          >
            입금확인 요청
          </button>
        </div>

    </div>
  );
}
