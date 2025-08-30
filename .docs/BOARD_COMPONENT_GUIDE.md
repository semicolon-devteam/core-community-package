# Board 컴포넌트 패키지화 완료 가이드

## 📋 개요

`@semicolon/community-core` 패키지의 Board 컴포넌트가 성공적으로 패키지화되었습니다. 게시판 UI를 위한 모든 필수 컴포넌트를 제공하며, 조합 가능한 구조로 설계되었습니다.

## 🔧 설치 및 사용법

### 패키지 설치

```bash
npm install @semicolon/community-core
```

### 기본 사용법

```tsx
import { Board } from '@semicolon/community-core';

function BoardPage() {
  const categories = [
    { id: 1, name: '공지사항' },
    { id: 2, name: '자유게시판' },
    { id: 3, name: 'QnA' }
  ];

  const handlePageChange = (page: number) => {
    console.log('페이지 변경:', page);
  };

  return (
    <Board.Wrapper>
      <Board.Container>
        <Board.Header 
          boardName="자유게시판"
          category={categories}
          totalCount={150}
          totalPages={15}
        />
        
        <Board.Table.Content>
          <Board.Table.Header columns={tableColumns} />
          <Board.Table.Body data={posts} />
        </Board.Table.Content>
        
        <Board.Pagination 
          currentPage={1}
          totalPages={15}
          onPageChange={handlePageChange}
        />
      </Board.Container>
    </Board.Wrapper>
  );
}
```

## 🧩 컴포넌트 구조

### 1. Board.Wrapper
게시판 전체를 감싸는 컨테이너

```tsx
import { BoardWrapper } from '@semicolon/community-core';

<BoardWrapper className="custom-wrapper">
  {/* 게시판 내용 */}
</BoardWrapper>
```

**Props:**
- `children: ReactNode` - 자식 컴포넌트
- `className?: string` - 추가 CSS 클래스

### 2. Board.Container  
게시판 내용을 담는 메인 컨테이너

```tsx
import { BoardContainer } from '@semicolon/community-core';

<BoardContainer className="custom-container">
  {/* 게시판 헤더, 테이블, 페이지네이션 */}
</BoardContainer>
```

**Props:**
- `children: ReactNode` - 자식 컴포넌트
- `className?: string` - 추가 CSS 클래스

### 3. Board.Header
게시판 헤더 (제목, 카테고리, 검색 정보)

```tsx
import { BoardHeader } from '@semicolon/community-core';

<BoardHeader
  boardName="자유게시판"
  category={categories}
  totalCount={150}
  isGlobalSearch={false}
  searchText=""
  totalPages={15}
/>
```

**Props:**
- `boardName?: string` - 게시판 이름
- `category: BoardCategory[]` - 카테고리 목록
- `totalCount: number` - 총 게시물 수
- `isGlobalSearch?: boolean` - 전역 검색 여부
- `searchText?: string` - 검색 텍스트
- `totalPages?: number` - 총 페이지 수

### 4. Board.Table
게시판 테이블 구조

```tsx
import { BoardTable } from '@semicolon/community-core';

<Board.Table.Content>
  <Board.Table.Header columns={columns} />
  <Board.Table.Body data={posts} />
</Board.Table.Content>
```

**하위 컴포넌트:**
- `Board.Table.Content` - 테이블 래퍼
- `Board.Table.Header` - 테이블 헤더
- `Board.Table.Body` - 테이블 본문

### 5. Board.Pagination
페이지네이션 컴포넌트

```tsx
import { BoardPagination } from '@semicolon/community-core';

<BoardPagination
  currentPage={1}
  totalPages={15}
  onPageChange={handlePageChange}
  className="custom-pagination"
/>
```

**Props:**
- `currentPage: number` - 현재 페이지
- `totalPages: number` - 총 페이지 수
- `onPageChange: (page: number) => void` - 페이지 변경 핸들러
- `className?: string` - 추가 CSS 클래스

## 📘 타입 정의

### BoardCategory
```tsx
interface BoardCategory {
  id: number;
  name: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}
```

### BoardPostItem
```tsx
interface BoardPostItem {
  id: number;
  title: string;
  content?: string;
  author: string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  category?: BoardCategory;
  thumbnail?: string;
  isPinned?: boolean;
  isNotice?: boolean;
  status?: 'published' | 'draft' | 'deleted';
}
```

