# GlobalLoader 컴포넌트

React Spinners 라이브러리를 사용한 글로벌 로딩 컴포넌트입니다.

## 기능

- 화면 전체를 가리는 검은색 반투명 배경 (backdrop-blur 효과 포함)
- 중앙에 위치한 FadeLoader 스피너 (주황색 브랜드 컬러)
- **부드러운 페이드 인/아웃 애니메이션** ✨
- **스케일 및 트랜슬레이트 전환 효과**
- **백그라운드 글로우 효과**
- **로딩 텍스트와 지연된 애니메이션**
- Redux를 통한 전역 상태 관리
- 높은 z-index(9999)로 다른 요소들 위에 표시

## 애니메이션 특징

### 페이드 인 효과 (로딩 시작)
- 배경: 투명 → 60% 불투명도 (300ms)
- 스피너 컨테이너: 90% 크기 + 아래로 4px 이동 + 투명 → 100% 크기 + 원위치 + 불투명 (300ms)
- 글로우 효과: 점진적으로 확산 (500ms)
- 로딩 텍스트: 100ms 지연 후 나타남 (500ms)

### 페이드 아웃 효과 (로딩 종료)
- 모든 효과가 역순으로 진행
- 총 350ms 후 DOM에서 완전히 제거

## 사용 방법

### 1. 기본 사용법

```typescript
import { useGlobalLoader } from "@hooks/common";

const SomeComponent = () => {
  const { showLoader, hideLoader } = useGlobalLoader();

  const handleClick = () => {
    showLoader();
    
    // 비동기 작업 수행
    setTimeout(() => {
      hideLoader();
    }, 3000);
  };

  return <button onClick={handleClick}>로딩 테스트</button>;
};
```

### 2. withLoader 함수 사용법

```typescript
import { useGlobalLoader } from "@hooks/common";

const SomeComponent = () => {
  const { withLoader } = useGlobalLoader();

  const fetchData = async () => {
    const result = await withLoader(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });
    
  };

  return <button onClick={fetchData}>데이터 가져오기</button>;
};
```

### 3. 페이지 네비게이션과 함께 사용

```typescript
import LinkWithLoader from "@common/LinkWithLoader";

const Navigation = () => {
  return (
    <LinkWithLoader href="/some-page">
      페이지 이동 (자동 로딩 표시)
    </LinkWithLoader>
  );
};
```

### 4. 직접 Redux 액션 사용

```typescript
import { useAppDispatch } from "@hooks/common";
import { showLoading, hideLoading } from "@redux/Features/UI/uiSlice";

const SomeComponent = () => {
  const dispatch = useAppDispatch();

  const handleLoading = () => {
    dispatch(showLoading());
    
    // 작업 수행 후
    dispatch(hideLoading());
  };

  return <button onClick={handleLoading}>로딩 시작</button>;
};
```

## 스타일링

컴포넌트는 Tailwind CSS 클래스를 사용합니다:

### 배경 레이어
- `fixed inset-0`: 화면 전체를 덮음
- `z-[9999]`: 최상위 레이어에 표시
- `bg-black bg-opacity-60`: 검은색 60% 불투명 배경
- `backdrop-blur-sm`: 배경 블러 효과
- `transition-all duration-300 ease-out`: 부드러운 전환

### 스피너 컨테이너
- `scale-100/90`: 크기 변화 애니메이션
- `translate-y-0/4`: 수직 이동 애니메이션
- `opacity-100/0`: 투명도 변화

### 글로우 효과
- `blur-xl`: 강한 블러 효과
- `scale-150`: 확대 효과
- `opacity-10`: 희미한 발광

## 성능 최적화

- **조건부 렌더링**: `shouldRender` 상태로 DOM 마운트/언마운트 최적화
- **적절한 타이밍**: 350ms 후 DOM에서 완전히 제거하여 메모리 효율성 확보
- **CSS 트랜지션**: JavaScript 애니메이션 대신 CSS 트랜지션 사용으로 성능 향상

## 의존성

- react-spinners
- @reduxjs/toolkit
- react-redux
- tailwindcss (애니메이션 클래스) 