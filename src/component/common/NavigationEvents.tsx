"use client";

import { useGlobalLoader } from '@hooks/common';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoader } = useGlobalLoader();

  useEffect(() => {
    // 페이지 이동이 완료되면 로더를 숨김
    hideLoader();
  }, [pathname, searchParams, hideLoader]);

  return null;
} 