# 📚 @team-semicolon/community-core API Reference

## 📋 목차
1. [설치 및 설정](#설치-및-설정)
2. [Hooks](#hooks)
3. [Services](#services)
4. [Stores](#stores)
5. [Utils](#utils)
6. [Types](#types)
7. [Providers](#providers)

## 📦 설치 및 설정

### 설치
```bash
npm install @team-semicolon/community-core
# or
yarn add @team-semicolon/community-core
# or
pnpm add @team-semicolon/community-core
```

### 초기 설정
```tsx
// app/layout.tsx (Next.js App Router)
import { CommunityProvider } from '@team-semicolon/community-core';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CommunityProvider
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL!}
          options={{
            auth: {
              autoRefreshToken: true,
              persistSession: true,
            }
          }}
        >
          {children}
        </CommunityProvider>
      </body>
    </html>
  );
}
```

## 🪝 Hooks

### Authentication Hooks

#### `useAuth()`
인증 상태 관리 및 인증 작업 수행

```typescript
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// 사용 예시
const Component = () => {
  const { user, signIn, signOut, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSubmit={signIn} />;
  }

  return <div>Welcome, {user?.email}!</div>;
};
```

#### `usePermission(options)`
권한 체크 및 접근 제어

```typescript
interface UsePermissionOptions {
  requiredLevel?: number;
  requiredRole?: 'user' | 'admin' | 'super_admin';
  resource?: string;
  action?: 'read' | 'write' | 'delete' | 'admin';
}

// 사용 예시
const AdminPanel = () => {
  const { hasPermission, isChecking } = usePermission({
    requiredRole: 'admin',
    resource: 'users',
    action: 'admin'
  });

  if (isChecking) return <LoadingSpinner />;
  if (!hasPermission) return <AccessDenied />;

  return <AdminContent />;
};
```

#### `useSession()`
세션 상태 모니터링 및 갱신

```typescript
interface UseSessionReturn {
  session: Session | null;
  isExpired: boolean;
  expiresAt: Date | null;
  refresh: () => Promise<void>;
}

// 사용 예시
const SessionMonitor = () => {
  const { session, isExpired, refresh } = useSession();

  useEffect(() => {
    if (isExpired) {
      refresh();
    }
  }, [isExpired]);

  return <div>Session status: {isExpired ? 'Expired' : 'Active'}</div>;
};
```

### Data Fetching Hooks (React Query)

#### `useUser(userId, options)`
사용자 정보 조회

```typescript
interface UseUserOptions {
  enabled?: boolean;
  includeProfile?: boolean;
  includeStats?: boolean;
}

// 사용 예시
const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId, {
    includeProfile: true,
    includeStats: true
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileCard user={user} />;
};
```

#### `usePosts(params)`
게시물 목록 조회

```typescript
interface PostQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  authorId?: string;
  sortBy?: 'latest' | 'popular' | 'trending';
}

// 사용 예시
const PostList = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts({
    page: 1,
    limit: 10,
    category: 'tech',
    sortBy: 'latest'
  });

  return (
    <InfiniteScroll
      loadMore={fetchNextPage}
      hasMore={hasNextPage}
    >
      {data?.posts.map(post => <PostCard key={post.id} post={post} />)}
    </InfiniteScroll>
  );
};
```

#### `useComments(postId, options)`
댓글 조회 및 관리

```typescript
interface UseCommentsOptions {
  enabled?: boolean;
  sortBy?: 'latest' | 'oldest' | 'popular';
  includeReplies?: boolean;
}

// 사용 예시
const Comments = ({ postId }) => {
  const {
    data: comments,
    addComment,
    updateComment,
    deleteComment
  } = useComments(postId, {
    includeReplies: true,
    sortBy: 'latest'
  });

  return <CommentSection comments={comments} onAdd={addComment} />;
};
```

### Realtime Hooks

#### `useRealtimeChat(roomId)`
실시간 채팅 기능

```typescript
interface UseRealtimeChatReturn {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  editMessage: (messageId: string, text: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  isConnected: boolean;
  typingUsers: User[];
  setTyping: (isTyping: boolean) => void;
}

// 사용 예시
const ChatRoom = ({ roomId }) => {
  const {
    messages,
    sendMessage,
    isConnected,
    typingUsers
  } = useRealtimeChat(roomId);

  return (
    <div>
      <ConnectionStatus connected={isConnected} />
      <MessageList messages={messages} />
      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
```

#### `usePresence(channelId)`
온라인 상태 추적

```typescript
interface UsePresenceReturn {
  onlineUsers: User[];
  setStatus: (status: 'online' | 'away' | 'busy') => void;
  trackActivity: () => void;
}

// 사용 예시
const OnlineUsers = ({ channelId }) => {
  const { onlineUsers, setStatus } = usePresence(channelId);

  return (
    <div>
      <h3>온라인 ({onlineUsers.length}명)</h3>
      {onlineUsers.map(user => (
        <UserAvatar key={user.id} user={user} showStatus />
      ))}
    </div>
  );
};
```

### Utility Hooks

#### `useDebounce(value, delay)`
값 디바운싱

```typescript
// 사용 예시
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: results } = useSearch(debouncedQuery);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색..."
    />
  );
};
```

#### `useLocalStorage(key, initialValue)`
로컬 스토리지 상태 관리

```typescript
// 사용 예시
const Settings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'ko');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};
```

#### `usePrevious(value)`
이전 값 추적

```typescript
// 사용 예시
const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      현재: {count}, 이전: {prevCount ?? 'N/A'}
      <button onClick={() => setCount(c => c + 1)}>증가</button>
    </div>
  );
};
```

## 🔧 Services

### BaseService
모든 서비스의 기본 클래스

```typescript
class BaseService<T = any> {
  protected baseURL: string;
  protected headers: Record<string, string>;

  protected async get<R = T>(url: string, config?: RequestConfig): Promise<CommonResponse<R>>;
  protected async post<R = T>(url: string, data?: any, config?: RequestConfig): Promise<CommonResponse<R>>;
  protected async put<R = T>(url: string, data?: any, config?: RequestConfig): Promise<CommonResponse<R>>;
  protected async delete<R = T>(url: string, config?: RequestConfig): Promise<CommonResponse<R>>;
}

// 커스텀 서비스 생성
class CustomService extends BaseService<CustomData> {
  async getCustomData(id: string) {
    return this.get(`/custom/${id}`);
  }

  async updateCustomData(id: string, data: Partial<CustomData>) {
    return this.put(`/custom/${id}`, data);
  }
}
```

### AuthService
Supabase Auth 통합

```typescript
class AuthService {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse>;
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse>;
  async signOut(): Promise<void>;
  async resetPassword(email: string): Promise<void>;
  async updatePassword(newPassword: string): Promise<void>;
  async getSession(): Promise<Session | null>;
  async refreshSession(): Promise<Session | null>;
}

// 사용 예시
const authService = new AuthService();
const { user, session } = await authService.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

### ChatService
실시간 채팅 서비스

```typescript
class ChatService {
  async getMessages(roomId: string, options?: GetMessagesOptions): Promise<Message[]>;
  async sendMessage(roomId: string, text: string): Promise<Message>;
  async updateMessage(messageId: string, text: string): Promise<Message>;
  async deleteMessage(messageId: string): Promise<void>;
  async markAsRead(messageId: string): Promise<void>;
  subscribeToRoom(roomId: string, callbacks: ChatCallbacks): () => void;
}
```

### createSupabaseClient
Supabase 클라이언트 팩토리

```typescript
interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: SupabaseClientOptions;
}

function createSupabaseClient(config: SupabaseConfig): SupabaseClient;

// 사용 예시
const supabase = createSupabaseClient({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: customStorage // 선택적
    }
  }
});
```

## 🗄️ Stores

### useAuthStore
인증 상태 전역 관리 (Zustand)

```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

// 사용 예시
const Component = () => {
  const { user, isAuthenticated, setAuth } = useAuthStore();

  const handleLogin = async (credentials) => {
    const response = await authService.signIn(credentials);
    if (response.user) {
      setAuth(response.user);
    }
  };

  return <div>{isAuthenticated ? `Hello, ${user?.name}` : 'Please login'}</div>;
};
```

### useUIStore
UI 상태 전역 관리

```typescript
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  modalStack: Modal[];
  toggleSidebar: () => void;
  setTheme: (theme: Theme) => void;
  openModal: (modal: Modal) => void;
  closeModal: (id?: string) => void;
}

// 사용 예시
const Layout = () => {
  const { sidebarOpen, toggleSidebar, theme } = useUIStore();

  return (
    <div className={`layout ${theme}`}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
    </div>
  );
};
```

## 🛠️ Utils

### Formatters

#### Date Formatting
```typescript
formatDate(date: string | Date, format?: string): string;
timeAgo(date: string | Date): string;
formatDateTime(date: string | Date): string;
formatTime(date: string | Date): string;

// 예시
formatDate('2024-01-15');          // "2024년 1월 15일"
timeAgo('2024-01-15T10:30:00');   // "2시간 전"
formatDateTime('2024-01-15T10:30'); // "2024년 1월 15일 오전 10:30"
```

#### Number Formatting
```typescript
formatNumber(num: number): string;
formatNumberWithComma(num: number): string;
formatCurrency(amount: number, currency?: string): string;
formatPercentage(value: number, decimals?: number): string;

// 예시
formatNumberWithComma(1234567);        // "1,234,567"
formatCurrency(50000, 'KRW');         // "₩50,000"
formatPercentage(0.1234, 2);          // "12.34%"
```

### Validators

#### Email Validation
```typescript
validateEmail(email: string): boolean;
validateEmailWithDetails(email: string): ValidationResult;

// 예시
validateEmail('user@example.com');     // true
validateEmailWithDetails('invalid');   // { valid: false, errors: [...] }
```

#### Password Validation
```typescript
interface PasswordOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

validatePassword(password: string, options?: PasswordOptions): ValidationResult;

// 예시
validatePassword('Pass123!', {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true
});
```

#### Username Validation
```typescript
validateUsername(username: string): boolean;
isUsernameAvailable(username: string): Promise<boolean>;

// 예시
validateUsername('user_123');           // true
await isUsernameAvailable('john_doe');  // false (이미 사용중)
```

### Helpers

#### Debounce
```typescript
debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: DebounceOptions
): T & { cancel(): void; flush(): void };

// 예시
const debouncedSearch = debounce((query: string) => {
  searchAPI(query);
}, 500);
```

#### Throttle
```typescript
throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: ThrottleOptions
): T & { cancel(): void };

// 예시
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

#### Retry
```typescript
interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
}

retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T>;

// 예시
const data = await retry(
  () => fetchDataFromAPI(),
  {
    maxAttempts: 3,
    delay: 1000,
    backoff: 'exponential',
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}: ${error.message}`);
    }
  }
);
```

## 📝 Types

### Core Types

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  level?: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: User;
}

interface CommonResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}
```

