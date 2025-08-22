// @ts-nocheck
/* 
 * 참고: 이 테스트 파일을 실행하기 위해서는 다음 패키지를 설치해야 합니다:
 * npm install --save-dev @types/jest
 */

import toastReducer from '@redux/Features/Toast/toastSlice';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import PartnerItem from './index';

// 타입 정의 추가
import type { jest } from '@jest/globals';

// 클립보드 API 모킹
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Redux 스토어 모킹
const mockStore = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

describe('PartnerItem 컴포넌트', () => {
  const mockPartner = {
    id: '1',
    siteName: '테스트 사이트',
    recommendId: 'TEST123',
    imageUrl: 'https://example.com/image.jpg',
    siteUrl: 'https://example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('파트너 정보가 올바르게 렌더링되는지 확인', () => {
    render(
      <Provider store={mockStore}>
        <PartnerItem partner={mockPartner} />
      </Provider>
    );

    // 사이트명 확인
    expect(screen.getByText('테스트 사이트')).toBeInTheDocument();
    
    // 추천ID 확인
    expect(screen.getByText('TEST123')).toBeInTheDocument();
    
    // 이미지 확인
    const image = screen.getByAltText('테스트 사이트');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toBe('https://example.com/image.jpg');
    
    // 버튼 확인
    expect(screen.getByText('상세보기')).toBeInTheDocument();
    expect(screen.getByText('바로가기')).toBeInTheDocument();
  });

  test('복사 버튼을 클릭하면 클립보드에 추천ID가 복사되는지 확인', async () => {
    render(
      <Provider store={mockStore}>
        <PartnerItem partner={mockPartner} />
      </Provider>
    );

    // 복사 버튼 찾기
    const copyButton = screen.getByTitle('클립보드에 복사');
    
    // 복사 버튼 클릭
    fireEvent.click(copyButton);
    
    // 클립보드 API 호출 확인
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('TEST123');
    
    // 복사됨 텍스트가 나타나는지 확인
    await waitFor(() => {
      expect(screen.getByText('복사됨')).toBeInTheDocument();
    });
  });

  test('링크가 올바른 URL로 연결되는지 확인', () => {
    render(
      <Provider store={mockStore}>
        <PartnerItem partner={mockPartner} />
      </Provider>
    );

    // 상세보기 링크 확인
    const detailLink = screen.getByText('상세보기').closest('a');
    expect(detailLink).toHaveAttribute('href', '/partners/1');
    
    // 바로가기 링크 확인
    const directLink = screen.getByText('바로가기').closest('a');
    expect(directLink).toHaveAttribute('href', 'https://example.com');
    expect(directLink).toHaveAttribute('target', '_blank');
    expect(directLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('파트너의 siteUrl이 없을 경우 바로가기 링크가 "#"으로 설정되는지 확인', () => {
    const partnerWithoutSiteUrl = { ...mockPartner, siteUrl: null };
    
    render(
      <Provider store={mockStore}>
        <PartnerItem partner={partnerWithoutSiteUrl} />
      </Provider>
    );
    
    const directLink = screen.getByText('바로가기').closest('a');
    expect(directLink).toHaveAttribute('href', '#');
  });
}); 