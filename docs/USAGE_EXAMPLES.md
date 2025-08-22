# @semicolon/community-core 사용 예제

이 문서는 @semicolon/community-core 패키지의 실제 사용 예제를 제공합니다.

## 🚀 빠른 시작

### 1. 설치

```bash
npm install @semicolon/community-core
```

### 2. 패키지 초기화 (권장)

```typescript
// app.tsx 또는 main.tsx
import { initializeCommunityCore } from '@semicolon/community-core';

initializeCommunityCore({
  apiUrl: process.env.REACT_APP_API_URL,
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  },
  locale: 'ko-KR',
  development: process.env.NODE_ENV === 'development'
});
```

## 🧩 컴포넌트 사용 예제

### Button 컴포넌트

```tsx
import React from 'react';
import { Button } from '@semicolon/community-core';

function PostActions() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // API 호출
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="flex gap-2">
      {/* 기본 버튼 */}
      <Button onClick={handleSave} loading={isLoading}>
        게시글 저장
      </Button>

      {/* 다양한 스타일 */}
      <Button variant="secondary" size="sm">
        임시저장
      </Button>

      <Button variant="outline" size="lg" fullWidth>
        전체 너비 버튼
      </Button>

      {/* 위험한 작업 */}
      <Button variant="danger">
        삭제
      </Button>

      {/* 아이콘과 함께 */}
      <Button startIcon={<PlusIcon />}>
        새 게시글
      </Button>
    </div>
  );
}
```

### Avatar 컴포넌트

```tsx
import React from 'react';
import { Avatar } from '@semicolon/community-core';

function UserProfile({ user }) {
  return (
    <div className="flex items-center space-x-3">
      {/* 기본 아바타 */}
      <Avatar 
        src={user.profileImage} 
        name={user.name}
        size="lg"
      />

      {/* 상태 표시와 함께 */}
      <Avatar 
        src={user.profileImage} 
        name={user.name}
        status="online"
        size="md"
      />

      {/* 이미지 없을 때 이니셜 표시 */}
      <Avatar 
        name="김철수"
        size="xl"
      />

      {/* 브랜드 로고용 (정사각형) */}
      <Avatar 
        src="/company-logo.png" 
        name="Company Name"
        square
      />
    </div>
  );
}
```

### Badge 컴포넌트

```tsx
import React from 'react';
import { Badge } from '@semicolon/community-core';

function PostItem({ post, user }) {
  return (
    <div className="post-item">
      <h3>{post.title}</h3>
      
      <div className="flex items-center gap-2 mt-2">
        {/* 사용자 레벨 */}
        <Badge variant="primary" rounded>
          Level {user.level}
        </Badge>

        {/* 게시글 상태 */}
        {post.isNew && (
          <Badge variant="success" size="sm">
            NEW
          </Badge>
        )}

        {/* 댓글 수 */}
        <Badge variant="info">
          댓글 {post.commentCount}
        </Badge>

        {/* 온라인 상태 */}
        <Badge variant="success" dot>
          온라인
        </Badge>
      </div>
    </div>
  );
}
```

## 🛠️ 유틸리티 함수 사용 예제

### 숫자 포맷팅

```typescript
import { formatNumberWithComma } from '@semicolon/community-core';

function PointDisplay({ points }) {
  return (
    <div className="points">
      보유 포인트: {formatNumberWithComma(points)}P
    </div>
  );
}

// 사용 예제
// 1234567 → "1,234,567"
```

### 날짜 포맷팅

```typescript
import { formatDate, timeAgo } from '@semicolon/community-core';

function PostMeta({ post }) {
  return (
    <div className="post-meta">
      <span>작성일: {formatDate(post.createdAt)}</span>
      <span>({timeAgo(post.createdAt)})</span>
    </div>
  );
}

// 사용 예제
// formatDate("2024-01-15T10:30:00") → "2024.01.15. 10:30:00"
// timeAgo("2024-01-15T10:30:00") → "2시간 전"
```

### 권한 체크

```typescript
import { isAdmin, Utils } from '@semicolon/community-core';

function AdminPanel({ user }) {
  if (!isAdmin(user)) {
    return <div>접근 권한이 없습니다.</div>;
  }

  return (
    <div className="admin-panel">
      {/* 관리자 전용 컨텐츠 */}
    </div>
  );
}

// 네임스페이스 방식으로도 사용 가능
function AlternativeUsage({ user }) {
  const canManage = Utils.AuthUtils.isAdmin(user);
  
  return canManage ? <AdminControls /> : null;
}
```

## 🎨 커뮤니티 플랫폼 통합 예제

### 사용자 카드 컴포넌트

