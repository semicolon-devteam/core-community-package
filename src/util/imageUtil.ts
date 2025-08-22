// 이미지 캐싱을 위한 사이즈 상수
export const IMAGE_SIZE = {
  sm: 120,
  md: 240,
  lg: 480,
  xl: 720,
  xxl: 960,
} as const;

export type ImageSizeKey = keyof typeof IMAGE_SIZE;

/**
 * Supabase Storage URL을 Image Transformation URL로 변환
 * @param url - 원본 Supabase Storage URL
 * @param size - 이미지 사이즈 (IMAGE_SIZE의 키 또는 숫자)
 * @param quality - 이미지 품질 (20-100, 기본값: 70)
 * @returns 변환된 Image Transformation URL
 */
export function transformSupabaseImageUrl(
  url: string,
  size: ImageSizeKey | number = 'md',
  quality: number = 70
): string {
  if (!url || !url.includes('/storage/v1/object/')) {
    return url;
  }

  try {
    // object를 render/image로 변경
    const transformedUrl = url.replace(
      '/storage/v1/object/',
      '/storage/v1/render/image/'
    );

    // 사이즈 값 결정
    const width = typeof size === 'number' ? size : IMAGE_SIZE[size];

    // 품질 값 검증 (20-100 범위)
    const validQuality = Math.max(20, Math.min(100, quality));

    // 쿼리 파라미터 추가
    const separator = transformedUrl.includes('?') ? '&' : '?';
    const params = `width=${width}&quality=${validQuality}`;

    return `${transformedUrl}${separator}${params}`;
  } catch (error) {
    console.error('Failed to transform Supabase image URL:', error);
    return url; // 변환 실패 시 원본 URL 반환
  }
}

/**
 * 여러 사이즈의 이미지 URL을 생성 (srcSet용)
 * @param url - 원본 Supabase Storage URL
 * @param sizes - 생성할 사이즈 배열
 * @param quality - 이미지 품질 (기본값: 70)
 * @returns 사이즈별 URL 객체
 */
export function generateImageSrcSet(
  url: string,
  sizes: ImageSizeKey[] = ['sm', 'md', 'lg'],
  quality: number = 70
): Record<ImageSizeKey, string> {
  const result = {} as Record<ImageSizeKey, string>;

  sizes.forEach(size => {
    result[size] = transformSupabaseImageUrl(url, size, quality);
  });

  return result;
}

/**
 * Next.js Image 컴포넌트용 로더 함수
 * @param src - 이미지 소스 (버킷 경로)
 * @param width - 요청된 너비
 * @param quality - 이미지 품질
 * @returns 변환된 URL
 */
export function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const baseUrl = 'https://community.semi-colon.space';
  const validQuality = quality || 75;

  return `${baseUrl}/storage/v1/render/image/public/${src}?width=${width}&quality=${validQuality}`;
}

/**
 * 이미지 src의 절대경로를 상대경로로 변환
 * NEXT_PUBLIC_STORAGE_URL 또는 NEXT_PUBLIC_SUPABASE_URL이 포함된 URL을 상대경로로 변환합니다.
 * @param src - 변환할 이미지 소스 URL
 * @returns 상대경로로 변환된 URL 또는 원본 URL
 */
export function normalizeImageSrc(src: string): string {
  if (!src || typeof src !== 'string') {
    return src;
  }

  try {
    const resourceUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    
    // NEXT_PUBLIC_STORAGE_URL이 설정되어 있고, src가 해당 URL로 시작하는 경우
    if (resourceUrl && src.startsWith(resourceUrl)) {
      // NEXT_PUBLIC_STORAGE_URL 부분을 제거하여 상대경로로 변환
      const relativePath = src.replace(resourceUrl, '');
      
      // relativePath가 '/'로 시작하지 않는 경우 '/'를 붙이도록 처리
      if (!relativePath.startsWith('/')) {
        return `/${relativePath}`;
      }
      return relativePath;
    }

    // NEXT_PUBLIC_RESOURCE_URL이 없거나 해당 URL로 시작하지 않는 경우 원본 반환
    return src;
  } catch (error) {
    console.error('Failed to normalize image src:', error);
    return src; // 에러 발생 시 원본 URL 반환
  }
}

/**
 * Next.js Image 컴포넌트용 src 변환 헬퍼
 * 절대경로를 상대경로로 변환하고 Supabase 이미지 최적화도 적용합니다.
 * @param src - 원본 이미지 소스
 * @param size - 이미지 사이즈 (선택사항)
 * @param quality - 이미지 품질 (선택사항)
 * @returns 최적화된 이미지 URL
 */
export function optimizeImageSrc(
  src: string,
  size?: ImageSizeKey | number,
  quality?: number
): string {
  // 먼저 상대경로로 변환
  const normalizedSrc = normalizeImageSrc(src);
  
  // Supabase 이미지인 경우 최적화 적용
  if (size !== undefined && normalizedSrc.includes('/storage/v1/object/')) {
    return transformSupabaseImageUrl(normalizedSrc, size, quality);
  }
  
  return normalizedSrc;
}

/**
 * 이미지가 GIF 파일인지 확인
 * @param src - 이미지 소스 URL
 * @returns GIF 파일 여부
 */
export function isGifImage(src: string): boolean {
  if (!src || typeof src !== 'string') {
    return false;
  }
  
  // URL에서 확장자 확인 (.gif로 끝나는지)
  const lowerSrc = src.toLowerCase();
  return lowerSrc.endsWith('.gif') || lowerSrc.includes('.gif?');
}

/**
 * 이미지가 애니메이션 포맷인지 확인 (GIF, WEBP 애니메이션 등)
 * @param src - 이미지 소스 URL
 * @returns 애니메이션 이미지 여부
 */
export function isAnimatedImage(src: string): boolean {
  if (!src || typeof src !== 'string') {
    return false;
  }
  
  const lowerSrc = src.toLowerCase();
  // GIF는 항상 애니메이션일 가능성이 있음
  // WEBP는 애니메이션을 지원하지만 URL만으로는 판단 불가
  return isGifImage(src);
}

/**
 * Next.js Image 컴포넌트에 필요한 props를 자동으로 결정
 * GIF 파일의 경우 unoptimized 속성을 추가
 * @param src - 이미지 소스 URL
 * @returns Image 컴포넌트용 추가 props
 */
export function getImageProps(src: string): { unoptimized?: boolean } {
  // GIF 파일인 경우 unoptimized 설정
  if (isGifImage(src)) {
    return { unoptimized: true };
  }
  
  return {};
}
