# 📖 @team-semicolon/community-core 사용 예제

## 📋 목차
1. [시작하기](#시작하기)
2. [인증 구현](#인증-구현)
3. [데이터 페칭](#데이터-페칭)
4. [실시간 기능](#실시간-기능)
5. [상태 관리](#상태-관리)
6. [유틸리티 사용](#유틸리티-사용)
7. [완전한 예제](#완전한-예제)

## 🚀 시작하기

### 기본 설정

```tsx
// app/providers.tsx
'use client';

import { CommunityProvider } from '@team-semicolon/community-core';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CommunityProvider
      supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
      supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
      apiBaseUrl={process.env.NEXT_PUBLIC_API_URL!}
      options={{
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        query: {
          defaultOptions: {
            queries: {
              staleTime: 5 * 60 * 1000, // 5분
              cacheTime: 10 * 60 * 1000, // 10분
              retry: 3,
              refetchOnWindowFocus: false
            }
          }
        }
      }}
    >
      {children}
    </CommunityProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## 🔐 인증 구현

### 로그인 폼 컴포넌트

```tsx
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@team-semicolon/community-core';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await signIn({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      // 로그인 성공
      router.push('/dashboard');
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <button type="submit" disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
}
```

### 회원가입 폼 컴포넌트

```tsx
// components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useAuth, validateEmail, validatePassword } from '@team-semicolon/community-core';

export function SignUpForm() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    const passwordValidation = validatePassword(formData.password, {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
    });

    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        }
      }
    });

    if (error) {
      setErrors({ submit: error.message });
    } else {
      // 회원가입 성공 - 이메일 인증 안내
      alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 폼 필드들... */}
    </form>
  );
}
```

### 보호된 페이지 구현

```tsx
// app/admin/page.tsx
'use client';

import { usePermission } from '@team-semicolon/community-core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();
  const { hasPermission, isChecking } = usePermission({
    requiredRole: 'admin',
  });

  useEffect(() => {
    if (!isChecking && !hasPermission) {
      router.push('/unauthorized');
    }
  }, [hasPermission, isChecking, router]);

  if (isChecking) {
    return <div>권한을 확인하는 중...</div>;
  }

  if (!hasPermission) {
    return null; // 리다이렉션 중
  }

  return (
    <div>
      <h1>관리자 페이지</h1>
      {/* 관리자 전용 콘텐츠 */}
    </div>
  );
}
```

## 📊 데이터 페칭

### 게시물 목록 with 무한 스크롤

```tsx
// components/posts/PostList.tsx
'use client';

import { usePosts } from '@team-semicolon/community-core';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function PostList({ category }: { category?: string }) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = usePosts({
    category,
    limit: 10,
    sortBy: 'latest'
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) return <PostListSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-4">
      {data?.pages.map((page) =>
        page.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}

      {/* 무한 스크롤 트리거 */}
      <div ref={ref}>
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  );
}
```

### 댓글 시스템

```tsx
// components/comments/CommentSection.tsx
'use client';

import { useState } from 'react';
import { useComments, useAuth } from '@team-semicolon/community-core';

export function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const {
    data: comments,
    addComment,
    updateComment,
    deleteComment,
    isLoading
  } = useComments(postId, {
    sortBy: 'latest',
    includeReplies: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    await addComment({
      content: newComment,
      authorId: user?.id!
    });

    setNewComment('');
  };

  const handleEdit = async (commentId: string, newContent: string) => {
    await updateComment(commentId, { content: newContent });
  };

  const handleDelete = async (commentId: string) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      await deleteComment(commentId);
    }
  };

  return (
    <div className="comment-section">
      {/* 댓글 작성 폼 */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full p-2 border rounded"
          />
          <button type="submit">댓글 작성</button>
        </form>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-2">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={comment.authorId === user?.id}
            canDelete={comment.authorId === user?.id}
          />
        ))}
      </div>
    </div>
  );
}
```

## 💬 실시간 기능

### 실시간 채팅방

```tsx
// components/chat/ChatRoom.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRealtimeChat, useAuth } from '@team-semicolon/community-core';