```tsx
import React from 'react';
import { Avatar, Badge, Button, formatDate, LevelUtils } from '@semicolon/community-core';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    profileImage?: string;
    level: number;
    points: number;
    isOnline: boolean;
    joinedAt: string;
  };
  onMessage?: () => void;
  onFollow?: () => void;
}

function UserCard({ user, onMessage, onFollow }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <Avatar
          src={user.profileImage}
          name={user.name}
          size="xl"
          status={user.isOnline ? 'online' : 'offline'}
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <Badge variant="primary" rounded>
              Level {user.level}
            </Badge>
            {user.isOnline && (
              <Badge variant="success" dot size="sm">
                온라인
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600">
            포인트: {formatNumberWithComma(user.points)}P
          </p>
          <p className="text-sm text-gray-500">
            가입일: {formatDate(user.joinedAt, true)}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={onMessage} variant="primary" size="sm">
          메시지 보내기
        </Button>
        <Button onClick={onFollow} variant="outline" size="sm">
          팔로우
        </Button>
      </div>
    </div>
  );
}
```

### 게시글 헤더 컴포넌트

```tsx
import React from 'react';
import { Avatar, Badge, timeAgo } from '@semicolon/community-core';

function PostHeader({ post, author }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Avatar
          src={author.profileImage}
          name={author.name}
          size="md"
          status={author.isOnline ? 'online' : 'offline'}
        />
        
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{author.name}</span>
            <Badge variant="info" size="sm">
              Level {author.level}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            {timeAgo(post.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {post.isPinned && (
          <Badge variant="warning">📌 고정</Badge>
        )}
        {post.isNew && (
          <Badge variant="success">NEW</Badge>
        )}
      </div>
    </div>
  );
}
```

## 📱 반응형 디자인 예제

```tsx
import React from 'react';
import { Button, Avatar, useDeviceType } from '@semicolon/community-core';

function ResponsiveActionBar({ user, onAction }) {
  // 디바이스 타입에 따른 조건부 렌더링 (향후 추가될 훅)
  const isMobile = window.innerWidth < 768;
  
  return (
    <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
      <Avatar 
        src={user.profileImage} 
        name={user.name}
        size={isMobile ? 'lg' : 'md'}
      />
      
      <Button 
        fullWidth={isMobile}
        size={isMobile ? 'lg' : 'md'}
        onClick={onAction}
      >
        액션 실행
      </Button>
    </div>
  );
}
```

## 🔧 고급 사용법

### 네임스페이스 import 방식

```typescript
// 카테고리별 import로 번들 크기 최적화
import { Utils, Types, Constants } from '@semicolon/community-core';

function AdvancedComponent() {
  // 유틸리티 사용
  const formattedDate = Utils.DateUtils.formatDate(new Date());
  const isUserAdmin = Utils.AuthUtils.isAdmin(user);
  
  // 타입 사용
  const user: Types.User = {
    id: '1',
    name: 'John',
    // ... 기타 속성
  };
  
  // 상수 사용 (향후 추가)
  const breakpoint = Constants.BREAKPOINTS.md;
  
  return (
    <div>
      {/* 컴포넌트 내용 */}
    </div>
  );
}
```

### Tree Shaking 최적화

```typescript
// ✅ 권장: 필요한 것만 import
import { Button, formatNumberWithComma } from '@semicolon/community-core';

// ✅ 좋음: 카테고리별 import
import { Button } from '@semicolon/community-core/components';
import { formatNumberWithComma } from '@semicolon/community-core/utils';

// ❌ 비권장: 전체 패키지 import
import * as CommunityCore from '@semicolon/community-core';
```

## 🎯 실전 프로젝트 예제

### 커뮤니티 대시보드

```tsx
import React from 'react';
import {
  Button, Avatar, Badge,
  formatNumberWithComma, timeAgo,
  initializeCommunityCore
} from '@semicolon/community-core';

// 앱 초기화
initializeCommunityCore({
  apiUrl: 'https://api.example.com',
  development: true
});

function CommunityDashboard() {
  const [stats, setStats] = React.useState({
    totalUsers: 15847,
    todayPosts: 342,
    activeUsers: 1205
  });

  return (
    <div className="dashboard">
      <div className="stats-grid grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">전체 사용자</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatNumberWithComma(stats.totalUsers)}
          </p>
        </div>
        
        <div className="stat-card p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">오늘의 게시글</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatNumberWithComma(stats.todayPosts)}
          </p>
        </div>
        
        <div className="stat-card p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold">활성 사용자</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatNumberWithComma(stats.activeUsers)}
          </p>
        </div>
      </div>

      <div className="recent-activity">
        <h2 className="text-xl font-bold mb-4">최근 활동</h2>
        {/* 활동 목록 */}
      </div>
    </div>
  );
}
```

이 예제들을 참고하여 @semicolon/community-core 패키지를 효과적으로 활용해보세요!