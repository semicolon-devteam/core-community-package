'use client';

import { SITE_DOMAIN } from '@constants/site';
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  options?: {
    controls?: boolean;
    autoplay?: boolean;
    preload?: string;
    responsive?: boolean;
    fluid?: boolean;
    sources?: Array<{
      src: string;
      type: string;
    }>;
  };
}

function VideoPlayer({
  src,
  width = 640,
  height = 360,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  options,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || (!src && !options?.sources?.[0]?.src)) {
      return;
    }

    const video = videoRef.current;

    // 우클릭 방지
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // 키보드 단축키 방지
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ctrl + S, Ctrl + U, Ctrl + Shift + I 등 방지
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 드래그 방지
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // 이벤트 리스너 등록
    video.addEventListener('contextmenu', preventContextMenu);
    video.addEventListener('dragstart', preventDrag);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // options.sources가 있으면 그것을 우선 사용
    if (options?.sources?.[0]?.src) {
      video.src = options.sources[0].src;
      return () => {
        video.removeEventListener('contextmenu', preventContextMenu);
        video.removeEventListener('dragstart', preventDrag);
        document.removeEventListener('keydown', preventKeyboardShortcuts);
      };
    }

    // src가 상대 경로인 경우 절대 경로로 변환
    if (!src.startsWith('http')) {
      const baseUrl =
        process.env.NEXT_PUBLIC_RESOURCE_URL || `https://${SITE_DOMAIN}`;
      const absoluteSrc = src.startsWith('/')
        ? `${baseUrl}${src}`
        : `${baseUrl}/${src}`;

      video.src = absoluteSrc;
    } else {
      // 이미 절대 URL인 경우 그대로 사용
      video.src = src;
    }

    return () => {
      video.removeEventListener('contextmenu', preventContextMenu);
      video.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
    };
  }, [src, options?.sources]);

  // src와 options.sources 모두 없는 경우 빈 비디오 엘리먼트 반환
  if (!src && !options?.sources?.[0]?.src) {
    return (
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay={options?.autoplay ?? autoPlay}
        controls={options?.controls ?? controls}
        muted={muted}
        loop={loop}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: 'none' }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      autoPlay={options?.autoplay ?? autoPlay}
      controls={options?.controls ?? controls}
      muted={muted}
      loop={loop}
      src={src.startsWith('http') ? src : undefined}
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      style={{
        ...(options?.fluid
          ? { width: '100%', height: height  }
          : {}),
        userSelect: 'none',
      }}
    />
  );
}

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default React.memo(VideoPlayer, (prevProps, nextProps) => {
  // 기본 props 비교
  if (
    prevProps.src !== nextProps.src ||
    prevProps.width !== nextProps.width ||
    prevProps.height !== nextProps.height ||
    prevProps.autoPlay !== nextProps.autoPlay ||
    prevProps.controls !== nextProps.controls ||
    prevProps.muted !== nextProps.muted ||
    prevProps.loop !== nextProps.loop
  ) {
    return false; // 리렌더링 필요
  }

  // options 객체 깊은 비교
  const prevOptions = prevProps.options;
  const nextOptions = nextProps.options;

  if (prevOptions === nextOptions) {
    return true; // 같은 참조이므로 리렌더링 불필요
  }

  if (!prevOptions || !nextOptions) {
    return prevOptions === nextOptions; // 하나만 null/undefined인 경우
  }

  // options 내부 속성 비교
  if (
    prevOptions.controls !== nextOptions.controls ||
    prevOptions.autoplay !== nextOptions.autoplay ||
    prevOptions.preload !== nextOptions.preload ||
    prevOptions.responsive !== nextOptions.responsive ||
    prevOptions.fluid !== nextOptions.fluid
  ) {
    return false; // 리렌더링 필요
  }

  // sources 배열 비교
  const prevSources = prevOptions.sources;
  const nextSources = nextOptions.sources;

  if (prevSources === nextSources) {
    return true; // 같은 참조
  }

  if (!prevSources || !nextSources) {
    return prevSources === nextSources;
  }

  if (prevSources.length !== nextSources.length) {
    return false; // 길이가 다름
  }

  // 각 source 객체 비교
  for (let i = 0; i < prevSources.length; i++) {
    if (
      prevSources[i].src !== nextSources[i].src ||
      prevSources[i].type !== nextSources[i].type
    ) {
      return false; // 소스가 다름
    }
  }

  return true; // 모든 props가 같음, 리렌더링 불필요
});