export function ChatRoom({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    isConnected,
    typingUsers,
    setTyping
  } = useRealtimeChat(roomId);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 타이핑 상태 관리
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleTyping = () => {
      setTyping(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setTyping(false), 2000);
    };

    return () => clearTimeout(timeout);
  }, [setTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* 연결 상태 */}
      <div className={`px-4 py-2 ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
        {isConnected ? '연결됨' : '연결 중...'}
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user?.id}
            onEdit={(text) => editMessage(message.id, text)}
            onDelete={() => deleteMessage(message.id)}
          />
        ))}

        {/* 타이핑 인디케이터 */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500">
            {typingUsers.map(u => u.name).join(', ')}님이 입력 중...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setTyping(true);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 온라인 사용자 표시

```tsx
// components/presence/OnlineUsers.tsx
'use client';

import { usePresence, useAuth } from '@team-semicolon/community-core';

export function OnlineUsers({ channelId }: { channelId: string }) {
  const { user } = useAuth();
  const { onlineUsers, setStatus } = usePresence(channelId);

  // 상태 변경
  const handleStatusChange = (status: 'online' | 'away' | 'busy') => {
    setStatus(status);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">
        온라인 사용자 ({onlineUsers.length}명)
      </h3>

      {/* 내 상태 설정 */}
      <div className="mb-4">
        <select
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="online">🟢 온라인</option>
          <option value="away">🟡 자리 비움</option>
          <option value="busy">🔴 바쁨</option>
        </select>
      </div>

      {/* 사용자 목록 */}
      <div className="space-y-2">
        {onlineUsers.map((onlineUser) => (
          <div key={onlineUser.id} className="flex items-center gap-2">
            <StatusIndicator status={onlineUser.status} />
            <span className={onlineUser.id === user?.id ? 'font-bold' : ''}>
              {onlineUser.name}
              {onlineUser.id === user?.id && ' (나)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🗄️ 상태 관리

### 글로벌 상태 관리 (Zustand)

```tsx
// hooks/useGlobalState.ts
import { useAuthStore, useUIStore } from '@team-semicolon/community-core';

export function useGlobalState() {
  const auth = useAuthStore();
  const ui = useUIStore();

  return {
    // 인증 상태
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,

    // UI 상태
    theme: ui.theme,
    sidebarOpen: ui.sidebarOpen,

    // 액션
    toggleSidebar: ui.toggleSidebar,
    setTheme: ui.setTheme,
    logout: auth.clearAuth
  };
}

// 컴포넌트에서 사용
export function Header() {
  const { user, theme, setTheme, logout } = useGlobalState();

  return (
    <header>
      <div>안녕하세요, {user?.name}님</div>

      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        테마 전환
      </button>

      <button onClick={logout}>로그아웃</button>
    </header>
  );
}
```

### 커스텀 스토어 생성

```tsx
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage' // localStorage 키
    }
  )
);
```

## 🛠️ 유틸리티 사용

### 폼 검증 및 포맷팅

```tsx
// components/forms/UserProfileForm.tsx
'use client';

import { useState } from 'react';
import {
  validateEmail,
  validateUsername,
  formatPhoneNumber,
  debounce,
  isUsernameAvailable
} from '@team-semicolon/community-core';

export function UserProfileForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState(false);

  // 사용자명 중복 체크 (디바운스 적용)
  const checkUsername = debounce(async (username: string) => {
    if (!validateUsername(username)) {
      setErrors(prev => ({ ...prev, username: '유효하지 않은 사용자명입니다.' }));
      return;
    }

    setChecking(true);
    try {
      const available = await isUsernameAvailable(username);
      setErrors(prev => ({
        ...prev,
        username: available ? '' : '이미 사용 중인 사용자명입니다.'
      }));
    } finally {
      setChecking(false);
    }
  }, 500);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setFormData(prev => ({ ...prev, username }));
    checkUsername(username);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  return (
    <form className="space-y-4">
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            if (!validateEmail(e.target.value)) {
              setErrors(prev => ({ ...prev, email: '올바른 이메일 형식이 아닙니다.' }));
            } else {
              setErrors(prev => ({ ...prev, email: '' }));
            }
          }}
          placeholder="이메일"
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div>
        <input
          type="text"
          value={formData.username}
          onChange={handleUsernameChange}
          placeholder="사용자명"
        />
        {checking && <span>확인 중...</span>}
        {errors.username && <span className="text-red-500">{errors.username}</span>}
      </div>

      <div>
        <input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="전화번호"
        />
      </div>

      <button type="submit">저장</button>
    </form>
  );
}
```

### 날짜 및 숫자 포맷팅

```tsx
// components/stats/UserStats.tsx
import {
  formatDate,
  timeAgo,
  formatNumberWithComma,
  formatCurrency,
  formatPercentage
} from '@team-semicolon/community-core';

interface UserStatsProps {
  joinedAt: string;
  lastLoginAt: string;
  totalPosts: number;
  totalRevenue: number;
  growthRate: number;
}

export function UserStats({
  joinedAt,
  lastLoginAt,
  totalPosts,
  totalRevenue,
  growthRate
}: UserStatsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>가입일</h3>
        <p>{formatDate(joinedAt)}</p>
        <small className="text-gray-500">
          {timeAgo(joinedAt)}
        </small>
      </div>

      <div className="stat-card">
        <h3>마지막 로그인</h3>
        <p>{timeAgo(lastLoginAt)}</p>
      </div>

      <div className="stat-card">
        <h3>작성한 글</h3>
        <p className="text-2xl font-bold">
          {formatNumberWithComma(totalPosts)}개
        </p>
      </div>

      <div className="stat-card">
        <h3>총 수익</h3>
        <p className="text-2xl font-bold">
          {formatCurrency(totalRevenue, 'KRW')}
        </p>
      </div>

      <div className="stat-card">
        <h3>성장률</h3>
        <p className={`text-2xl font-bold ${growthRate > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {growthRate > 0 ? '+' : ''}{formatPercentage(growthRate, 2)}
        </p>
      </div>
    </div>
  );
}
```

## 🎯 완전한 예제

### 커뮤니티 대시보드 페이지

```tsx
// app/dashboard/page.tsx
'use client';

import { Suspense } from 'react';
import {
  useAuth,
  usePermission,
  usePosts,
  useRealtimeChat,
  usePresence,
  formatDate,
  timeAgo
} from '@team-semicolon/community-core';

// 컴포넌트들
import { PostList } from '@/components/posts/PostList';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { OnlineUsers } from '@/components/presence/OnlineUsers';
import { UserStats } from '@/components/stats/UserStats';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission: isAdmin } = usePermission({ requiredRole: 'admin' });

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          안녕하세요, {user?.name}님! 👋
        </h1>
        <p className="text-gray-600">
          마지막 로그인: {timeAgo(user?.lastLoginAt)}
        </p>
      </header>

      {/* 통계 (관리자만) */}
      {isAdmin && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminStats />
        </Suspense>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 최신 게시물 */}
          <section>
            <h2 className="text-xl font-bold mb-4">최신 게시물</h2>
            <Suspense fallback={<PostListSkeleton />}>
              <PostList category="all" />
            </Suspense>
          </section>

          {/* 내 활동 */}
          <section>
            <h2 className="text-xl font-bold mb-4">내 활동</h2>
            <UserActivity userId={user?.id!} />
          </section>
        </div>

        {/* 사이드바 */}
        <aside className="space-y-6">
          {/* 온라인 사용자 */}
          <section>
            <h2 className="text-xl font-bold mb-4">온라인 사용자</h2>
            <OnlineUsers channelId="community" />
          </section>

          {/* 실시간 채팅 */}
          <section>
            <h2 className="text-xl font-bold mb-4">커뮤니티 채팅</h2>
            <ChatWidget roomId="general" />
          </section>

          {/* 공지사항 */}
          <section>
            <h2 className="text-xl font-bold mb-4">공지사항</h2>
            <Announcements />
          </section>
        </aside>
      </div>
    </div>
  );
}

// 관리자 통계 컴포넌트
function AdminStats() {
  const { data: stats } = useAdminStats();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <StatCard title="총 사용자" value={stats?.totalUsers} />
      <StatCard title="오늘 가입" value={stats?.todaySignups} />
      <StatCard title="활성 사용자" value={stats?.activeUsers} />
      <StatCard title="총 게시물" value={stats?.totalPosts} />
    </div>
  );
}

// 사용자 활동 컴포넌트
function UserActivity({ userId }: { userId: string }) {
  const { data: activities } = useUserActivities(userId);

  return (
    <div className="space-y-2">
      {activities?.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
          <ActivityIcon type={activity.type} />
          <div className="flex-1">
            <p>{activity.description}</p>
            <small className="text-gray-500">
              {timeAgo(activity.createdAt)}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 서버 컴포넌트와 클라이언트 컴포넌트 조합

```tsx
// app/posts/[id]/page.tsx (서버 컴포넌트)
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PostService, formatDate } from '@team-semicolon/community-core';

// 클라이언트 컴포넌트들
import { PostActions } from './PostActions';
import { CommentSection } from './CommentSection';

interface PageProps {
  params: { id: string };
}

// 서버 컴포넌트에서 초기 데이터 페칭
export default async function PostPage({ params }: PageProps) {
  const postService = new PostService();
  const { data: post, error } = await postService.getPost(params.id);

  if (error || !post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto p-6">
      {/* 게시물 헤더 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600">
          <span>{post.author.name}</span>
          <span>•</span>
          <time>{formatDate(post.createdAt)}</time>
          <span>•</span>
          <span>{post.viewCount}회 조회</span>
        </div>
      </header>

      {/* 게시물 본문 */}
      <div className="prose max-w-none mb-8">
        {post.content}
      </div>

      {/* 클라이언트 컴포넌트 - 좋아요, 공유 등 */}
      <PostActions postId={post.id} initialLikes={post.likeCount} />

      {/* 댓글 섹션 (클라이언트 컴포넌트) */}
      <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
        <CommentSection postId={post.id} />
      </Suspense>
    </article>
  );
}

// app/posts/[id]/PostActions.tsx (클라이언트 컴포넌트)
'use client';

import { useState } from 'react';
import { useAuth, useLikePost } from '@team-semicolon/community-core';

export function PostActions({
  postId,
  initialLikes
}: {
  postId: string;
  initialLikes: number;
}) {
  const { user } = useAuth();
  const { toggleLike, isLiked, likeCount } = useLikePost(postId, {
    initialCount: initialLikes
  });

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else {
      // 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다.');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-y">
      <button
        onClick={toggleLike}
        disabled={!user}
        className={`flex items-center gap-2 px-4 py-2 rounded ${
          isLiked ? 'bg-red-500 text-white' : 'bg-gray-100'
        }`}
      >
        ❤️ {likeCount}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded"
      >
        🔗 공유
      </button>
    </div>
  );
}
```

---

이제 `@team-semicolon/community-core` 패키지를 프로젝트에 통합하여 커뮤니티 플랫폼을 구축할 준비가 되었습니다! 🚀