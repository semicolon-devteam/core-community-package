'use client';

import { useAppSelector } from '@hooks/common';
import { selectUIState } from '@redux/Features/UI/uiSlice';

export default function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isMobileMenuOpen } = useAppSelector(selectUIState);

  // 모바일 메뉴가 활성화된 경우 메인 컨텐츠를 숨김
  if (isMobile && isMobileMenuOpen) return null;
  return (
    <div className="col-span-12 lg:col-span-9  flex flex-col gap-4 px-4 w-full">
      {children}
    </div>
  );
}
