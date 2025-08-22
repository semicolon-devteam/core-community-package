'use client';

import LinkWithLoader from '@common/LinkWithLoader';
import { useViewportType } from '@hooks/common/useViewportType';
import type { Banner } from '@model/banner';
import { normalizeImageSrc } from '@util/imageUtil';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

// 배열을 섞는 함수 (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 개별 배너 컴포넌트
function SingleBanner({ banner }: { banner: Banner }) {
  const viewportType = useViewportType();

  // 현재 뷰포트에 맞는 배너인지 확인
  if (banner.target_devices && !banner.target_devices.includes(viewportType)) {
    return null;
  }

  // 기본 배너 크기와 비율 계산
  const BASE_WIDTH = 305;
  const BASE_HEIGHT = 104;

  return (
    <div
      className="w-full relative rounded-lg overflow-hidden mb-2"
      style={{
        minWidth: BASE_WIDTH,
        maxWidth: '426px',
        width: '100%',
        aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}`,
      }}
    >
      <LinkWithLoader href={banner.link_url} target={banner.target_window}>
        <Image
          className="w-full h-full object-cover"
          src={normalizeImageSrc(banner.image_url || '/images/main/banner.png')}
          alt={banner.description || '배너 이미지'}
          fill
          sizes="(max-width: 768px) 100vw, 426px"
        />
      </LinkWithLoader>
    </div>
  );
}

export default function SideBanner({ banners }: { banners: Banner[] }) {
  const viewportType = useViewportType();
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행되도록 설정
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 배너를 필터링 (서버/클라이언트 동일)
  const filteredBanners = useMemo(() => {
    if (!banners?.length) return [];

    return banners.filter(
      banner =>
        !banner.target_devices || banner.target_devices.includes(viewportType)
    );
  }, [banners, viewportType]);

  // 클라이언트에서만 shuffle 적용
  const displayBanners = useMemo(() => {
    if (!isClient || filteredBanners.length === 0) {
      return filteredBanners; // 서버사이드에서는 원본 순서 유지
    }

    return shuffleArray(filteredBanners); // 클라이언트에서만 shuffle
  }, [filteredBanners, isClient]);

  if (displayBanners.length === 0) return null;

  return (
    <div className="flex flex-col justify-start items-center w-full min-w-[305px] max-w-[426px] mx-auto">
      {displayBanners.map((banner, index) => (
        <SingleBanner
          key={`side-banner-${banner.id}-${index}`}
          banner={banner}
        />
      ))}
    </div>
  );
}