### BoardListResponse
```tsx
interface BoardListResponse {
  posts: BoardPostItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
```

## 🎨 스타일링

모든 컴포넌트는 Tailwind CSS 기반으로 스타일링되어 있으며, `className` props를 통해 커스터마이징 가능합니다.

### 기본 스타일
- 반응형 디자인 지원 (mobile-first)
- 다크모드 지원 준비
- 접근성(a11y) 고려

### 커스터마이징 예시
```tsx
<Board.Wrapper className="bg-gray-50 rounded-lg">
  <Board.Container className="max-w-6xl mx-auto">
    <Board.Header 
      boardName="커스텀 게시판"
      category={categories}
      totalCount={100}
    />
    <Board.Pagination 
      currentPage={1}
      totalPages={10}
      onPageChange={handlePageChange}
      className="mt-8"
    />
  </Board.Container>
</Board.Wrapper>
```

## 🔄 상태 관리 통합

Board 컴포넌트는 외부 상태 관리와 독립적으로 작동하지만, 필요에 따라 Redux나 다른 상태 관리 솔루션과 통합 가능합니다.

```tsx
// Redux와 함께 사용하는 예시
function BoardPageWithRedux() {
  const { posts, loading, currentPage, totalPages } = useSelector(selectBoardState);
  const dispatch = useDispatch();

  const handlePageChange = (page: number) => {
    dispatch(fetchPosts({ page, boardId }));
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Board.Wrapper>
      <Board.Container>
        <Board.Header 
          boardName="Redux 연동 게시판"
          category={categories}
          totalCount={posts?.totalCount || 0}
        />
        
        <Board.Table.Content>
          <Board.Table.Header columns={columns} />
          <Board.Table.Body data={posts?.items || []} />
        </Board.Table.Content>
        
        <Board.Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Board.Container>
    </Board.Wrapper>
  );
}
```

## ⚡ 성능 최적화

### Tree Shaking
개별 컴포넌트를 별도로 import하여 번들 크기를 최적화할 수 있습니다:

```tsx
// 전체 Board 컴포넌트
import { Board } from '@semicolon/community-core';

// 또는 개별 컴포넌트
import { 
  BoardWrapper, 
  BoardContainer, 
  BoardHeader,
  BoardPagination 
} from '@semicolon/community-core';
```

### 메모화
React.memo를 활용한 최적화:

```tsx
import { memo } from 'react';
import { Board } from '@semicolon/community-core';

const OptimizedBoardHeader = memo(Board.Header);
const OptimizedBoardPagination = memo(Board.Pagination);
```

## 🌐 접근성 (Accessibility)

- 키보드 네비게이션 지원
- ARIA 라벨 적용
- 스크린 리더 호환
- 색상 대비 준수

## 🚀 마이그레이션 가이드

기존 Board 컴포넌트에서 패키지 버전으로 마이그레이션:

### Before (기존 방식)
```tsx
import Board from '@component/molecules/Board';
```

### After (패키지 방식)
```tsx
import { Board } from '@semicolon/community-core';
```

구조와 API는 동일하므로 import 경로만 변경하면 됩니다.

## 📦 패키지 정보

- **패키지명:** `@semicolon/community-core`
- **버전:** 1.4.1+
- **번들 크기:** ~50KB (gzipped)
- **의존성:** React 18+, Next.js 14+ (선택적)

## 🤝 기여 가이드

Board 컴포넌트 개선사항이나 버그 리포트는 GitHub 이슈로 제출해 주세요.

---

## 🎉 완료된 패키지화 작업 요약

✅ **구조 분석 완료** - 기존 Board 컴포넌트 구조 파악  
✅ **라이브러리 이전 완료** - lib 폴더로 모든 컴포넌트 이전  
✅ **의존성 정리 완료** - 외부 의존성 최소화 및 패키지 독립성 확보  
✅ **타입 표준화 완료** - 통합된 타입 시스템 구축  
✅ **Export 설정 완료** - 메인 index.ts에 Board 컴포넌트 등록  
✅ **빌드 검증 완료** - 패키지 빌드 성공 및 dist 파일 생성 확인

Board 컴포넌트가 성공적으로 패키지화되어 `@semicolon/community-core`의 핵심 컴포넌트로 제공됩니다!