export declare const IMAGE_SIZE: {
    readonly sm: 120;
    readonly md: 240;
    readonly lg: 480;
    readonly xl: 720;
    readonly xxl: 960;
};
export type ImageSizeKey = keyof typeof IMAGE_SIZE;
/**
 * Supabase Storage URL을 Image Transformation URL로 변환
 * @param url - 원본 Supabase Storage URL
 * @param size - 이미지 사이즈 (IMAGE_SIZE의 키 또는 숫자)
 * @param quality - 이미지 품질 (20-100, 기본값: 70)
 * @returns 변환된 Image Transformation URL
 */
export declare function transformSupabaseImageUrl(url: string, size?: ImageSizeKey | number, quality?: number): string;
/**
 * 여러 사이즈의 이미지 URL을 생성 (srcSet용)
 * @param url - 원본 Supabase Storage URL
 * @param sizes - 생성할 사이즈 배열
 * @param quality - 이미지 품질 (기본값: 70)
 * @returns 사이즈별 URL 객체
 */
export declare function generateImageSrcSet(url: string, sizes?: ImageSizeKey[], quality?: number): Record<ImageSizeKey, string>;
/**
 * Next.js Image 컴포넌트용 로더 함수
 * @param src - 이미지 소스 (버킷 경로)
 * @param width - 요청된 너비
 * @param quality - 이미지 품질
 * @returns 변환된 URL
 */
export declare function supabaseImageLoader({ src, width, quality, }: {
    src: string;
    width: number;
    quality?: number;
}): string;
/**
 * 이미지 src의 절대경로를 상대경로로 변환
 * NEXT_PUBLIC_STORAGE_URL 또는 NEXT_PUBLIC_SUPABASE_URL이 포함된 URL을 상대경로로 변환합니다.
 * @param src - 변환할 이미지 소스 URL
 * @returns 상대경로로 변환된 URL 또는 원본 URL
 */
export declare function normalizeImageSrc(src: string): string;
/**
 * Next.js Image 컴포넌트용 src 변환 헬퍼
 * 절대경로를 상대경로로 변환하고 Supabase 이미지 최적화도 적용합니다.
 * @param src - 원본 이미지 소스
 * @param size - 이미지 사이즈 (선택사항)
 * @param quality - 이미지 품질 (선택사항)
 * @returns 최적화된 이미지 URL
 */
export declare function optimizeImageSrc(src: string, size?: ImageSizeKey | number, quality?: number): string;
/**
 * 이미지가 GIF 파일인지 확인
 * @param src - 이미지 소스 URL
 * @returns GIF 파일 여부
 */
export declare function isGifImage(src: string): boolean;
/**
 * 이미지가 애니메이션 포맷인지 확인 (GIF, WEBP 애니메이션 등)
 * @param src - 이미지 소스 URL
 * @returns 애니메이션 이미지 여부
 */
export declare function isAnimatedImage(src: string): boolean;
/**
 * Next.js Image 컴포넌트에 필요한 props를 자동으로 결정
 * GIF 파일의 경우 unoptimized 속성을 추가
 * @param src - 이미지 소스 URL
 * @returns Image 컴포넌트용 추가 props
 */
export declare function getImageProps(src: string): {
    unoptimized?: boolean;
};
