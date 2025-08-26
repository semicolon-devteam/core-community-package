import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Skeleton, SkeletonCard } from '../../components/Skeleton';

// Mock 훅들 (실제로는 @team-semicolon/community-core에서 import하지만 여기서는 시연용으로 mock)
const useGlobalLoaderMock = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return {
    withLoader: async (fn: () => Promise<void>) => {
      setIsLoading(true);
      try {
        await fn();
      } finally {
        setIsLoading(false);
      }
    },
    showLoader: () => setIsLoading(true),
    hideLoader: () => setIsLoading(false),
    isLoading,
  };
};

const useAuthMock = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    loginWithLoader: async (credentials: any) => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUser({ id: 1, name: '테스트 사용자', email: 'test@example.com' });
      setIsLoading(false);
      return { success: true, user: { id: 1, name: '테스트 사용자' } };
    },
    logoutWithLoader: async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(null);
      setIsLoading(false);
      return { success: true };
    },
    isAdmin: () => false,
    isUser: () => !!user,
  };
};

const useDeviceTypeMock = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  return deviceType;
};

const usePostQueryMock = (options: { boardId: number; page: number; enabled: boolean }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!options.enabled) return;
    
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setData({
        data: {
          items: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            title: `게시글 ${i + 1}`,
            content: `게시글 ${i + 1}의 내용입니다.`,
            author: `사용자${i + 1}`,
            createdAt: new Date().toISOString(),
          })),
          totalCount: 50,
        }
      });
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [options.boardId, options.page, options.enabled]);
  
  return { data, isLoading, error: null };
};

// Storybook Meta
const meta: Meta = {
  title: 'Hooks/Examples',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Hooks 사용 예제**

@team-semicolon/community-core에서 제공하는 다양한 훅들의 사용 예시를 보여줍니다.

## 포함된 훅들
- \`useAuth\`: 인증 상태 관리
- \`useGlobalLoader\`: 전역 로딩 상태 관리
- \`useDeviceType\`: 반응형 디바이스 타입 감지
- \`usePostQuery\`: React Query 기반 데이터 페칭
- 기타 유틸리티 훅들

## 사용법
\`\`\`tsx
import { useAuth, useGlobalLoader } from '@team-semicolon/community-core';

const { loginWithLoader, isLoggedIn } = useAuth();
const { withLoader } = useGlobalLoader();
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// useAuth 훅 예시
export const AuthExample: Story = {
  render: () => {
    const { user, isLoggedIn, loginWithLoader, logoutWithLoader, isLoading } = useAuthMock();
    
    const handleLogin = async () => {
      await loginWithLoader({
        email: 'test@example.com',
        password: 'password123',
      });
    };
    
    const handleLogout = async () => {
      await logoutWithLoader();
    };
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">useAuth 훅 예시</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium">현재 상태:</span>
            <Badge variant={isLoggedIn ? 'success' : 'error'}>
              {isLoggedIn ? '로그인됨' : '로그아웃됨'}
            </Badge>
          </div>
          
          {user && (
            <div className="text-sm text-gray-600 mb-3">
              <p>사용자: {user.name}</p>
              <p>이메일: {user.email}</p>
            </div>
          )}
          
          <div className="space-x-2">
            {!isLoggedIn ? (
              <Button 
                onClick={handleLogin} 
                loading={isLoading}
                disabled={isLoading}
              >
                로그인
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLogout}
                loading={isLoading}
                disabled={isLoading}
              >
                로그아웃
              </Button>
            )}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>자동 로딩 상태 관리</li>
            <li>토스트 메시지 표시</li>
            <li>세션 자동 갱신</li>
            <li>권한 체크 기능</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `useAuth 훅을 사용한 인증 상태 관리 예시입니다.

## 실제 구현 코드

### 기본 사용법
\`\`\`tsx
import { useAuth } from '@team-semicolon/community-core';

function LoginComponent() {
  const { user, isLoggedIn, loginWithLoader, logoutWithLoader, isLoading } = useAuth();
  
  const handleLogin = async () => {
    try {
      const result = await loginWithLoader({
        email: 'user@example.com',
        password: 'password123'
      });
      
      if (result.success) {
        console.log('로그인 성공:', result.user);
        // 추가 처리 로직...
      }
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logoutWithLoader();
      console.log('로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  return (
    <div>
      {isLoggedIn ? (
        <div>
          <p>환영합니다, {user?.name}님!</p>
          <button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? '처리 중...' : '로그아웃'}
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
\`\`\`

### 조건부 렌더링
\`\`\`tsx
import { useAuth } from '@team-semicolon/community-core';

function ProtectedComponent() {
  const { isLoggedIn, isAdmin, isUser } = useAuth();
  
  if (!isLoggedIn) {
    return <div>로그인이 필요합니다.</div>;
  }
  
  return (
    <div>
      <h1>보호된 콘텐츠</h1>
      {isAdmin() && <AdminPanel />}
      {isUser() && <UserContent />}
    </div>
  );
}
\`\`\``,
      },
    },
  },
};

