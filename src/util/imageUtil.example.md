# Image Utility 사용 가이드

## 추가된 함수들

### 1. `normalizeImageSrc(src: string): string`

`NEXT_PUBLIC_STORAGE_URL`이 포함된 절대경로를 상대경로로 변환합니다.

```typescript
import { normalizeImageSrc } from '@util/imageUtil';

// 예시 1: NEXT_PUBLIC_STORAGE_URL이 'http://localhost:3001'일 때
const absoluteUrl = 'http://localhost:3001/images/banner.png';
const relativeUrl = normalizeImageSrc(absoluteUrl);
// 결과: '/images/banner.png'

// 예시 2: 이미 상대경로인 경우
const relativeUrl2 = normalizeImageSrc('/icons/user.svg');
// 결과: '/icons/user.svg' (변경 없음)

// 예시 3: 다른 도메인의 URL인 경우
const externalUrl = normalizeImageSrc('https://example.com/image.jpg');
// 결과: 'https://example.com/image.jpg' (변경 없음)
```

### 2. `optimizeImageSrc(src: string, size?: ImageSizeKey | number, quality?: number): string`

절대경로를 상대경로로 변환하고 Supabase 이미지 최적화도 함께 적용합니다.

```typescript
import { optimizeImageSrc } from '@util/imageUtil';

// 예시 1: 일반 이미지 - 상대경로 변환만
const normalizedUrl = optimizeImageSrc('http://localhost:3001/icons/logo.png');
// 결과: '/icons/logo.png'

// 예시 2: Supabase 이미지 - 상대경로 변환 + 최적화
const supabaseUrl = 'http://localhost:3001/storage/v1/object/public/images/photo.jpg';
const optimizedUrl = optimizeImageSrc(supabaseUrl, 'lg', 80);
// 결과: '/storage/v1/render/image/public/images/photo.jpg?width=480&quality=80'
```

## React 컴포넌트에서 사용하기

### Next.js Image 컴포넌트와 함께 사용

```tsx
import Image from 'next/image';
import { normalizeImageSrc, optimizeImageSrc } from '@util/imageUtil';

// 방법 1: 기본 사용
function MyComponent({ imageUrl }: { imageUrl: string }) {
  return (
    <Image
      src={normalizeImageSrc(imageUrl)}
      alt="Description"
      width={200}
      height={150}
    />
  );
}

// 방법 2: 최적화와 함께 사용
function OptimizedImageComponent({ imageUrl }: { imageUrl: string }) {
  return (
    <Image
      src={optimizeImageSrc(imageUrl, 'md', 85)}
      alt="Optimized image"
      width={240}
      height={180}
    />
  );
}

// 방법 3: 조건부 최적화
function ConditionalOptimization({ imageUrl, isSupabase }: { 
  imageUrl: string; 
  isSupabase?: boolean;
}) {
  const src = isSupabase 
    ? optimizeImageSrc(imageUrl, 'lg')
    : normalizeImageSrc(imageUrl);
    
  return (
    <Image
      src={src}
      alt="Conditional optimization"
      fill
      className="object-cover"
    />
  );
}
```

### 배너나 갤러리 컴포넌트에서 사용

```tsx
import Image from 'next/image';
import { normalizeImageSrc } from '@util/imageUtil';

interface BannerProps {
  banners: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
}

function BannerComponent({ banners }: BannerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {banners.map((banner) => (
        <div key={banner.id} className="relative aspect-video">
          <Image
            src={normalizeImageSrc(banner.imageUrl)}
            alt={banner.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
```

## 환경변수 설정

`.env.local` 파일에 다음과 같이 설정:

```env
# 개발환경에서 로컬 리소스 서버 URL
NEXT_PUBLIC_STORAGE_URL=http://localhost:3001
```

이렇게 설정하면 `http://localhost:3001/images/banner.png`와 같은 URL이 자동으로 `/images/banner.png`로 변환됩니다.

## 주의사항

1. **타입 안전성**: `src`가 `string`이 아닌 경우 원본을 그대로 반환합니다.
2. **에러 처리**: 변환 중 에러가 발생하면 원본 URL을 반환합니다.
3. **성능**: 함수 호출 비용을 고려하여 필요한 곳에서만 사용하세요.
4. **캐싱**: Next.js Image 최적화와 함께 사용하면 자동으로 캐싱됩니다.