### Database Types

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  category: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  parentId?: string;
  replies?: Comment[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  roomId: string;
  senderId: string;
  sender?: User;
  text: string;
  attachments?: Attachment[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  readBy: string[];
  createdAt: string;
}
```

## 🔌 Providers

### CommunityProvider
메인 Provider - 모든 기능 통합

```tsx
interface CommunityProviderProps {
  children: React.ReactNode;
  supabaseUrl: string;
  supabaseAnonKey: string;
  apiBaseUrl: string;
  options?: {
    auth?: AuthOptions;
    query?: QueryClientConfig;
    realtime?: RealtimeOptions;
  };
}

// 사용 예시
<CommunityProvider
  supabaseUrl={SUPABASE_URL}
  supabaseAnonKey={SUPABASE_ANON_KEY}
  apiBaseUrl={API_BASE_URL}
  options={{
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    query: {
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          cacheTime: 10 * 60 * 1000,
        }
      }
    }
  }}
>
  <App />
</CommunityProvider>
```

### QueryProvider
React Query Provider 래퍼

```tsx
interface QueryProviderProps {
  children: React.ReactNode;
  config?: QueryClientConfig;
}

// 단독 사용 예시 (CommunityProvider 없이)
<QueryProvider
  config={{
    defaultOptions: {
      queries: {
        retry: 3,
        refetchOnWindowFocus: false,
      }
    }
  }}
