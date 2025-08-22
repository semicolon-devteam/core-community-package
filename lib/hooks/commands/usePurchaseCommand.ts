import { CommonResponse, CommonStatus } from "@model/common";
import type { ProcessPurchaseRequest, PurchaseRequest } from "@model/purchase";
import purchaseService from "@services/purchaseService";

export const usePurchaseCommand = () => {

  const purchaseValidation = (data: PurchaseRequest) => {

    if (data.coin_id === '') {
      throw new Error('코인을 선택해주세요.');
    }
    if (data.wallet_address === '') {
      throw new Error('지갑 주소가 없습니다.');
    }
    if (data.purchase_amount < 25000) {
      throw new Error('최소 결제 금액은 25,000원 이상이어야 합니다.');
    }
    if (data.purchase_amount <= 0) {
      throw new Error('결제 금액은 0원 이상이어야 합니다.');
    }
    if (isNaN(data.purchase_amount)) {
      throw new Error('결제 금액은 숫자여야 합니다.');
    }
    if (data.payment_method !== 'personal_wallet' && data.exchange_name === '') {
      throw new Error('대행업체명을 입력해주세요.');
    }
    if (data.transaction_id === '') {
      throw new Error('트랜잭션 ID를 입력해주세요.');
    }
    if (data.transaction_id.length < 5) {
      throw new Error('트랜잭션 ID는 5자 이상이어야 합니다.');
    }
    if (!/^[A-Za-z0-9]+$/.test(data.transaction_id)) {
      throw new Error('트랜잭션 ID는 영문+숫자 조합이어야 합니다.');
    }
  
  }

  const requestPurchase = async (data: PurchaseRequest) => {
      try {
        purchaseValidation(data);
        const response = await purchaseService.requestPurchase(data);
        return response;
      } catch (error) {
        console.error("결제 요청 오류:", error);
        return {
          successOrNot: 'N',
          statusCode: CommonStatus.FAIL,
          data: null,
          message: error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.',
        } as CommonResponse<string>;
      }
  };

  const processPurchase = async (data: ProcessPurchaseRequest) => {
    try {
      const response = await purchaseService.processPurchase(data);
      return response;
    } catch (error) {
      console.error("결제 처리 오류:", error);
      return {
        successOrNot: 'N',
        statusCode: CommonStatus.FAIL,
        data: null,
        message: error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.',
      } as CommonResponse<string>;
    }
  }

  return {
    requestPurchase,
    processPurchase,
  };
}