// useGlobalLoader 훅 예시
export const GlobalLoaderExample: Story = {
  render: () => {
    const { withLoader, isLoading } = useGlobalLoaderMock();
    
    const handleAsyncAction = async () => {
      await withLoader(async () => {
        // 실제로는 API 호출 등
        await new Promise(resolve => setTimeout(resolve, 3000));
      });
    };
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">useGlobalLoader 훅 예시</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium">로딩 상태:</span>
            <Badge variant={isLoading ? 'warning' : 'success'}>
              {isLoading ? '로딩 중' : '대기 중'}
            </Badge>
          </div>
          
          <Button 
            onClick={handleAsyncAction}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '비동기 작업 실행'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>전역 로딩 상태 관리</li>
            <li>자동 로딩 표시/숨김</li>
            <li>중첩 로딩 방지</li>
            <li>에러 발생 시 자동 해제</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `useGlobalLoader 훅을 사용한 전역 로딩 상태 관리 예시입니다.

## 실제 구현 코드

### 기본 사용법 - withLoader
\`\`\`tsx
import { useGlobalLoader } from '@team-semicolon/community-core';

function DataFetchComponent() {
  const { withLoader } = useGlobalLoader();
  const [data, setData] = useState(null);
  
  const fetchData = async () => {
    await withLoader(async () => {
      // API 호출 - 전역 로더가 자동으로 표시됩니다
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    });
  };
  
  return (
    <div>
      <button onClick={fetchData}>데이터 불러오기</button>
      {data && <div>데이터: {JSON.stringify(data)}</div>}
    </div>
  );
}
\`\`\`

### 수동 제어 - showLoader/hideLoader
\`\`\`tsx
import { useGlobalLoader } from '@team-semicolon/community-core';

function ManualLoaderComponent() {
  const { showLoader, hideLoader, isLoading } = useGlobalLoader();
  
  const handleComplexOperation = async () => {
    try {
      showLoader('복잡한 작업을 처리하는 중...');
      
      // 여러 단계의 작업
      await step1();
      showLoader('2단계 진행 중...');
      
      await step2();
      showLoader('마무리 작업 중...');
      
      await step3();
      
    } catch (error) {
      console.error('작업 실패:', error);
    } finally {
      hideLoader(); // 항상 로더를 숨김
    }
  };
  
  return (
    <button 
      onClick={handleComplexOperation} 
      disabled={isLoading}
    >
      {isLoading ? '처리 중...' : '복잡한 작업 시작'}
    </button>
  );
}
\`\`\`

### Service와 함께 사용
\`\`\`tsx
import { useGlobalLoader, PostService } from '@team-semicolon/community-core';

function PostListComponent() {
  const { withLoader } = useGlobalLoader();
  const [posts, setPosts] = useState([]);
  
  const loadPosts = async () => {
    await withLoader(async () => {
      const postService = new PostService();
      const response = await postService.getPosts({ page: 1, limit: 10 });
      
      if (response.successOrNot === 'Y') {
        setPosts(response.data);
      }
    });
  };
  
  return (
    <div>
      <button onClick={loadPosts}>게시글 불러오기</button>
      <div>
        {posts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </div>
  );
}
\`\`\``,
      },
    },
  },
};

// useDeviceType 훅 예시
export const DeviceTypeExample: Story = {
  render: () => {
    const deviceType = useDeviceTypeMock();
    
    const getDeviceIcon = () => {
      switch (deviceType) {
        case 'mobile':
          return '📱';
        case 'tablet':
          return '📱';
        case 'desktop':
          return '🖥️';
        default:
          return '💻';
      }
    };
    
    const getDeviceColor = () => {
      switch (deviceType) {
        case 'mobile':
          return 'error';
        case 'tablet':
          return 'warning';
        case 'desktop':
          return 'success';
        default:
          return 'default';
      }
    };
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">useDeviceType 훅 예시</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <div className="text-4xl mb-2">{getDeviceIcon()}</div>
          <Badge variant={getDeviceColor() as any} size="lg">
            {deviceType.toUpperCase()}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">
            브라우저 창 크기를 변경해보세요
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-red-50 rounded text-center">
            <div className="font-medium">Mobile</div>
            <div className="text-gray-600">&lt; 768px</div>
          </div>
          <div className="p-2 bg-yellow-50 rounded text-center">
            <div className="font-medium">Tablet</div>
            <div className="text-gray-600">768px - 1024px</div>
          </div>
          <div className="p-2 bg-green-50 rounded text-center">
            <div className="font-medium">Desktop</div>
            <div className="text-gray-600">&gt; 1024px</div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>실시간 디바이스 타입 감지</li>
            <li>반응형 레이아웃 제어</li>
            <li>조건부 컴포넌트 렌더링</li>
            <li>성능 최적화</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `useDeviceType 훅을 사용한 반응형 디바이스 타입 감지 예시입니다.

## 실제 구현 코드

### 기본 사용법
\`\`\`tsx
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
\`\`\`

### 조건부 렌더링과 스타일링
\`\`\`tsx
import { useDeviceType } from '@team-semicolon/community-core';

function AdaptiveNavigation() {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  return (
    <nav className={\`navigation \${isMobile ? 'mobile' : 'desktop'}\`}>
      {isMobile ? (
        <HamburgerMenu />
      ) : (
        <HorizontalMenu />
      )}
      
      <div 
        style={{
          fontSize: deviceType === 'mobile' ? '14px' : '16px',
          padding: deviceType === 'desktop' ? '20px' : '10px'
        }}
      >
        반응형 콘텐츠
      </div>
    </nav>
  );
}
\`\`\`

### 이미지 최적화
\`\`\`tsx
import { useDeviceType } from '@team-semicolon/community-core';

function OptimizedImage({ src, alt }) {
  const deviceType = useDeviceType();
  
  const getImageSize = () => {
    switch (deviceType) {
      case 'mobile': return { width: 320, height: 200 };
      case 'tablet': return { width: 640, height: 400 };
      case 'desktop': return { width: 1200, height: 600 };
      default: return { width: 640, height: 400 };
    }
  };
  
  const { width, height } = getImageSize();
  
  return (
    <img 
      src={\`\${src}?w=\${width}&h=\${height}\`}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
\`\`\``,
      },
    },
  },
};