>
  <App />
</QueryProvider>
```

### SupabaseProvider
Supabase Context Provider

```tsx
interface SupabaseProviderProps {
  children: React.ReactNode;
  supabaseClient: SupabaseClient;
}

// 단독 사용 예시 (CommunityProvider 없이)
const supabase = createSupabaseClient({...});

<SupabaseProvider supabaseClient={supabase}>
  <App />
</SupabaseProvider>
```

## 🔗 통합 예시

### 완전한 Next.js 통합 예시

```tsx
// app/layout.tsx
import { CommunityProvider } from '@team-semicolon/community-core';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CommunityProvider
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          supabaseAnonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          apiBaseUrl={process.env.NEXT_PUBLIC_API_URL!}
        >
          {children}
        </CommunityProvider>
      </body>
    </html>
  );
}

// app/dashboard/page.tsx
'use client';

import {
  useAuth,
  usePermission,
  usePosts,
  useRealtimeChat
} from '@team-semicolon/community-core';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission } = usePermission({ requiredRole: 'admin' });
  const { data: posts } = usePosts({ limit: 5 });
  const { messages, sendMessage } = useRealtimeChat('general');

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <h1>안녕하세요, {user?.name}님!</h1>

      {hasPermission && <AdminPanel />}

      <RecentPosts posts={posts} />

      <ChatWidget
        messages={messages}
        onSend={sendMessage}
      />
    </div>
  );
}
```

---

더 자세한 정보와 예제는 [GitHub Repository](https://github.com/team-semicolon/community-core)를 참고하세요.