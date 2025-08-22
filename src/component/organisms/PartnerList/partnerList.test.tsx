// @ts-nocheck
/* 
 * 참고: 이 테스트 파일을 실행하기 위해서는 다음 패키지를 설치해야 합니다:
 * npm install --save-dev @types/jest
 */

import toastReducer from '@redux/Features/Toast/toastSlice';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import PartnerList from './index';

// 리덕스 스토어 모킹 (PartnerItem이 내부에서 사용하므로 필요)
const mockStore = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

// 클립보드 API 모킹 (PartnerItem 내부에서 사용)
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// PartnerItem 컴포넌트 모킹
jest.mock('@organisms/PartnerItem', () => {
  return ({ partner }: { partner: any }) => (
    <div data-testid={`partner-item-${partner.id}`}>
      <div>{partner.siteName}</div>
      <div>{partner.recommendId}</div>
    </div>
  );
});

describe('PartnerList 컴포넌트', () => {
  const mockPartners = [
    {
      id: '1',
      siteName: '테스트 사이트 1',
      recommendId: 'TEST123',
      imageUrl: 'https://example.com/image1.jpg',
      siteUrl: 'https://example1.com',
    },
    {
      id: '2',
      siteName: '테스트 사이트 2',
      recommendId: 'TEST456',
      imageUrl: 'https://example.com/image2.jpg',
      siteUrl: 'https://example2.com',
    },
  ];

  test('파트너 목록이 올바르게 렌더링되는지 확인', () => {
    render(
      <Provider store={mockStore}>
        <PartnerList items={mockPartners} totalCount={mockPartners.length} />
      </Provider>
    );

    // 각 파트너 아이템이 렌더링되었는지 확인
    expect(screen.getByTestId('partner-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('partner-item-2')).toBeInTheDocument();
    
    // 각 파트너의 정보가 표시되는지 확인
    expect(screen.getByText('테스트 사이트 1')).toBeInTheDocument();
    expect(screen.getByText('TEST123')).toBeInTheDocument();
    expect(screen.getByText('테스트 사이트 2')).toBeInTheDocument();
    expect(screen.getByText('TEST456')).toBeInTheDocument();
  });

  test('빈 파트너 목록이 제공되면 아무것도 렌더링되지 않는지 확인', () => {
    render(
      <Provider store={mockStore}>
        <PartnerList items={[]} totalCount={0} />
      </Provider>
    );

    // 파트너 아이템이 렌더링되지 않았는지 확인
    const partnerItems = screen.queryAllByTestId(/partner-item/);
    expect(partnerItems.length).toBe(0);
  });

  test('그리드 레이아웃이 적용되었는지 확인', () => {
    render(
      <Provider store={mockStore}>
        <PartnerList items={mockPartners} totalCount={mockPartners.length} />
      </Provider>
    );

    // 그리드 컨테이너에 적절한 클래스가 적용되었는지 확인
    const gridContainer = screen.getByRole('list') || document.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('md:grid-cols-2');
  });
}); 