// React Query 훅 예시
export const ReactQueryExample: Story = {
  render: () => {
    const [boardId, setBoardId] = useState(1);
    const [page, setPage] = useState(1);
    const [enabled, setEnabled] = useState(true);
    
    const { data, isLoading, error } = usePostQueryMock({
      boardId,
      page,
      enabled,
    });
    
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">usePostQuery 훅 예시</h3>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">게시판:</label>
            <select 
              value={boardId} 
              onChange={(e) => setBoardId(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={1}>자유게시판</option>
              <option value={2}>질문게시판</option>
              <option value={3}>공지사항</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">페이지:</label>
            <select 
              value={page} 
              onChange={(e) => setPage(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {[1,2,3,4,5].map(p => (
                <option key={p} value={p}>페이지 {p}</option>
              ))}
            </select>
          </div>
          
          <Button
            size="sm"
            variant={enabled ? 'success' : 'outline'}
            onClick={() => setEnabled(!enabled)}
          >
            {enabled ? '쿼리 활성' : '쿼리 비활성'}
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium">상태:</span>
            <Badge variant={isLoading ? 'warning' : error ? 'error' : 'success'}>
              {isLoading ? '로딩 중' : error ? '에러' : '성공'}
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data?.data?.items ? (
            <div className="space-y-2">
              {data.data.items.map((post: any) => (
                <div key={post.id} className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm">{post.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">작성자: {post.author}</p>
                </div>
              ))}
              <div className="text-xs text-gray-500 mt-2">
                총 {data.data.totalCount}개의 게시글
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">데이터가 없습니다</div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>자동 캐싱 및 리페칭</li>
            <li>로딩/에러 상태 관리</li>
            <li>백그라운드 업데이트</li>
            <li>조건부 쿼리 실행</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `usePostQuery 훅을 사용한 React Query 기반 데이터 페칭 예시입니다.

## 실제 구현 코드

### 기본 사용법
\`\`\`tsx
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
\`\`\`

### 조건부 쿼리와 의존성
\`\`\`tsx
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
\`\`\`

### 에러 처리와 재시도
\`\`\`tsx
import { usePostQuery } from '@team-semicolon/community-core';

function RobustPostList() {
  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    isRefetching,
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
        <p>게시글을 불러오는데 실패했습니다.</p>
        <p>오류: {error?.message}</p>
        <button onClick={() => refetch()} disabled={isRefetching}>
          {isRefetching ? '재시도 중...' : '다시 시도'}
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {data?.items?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\``,
      },
    },
  },
};

// 종합 사용 예시
export const CombinedExample: Story = {
  render: () => {
    const { user, isLoggedIn, loginWithLoader } = useAuthMock();
    const { withLoader } = useGlobalLoaderMock();
    const deviceType = useDeviceTypeMock();
    
    const handleAction = async () => {
      if (!isLoggedIn) {
        await loginWithLoader({ email: 'test@example.com', password: 'password' });
      } else {
        await withLoader(async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          alert('작업 완료!');
        });
      }
    };
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">통합 사용 예시</h3>
        
        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">디바이스:</span>
            <Badge variant="info">{deviceType}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">인증 상태:</span>
            <Badge variant={isLoggedIn ? 'success' : 'error'}>
              {isLoggedIn ? '인증됨' : '미인증'}
            </Badge>
          </div>
          
          {user && (
            <div className="text-sm text-gray-600">
              <p>사용자: {user.name}</p>
            </div>
          )}
          
          <Button onClick={handleAction} fullWidth>
            {isLoggedIn ? '데이터 처리' : '로그인'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>통합된 기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>인증 상태 기반 UI 제어</li>
            <li>디바이스별 최적화</li>
            <li>자동 로딩 관리</li>
            <li>상태별 피드백 제공</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '여러 훅을 함께 사용한 실제 사용 사례 예시입니다.',
      },
    },
  },
};