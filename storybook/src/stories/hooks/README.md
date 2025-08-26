# 🪝 Community Core Hooks 사용 가이드

`@team-semicolon/community-core` 패키지에서 제공하는 모든 React Hooks의 실제 구현 예시와 사용 방법을 안내합니다.

## 📚 목차

1. [인증 관련 Hooks](#-인증-관련-hooks)
2. [로딩 상태 관리 Hooks](#-로딩-상태-관리-hooks)
3. [React Query 기반 Hooks](#-react-query-기반-hooks)
4. [권한 관리 Hooks](#-권한-관리-hooks)
5. [유틸리티 Hooks](#️-유틸리티-hooks)
6. [알림 시스템 Hooks](#-알림-시스템-hooks)
7. [메시징 시스템 Hooks](#-메시징-시스템-hooks)
8. [베스트 프랙티스](#-베스트-프랙티스)

---

## 🔐 인증 관련 Hooks

### useAuth

사용자 인증 상태를 관리하고 로그인/로그아웃 기능을 제공하는 핵심 훅입니다.

#### 기본 사용법

```tsx
import { useAuth } from '@team-semicolon/community-core';

function LoginPage() {
  const { user, isLoggedIn, loginWithLoader, logoutWithLoader, isLoading } = useAuth();
  
  const handleLogin = async () => {
    try {
      const result = await loginWithLoader({
        email: 'user@example.com',
        password: 'password123'
      });
      
      if (result.success) {
        console.log('로그인 성공:', result.user);
        // 로그인 성공 후 리다이렉트
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      // 에러 토스트 메시지 자동 표시됨
    }
  };
  
  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>환영합니다, {user?.name}님!</h1>
          <button onClick={() => logoutWithLoader()}>
            로그아웃
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      )}
    </div>
  );
}
```

#### 고급 사용법: 조건부 렌더링

```tsx
import { useAuth } from '@team-semicolon/community-core';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isAdmin, isUser, user } = useAuth();
  
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <header>
        <UserProfile user={user} />
        {isAdmin() && <AdminMenu />}
      </header>
      <main>{children}</main>
    </div>
  );
}
```

---

## ⏳ 로딩 상태 관리 Hooks

### useGlobalLoader

전역 로딩 상태를 관리하여 일관된 UX를 제공합니다.

#### withLoader 사용법

```tsx
import { useGlobalLoader } from '@team-semicolon/community-core';

function DataSubmissionForm() {
  const { withLoader } = useGlobalLoader();
  const [formData, setFormData] = useState({ title: '', content: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await withLoader(async () => {
      // 전역 로더가 자동으로 표시됩니다
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ title: '', content: '' });
        // 성공 토스트 메시지 자동 표시
        alert('게시글이 저장되었습니다!');
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="제목"
      />
      <textarea 
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        placeholder="내용"
      />
      <button type="submit">저장</button>
    </form>
  );
}
```

#### 수동 로더 제어

```tsx
import { useGlobalLoader } from '@team-semicolon/community-core';

function FileUploadComponent() {
  const { showLoader, hideLoader, isLoading } = useGlobalLoader();
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileUpload = async (file) => {
    try {
      showLoader('파일 업로드 준비 중...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      showLoader('파일을 업로드하는 중...');
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          showLoader(`파일 업로드 중... ${progress}%`);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          showLoader('업로드 완료 처리 중...');
          setTimeout(() => {
            hideLoader();
            alert('파일 업로드가 완료되었습니다!');
          }, 1000);
        }
      };
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
      
    } catch (error) {
      hideLoader();
      alert('업로드 실패: ' + error.message);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => handleFileUpload(e.target.files[0])}
        disabled={isLoading}
      />
      {isLoading && <div>진행률: {uploadProgress}%</div>}
    </div>
  );
}
```

---

## 🔄 React Query 기반 Hooks

### usePostQuery

게시글 데이터를 효율적으로 관리하는 React Query 기반 훅입니다.

#### 기본 사용법

```tsx
import { usePostQuery } from '@team-semicolon/community-core';

function PostListComponent() {
  const [boardId, setBoardId] = useState(1);
  const [page, setPage] = useState(1);
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = usePostQuery({
    boardId,
    page,
    pageSize: 10,
    enabled: true // 쿼리 활성화 여부
  });
  
  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  
  return (
    <div>
      <h2>게시글 목록</h2>
      
      {/* 게시판 선택 */}
      <select value={boardId} onChange={(e) => setBoardId(Number(e.target.value))}>
        <option value={1}>자유게시판</option>
        <option value={2}>질문게시판</option>
      </select>
      
      {/* 게시글 목록 */}
      <div>
        {data?.items?.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.author}</p>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      <div>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </button>
        <span>페이지 {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.hasNextPage}
        >
          다음
        </button>
      </div>
      
      <button onClick={() => refetch()}>새로고침</button>
    </div>
  );
}
```

#### 조건부 쿼리와 의존성

```tsx
import { usePostQuery, useAuth } from '@team-semicolon/community-core';

function MyPostsComponent() {
  const { user, isLoggedIn } = useAuth();
  const [showMyPosts, setShowMyPosts] = useState(false);
  
  const { data: myPosts, isLoading } = usePostQuery({
    boardId: 1,
    page: 1,
    authorId: user?.id,
    enabled: isLoggedIn && showMyPosts // 조건부 실행
  });
  
  return (
    <div>
      {isLoggedIn ? (
        <div>
          <button onClick={() => setShowMyPosts(!showMyPosts)}>
            {showMyPosts ? '모든 게시글 보기' : '내 게시글만 보기'}
          </button>
          
          {showMyPosts && (
            <div>
              {isLoading ? (
                <div>내 게시글을 불러오는 중...</div>
              ) : (
                <div>
                  <h2>내 게시글 ({myPosts?.totalCount || 0}개)</h2>
                  {myPosts?.items?.map(post => (
                    <div key={post.id}>{post.title}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>로그인이 필요합니다.</div>
      )}
    </div>
  );
}
```

---

## 🔐 권한 관리 Hooks

### usePermission

사용자의 권한 레벨을 확인하고 UI를 제어합니다.

```tsx
import { usePermission, useAuth } from '@team-semicolon/community-core';

function ProtectedContent() {
  const { user } = useAuth();
  const { hasPermission, loading } = usePermission({ 
    requiredLevel: 5 // 필요한 권한 레벨
  });
  
  if (loading) return <div>권한 확인 중...</div>;
  
  if (!hasPermission) {
    return <div>이 콘텐츠를 보려면 레벨 5 이상이 필요합니다.</div>;
  }
  
  return (
    <div>
      <h1>VIP 전용 콘텐츠</h1>
      <p>현재 사용자 레벨: {user?.level}</p>
      <VIPContent />
    </div>
  );
}
```

### useAuthGuard

페이지 레벨에서 인증과 권한을 동시에 검사합니다.

```tsx
import { useAuthGuard } from '@team-semicolon/community-core';

function AdminPage() {
  const { isAuthorized, errorType, isLoading } = useAuthGuard({
    requiredLevel: 10,
    adminOnly: true
  });
  
  if (isLoading) return <div>권한 확인 중...</div>;
  
  if (errorType === 'NOT_LOGGED_IN') {
    return <LoginPrompt />;
  }
  
  if (errorType === 'INSUFFICIENT_PERMISSION') {
    return <div>관리자 권한이 필요합니다.</div>;
  }
  
  return (
    <div>
      <h1>관리자 페이지</h1>
      <AdminDashboard />
    </div>
  );
}
```

---

## 🛠️ 유틸리티 Hooks

### useDeviceType

반응형 디자인을 위한 디바이스 타입 감지 훅입니다.

```tsx
import { useDeviceType } from '@team-semicolon/community-core';

function ResponsiveComponent() {
  const deviceType = useDeviceType();
  
  return (
    <div>
      <h1>현재 디바이스: {deviceType}</h1>
      
      {deviceType === 'mobile' && (
        <MobileLayout>
          <p>모바일용 콘텐츠</p>
        </MobileLayout>
      )}
      
      {deviceType === 'tablet' && (
        <TabletLayout>
          <p>태블릿용 콘텐츠</p>
        </TabletLayout>
      )}
      
      {deviceType === 'desktop' && (
        <DesktopLayout>
          <p>데스크톱용 콘텐츠</p>
        </DesktopLayout>
      )}
    </div>
  );
}
```

### useRouterWithLoader

페이지 이동 시 로딩 상태를 자동으로 관리합니다.

```tsx
import { useRouterWithLoader } from '@team-semicolon/community-core';

function NavigationComponent() {
  const router = useRouterWithLoader();
  
  const handleNavigate = (path: string) => {
    // 로딩 상태가 자동으로 관리됩니다
    router.push(path);
  };
  
  return (
    <nav>
      <button onClick={() => handleNavigate('/dashboard')}>
        대시보드
      </button>
      <button onClick={() => handleNavigate('/profile')}>
        프로필
      </button>
    </nav>
  );
}
```

---

## 🔔 알림 시스템 Hooks

### 알림 센터 구현

```tsx
import { 
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
  useMarkNotificationAsReadCommand 
} from '@team-semicolon/community-core';

function NotificationCenter() {
  const [page, setPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // 알림 목록 조회
  const {
    data: notifications,
    isLoading,
    refetch
  } = useNotificationsQuery({
    page,
    pageSize: 10,
    onlyUnread: showUnreadOnly
  });
  
  // 읽지 않은 알림 개수
  const { data: unreadCount } = useUnreadNotificationCountQuery();
  
  // 알림 읽음 처리
  const markAsRead = useMarkNotificationAsReadCommand();
  
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync(notificationId);
      // React Query가 자동으로 캐시를 무효화하여 UI 업데이트
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };
  
  return (
    <div className="notification-center">
      <header>
        <h2>
          알림 센터
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h2>
        
        <button 
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          {showUnreadOnly ? '전체 보기' : '읽지 않음만'}
        </button>
      </header>
      
      <div className="notification-list">
        {notifications?.notifications?.map(notification => (
          <div 
            key={notification.id}
            className={'notification-item ' + (!notification.is_read ? 'unread' : '')}
          >
            <div className="notification-content">
              <h3>{notification.title}</h3>
              <p>{notification.body}</p>
            </div>
            
            {!notification.is_read && (
              <button 
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={markAsRead.isPending}
              >
                읽음 처리
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 💬 메시징 시스템 Hooks

### 실시간 채팅 구현

```tsx
import { 
  useMessagesQuery,
  useSendMessageCommand,
  useMarkAllMessagesAsReadCommand 
} from '@team-semicolon/community-core';

function ChatRoom({ roomId }: { roomId: string }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 메시지 목록 조회 (3초마다 자동 새로고침)
  const { 
    data: messages, 
    isLoading, 
    refetch 
  } = useMessagesQuery({ 
    roomId,
    refetchInterval: 3000
  });
  
  // 메시지 전송
  const sendMessage = useSendMessageCommand();
  
  // 메시지 전송 핸들러
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await sendMessage.mutateAsync({
        request: {
          room_id: roomId,
          content: newMessage.trim()
        }
      });
      
      setNewMessage('');
      
      // 새 메시지 전송 후 스크롤을 맨 아래로
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };
  
  if (isLoading) return <div>메시지를 불러오는 중...</div>;
  
  return (
    <div className="chat-room">
      <div className="message-list">
        {messages?.messages?.map(message => (
          <div 
            key={message.id} 
            className={'message ' + (message.sender_id === 'current-user' ? 'own' : 'other')}
          >
            <div className="message-header">
              <span>{message.sender?.nickname}</span>
              <span>{new Date(message.created_at).toLocaleTimeString()}</span>
            </div>
            <div>{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={sendMessage.isPending}
        />
        <button type="submit" disabled={!newMessage.trim() || sendMessage.isPending}>
          {sendMessage.isPending ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}
```

---

## 🎯 베스트 프랙티스

### 1. 에러 처리

```tsx
function RobustComponent() {
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isError
  } = usePostQuery({
    boardId: 1,
    page: 1,
    retry: 3, // 3번 재시도
    retryDelay: 1000 // 1초 후 재시도
  });
  
  if (isLoading) {
    return <SkeletonLoader />;
  }
  
  if (isError) {
    return (
      <div className="error-container">
        <p>데이터를 불러오는데 실패했습니다.</p>
        <p>오류: {error?.message}</p>
        <button onClick={() => refetch()}>
          다시 시도
        </button>
      </div>
    );
  }
  
  return <DataDisplay data={data} />;
}
```

### 2. 훅 조합 사용

```tsx
function AuthenticatedDataComponent() {
  const { withLoader } = useGlobalLoader();
  const { user, isLoggedIn, loginWithLoader } = useAuth();
  const { hasPermission } = usePermission({ requiredLevel: 5 });
  
  const handleSecureAction = async () => {
    if (!isLoggedIn) {
      // 로그인이 필요한 경우 자동 로그인
      await loginWithLoader({ 
        email: 'user@example.com', 
        password: 'password' 
      });
    }
    
    if (!hasPermission) {
      alert('권한이 부족합니다.');
      return;
    }
    
    // 보안 작업 수행
    await withLoader(async () => {
      const response = await fetch('/api/secure-action', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('보안 작업이 완료되었습니다!');
      }
    });
  };
  
  return (
    <button onClick={handleSecureAction}>
      보안 작업 수행
    </button>
  );
}
```

### 3. 성능 최적화

```tsx
// React.memo와 함께 사용
const OptimizedComponent = React.memo(function OptimizedComponent() {
  const { data } = usePostQuery({
    boardId: 1,
    page: 1,
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    cacheTime: 10 * 60 * 1000, // 10분간 메모리에 보관
  });
  
  return <PostList posts={data?.items} />;
});

// 조건부 쿼리로 불필요한 요청 방지
function ConditionalQuery({ userId }: { userId?: string }) {
  const { data } = useUserQuery({
    userId,
    enabled: !!userId // userId가 있을 때만 쿼리 실행
  });
  
  return userId ? <UserProfile user={data} /> : <div>사용자를 선택하세요</div>;
}
```

---

## 📋 훅별 요약 테이블

| 훅 이름 | 용도 | 주요 기능 | 자동 기능 |
|---------|------|-----------|-----------|
| `useAuth` | 인증 관리 | 로그인/로그아웃, 사용자 정보 | Redux 자동 연동, 토스트 메시지 |
| `useGlobalLoader` | 로딩 상태 | 전역 로딩 표시/숨김 | 에러 시 자동 해제, 중첩 방지 |
| `usePostQuery` | 게시글 조회 | React Query 기반 데이터 페칭 | 자동 캐싱, 백그라운드 업데이트 |
| `usePermission` | 권한 확인 | 레벨 기반 권한 체크 | 자동 로딩 상태 관리 |
| `useDeviceType` | 반응형 | 디바이스 타입 감지 | 실시간 화면 크기 감지 |
| `useNotificationsQuery` | 알림 조회 | 알림 목록 관리 | 30초 간격 자동 새로고침 |
| `useMessagesQuery` | 메시지 조회 | 채팅 메시지 관리 | 실시간 업데이트, 읽음 처리 |

---

## 🔗 관련 문서

- [Storybook 데모](https://your-storybook-url.com)
- [API 문서](./API_REFERENCE.md)
- [컴포넌트 가이드](./COMPONENTS_GUIDE.md)
- [패키지 설정](./SETUP_GUIDE.md)