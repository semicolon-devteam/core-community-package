"use client";

import { SITE_DOMAIN } from '@constants/site';
import { useSafeGlobalLoader } from '@hooks/common';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, useCallback, useEffect } from 'react';

interface LinkWithLoaderProps extends Omit<ComponentProps<typeof Link>, 'onClick'> {
  message?: string;
}

export default function LinkWithLoader({ href, children, target, message, ...props }: LinkWithLoaderProps) {
  const { showLoader, hideLoader } = useSafeGlobalLoader();
  const pathname = usePathname();

  // 언마운트 시 로더 숨기기
  useEffect(() => {
    return () => {
      hideLoader();
    };
  }, [pathname, hideLoader]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // target이 "_blank"인 경우 로더 표시하지 않음
    if (target === "_blank") {
      return;
    }

    // 외부 링크인 경우 로더 표시하지 않음
    const hrefString = typeof href === "string" ? href : href.pathname || "";
    if (hrefString.startsWith("http") && !hrefString.includes(SITE_DOMAIN)) {
      return;
    }

    // 같은 페이지 내 이동인 경우 로더 표시하지 않음
    if (hrefString === pathname) {
      return;
    }

    showLoader(message);
  }, [href, pathname, showLoader, target, message]);

  return (
    <Link href={href} target={target} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
} 