import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

// Mock useGlobalLoader hook (실제로는 @team-semicolon/community-core에서 import)
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
    showLoader: (text?: string) => {
      setIsLoading(true);
      console.log('Show loader:', text);
    },
    hideLoader: () => {
      setIsLoading(false);
      console.log('Hide loader');
    },
    isLoading,
  };
};

// Mock useAuth hook
const useAuthMock = () => {
  const [user, setUser] = useState<any>(null);
  
  return {
    user,
    isLoggedIn: !!user,
    login: async (credentials: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ name: '김철수', level: 5 });
    },
    logout: () => {
      setUser(null);
    },
  };
};

// Mock usePermission hook
const usePermissionMock = (props: { requiredLevel?: number }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Simulate permission check
  setTimeout(() => {
    setHasPermission(true);
    setLoading(false);
  }, 500);
  
  return { hasPermission, loading };
};

const meta: Meta = {
  title: 'Hooks/LoaderHooks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Loader Hooks**는 @team-semicolon/community-core 패키지에서 제공하는 로딩 상태 관리 훅들입니다.

## 주요 특징
- **useGlobalLoader**: 전역 로딩 상태 관리
- **withLoader**: Promise를 래핑하여 자동 로딩 처리
- **showLoader/hideLoader**: 수동 로딩 상태 제어

## 실제 사용법
\`\`\`typescript
import { useGlobalLoader } from '@team-semicolon/community-core';

const { withLoader, showLoader, hideLoader } = useGlobalLoader();

// 자동 로딩 처리
await withLoader(async () => {
  await fetchData();
});

// 수동 로딩 제어
showLoader('데이터 로딩 중...');
await fetchData();
hideLoader();
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// useGlobalLoader 기본 사용법
export const BasicLoader: Story = {
  render: () => {
    const { withLoader, showLoader, hideLoader, isLoading } = useGlobalLoaderMock();
    
    const handleAsyncOperation = async () => {
      await withLoader(async () => {
        // 시뮬레이션: API 호출
        await new Promise(resolve => setTimeout(resolve, 2000));
      });
    };
    
    const handleManualLoader = async () => {
      showLoader('수동 로딩 중...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      hideLoader();
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>로딩 상태:</span>
          <Badge variant={isLoading ? 'warning' : 'success'}>
            {isLoading ? '로딩 중' : '완료'}
          </Badge>
        </div>
        
        <div className="space-x-2">
          <Button onClick={handleAsyncOperation} disabled={isLoading}>
            withLoader 사용
          </Button>
          <Button onClick={handleManualLoader} disabled={isLoading} variant="outline">
            수동 로더 제어
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• withLoader: Promise를 자동으로 래핑하여 로딩 처리</p>
          <p>• 수동 제어: showLoader/hideLoader로 직접 제어</p>
        </div>
      </div>
    );
  },
};

// useAuth 사용 예시
export const AuthHook: Story = {
  render: () => {
    const { user, isLoggedIn, login, logout } = useAuthMock();
    const { withLoader } = useGlobalLoaderMock();
    
    const handleLogin = async () => {
      await withLoader(async () => {
        await login({ username: 'user', password: 'pass' });
      });
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>인증 상태:</span>
          <Badge variant={isLoggedIn ? 'success' : 'default'}>
            {isLoggedIn ? '로그인됨' : '로그아웃됨'}
          </Badge>
          {user && <span className="text-sm text-gray-600">({user.name})</span>}
        </div>
        
        <div className="space-x-2">
          {!isLoggedIn ? (
            <Button onClick={handleLogin}>로그인</Button>
          ) : (
            <Button onClick={logout} variant="outline">로그아웃</Button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• useAuth: 인증 상태와 로그인/로그아웃 기능 제공</p>
          <p>• 자동으로 사용자 정보를 Redux store에 저장</p>
        </div>
      </div>
    );
  },
};

// usePermission 사용 예시
export const PermissionHook: Story = {
  render: () => {
    const { hasPermission, loading } = usePermissionMock({ requiredLevel: 5 });
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span>권한 확인:</span>
          <Badge variant={loading ? 'warning' : hasPermission ? 'success' : 'error'}>
            {loading ? '확인 중' : hasPermission ? '권한 있음' : '권한 없음'}
          </Badge>
        </div>
        
        <div className="space-x-2">
          <Button disabled={loading || !hasPermission}>
            레벨 5 필요한 작업
          </Button>
          <Button variant="outline" disabled={!hasPermission}>
            권한 기반 버튼
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• usePermission: 사용자의 권한 레벨 확인</p>
          <p>• requiredLevel prop으로 필요 레벨 지정</p>
          <p>• 자동으로 로딩 상태 관리</p>
        </div>
      </div>
    );
  },
};

// 복합 사용 예시
export const CombinedExample: Story = {
  render: () => {
    const { user, isLoggedIn } = useAuthMock();
    const { hasPermission, loading: permissionLoading } = usePermissionMock({ requiredLevel: 3 });
    const { withLoader, isLoading } = useGlobalLoaderMock();
    
    const handleProtectedAction = async () => {
      if (!isLoggedIn) {
        alert('로그인이 필요합니다');
        return;
      }
      
      if (!hasPermission) {
        alert('권한이 없습니다');
        return;
      }
      
      await withLoader(async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert('작업이 완료되었습니다!');
      });
    };
    
    const canPerformAction = isLoggedIn && hasPermission && !permissionLoading;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm font-medium mb-1">로그인</div>
            <Badge variant={isLoggedIn ? 'success' : 'error'}>
              {isLoggedIn ? '완료' : '필요'}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium mb-1">권한 (Lv.3)</div>
            <Badge variant={permissionLoading ? 'warning' : hasPermission ? 'success' : 'error'}>
              {permissionLoading ? '확인 중' : hasPermission ? '충족' : '부족'}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium mb-1">작업</div>
            <Badge variant={isLoading ? 'warning' : canPerformAction ? 'info' : 'default'}>
              {isLoading ? '실행 중' : canPerformAction ? '준비됨' : '대기'}
            </Badge>
          </div>
        </div>
        
        <Button 
          onClick={handleProtectedAction}
          disabled={!canPerformAction || isLoading}
          loading={isLoading}
          fullWidth
        >
          보호된 작업 실행
        </Button>
        
        <div className="text-sm text-gray-600">
          <p>• 인증, 권한, 로딩 상태를 모두 조합한 실제 사용 예시</p>
          <p>• 모든 조건이 충족되어야 작업 실행 가능</p>
        </div>
      </div>
    );
  },
};