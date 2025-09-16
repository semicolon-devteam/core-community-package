import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
// UI 컴포넌트는 직접 구현 (코어 패키지에서 제거됨)

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
        
## 실제 구현 코드 예시

### 기본 withLoader 사용법
\`\`\`tsx
import { useGlobalLoader } from '@team-semicolon/community-core';

function DataSubmissionForm() {
  const { withLoader } = useGlobalLoader();
  const [formData, setFormData] = useState({ title: '', content: '' });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await withLoader(async () => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ title: '', content: '' });
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
\`\`\`

### 수동 로더 제어 (showLoader/hideLoader)
\`\`\`tsx
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
          showLoader(\`파일 업로드 중... \${progress}%\`);
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
\`\`\`

### 훅을 조합한 사용
\`\`\`tsx
import { useGlobalLoader, useAuth } from '@team-semicolon/community-core';

function AuthenticatedAction() {
  const { withLoader } = useGlobalLoader();
  const { loginWithLoader, isLoggedIn } = useAuth();
  
  const handleSecureAction = async () => {
    if (!isLoggedIn) {
      // 로그인이 필요한 경우 자동 로그인
      await loginWithLoader({ 
        email: 'user@example.com', 
        password: 'password' 
      });
    }
    
    // 로그인 후 보안 작업 수행
    await withLoader(async () => {
      const response = await fetch('/api/secure-action', {
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`
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
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 문서 스토리 (최상단 배치)
export const Docs: Story = {
  render: () => (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>LoaderHooks 사용 가이드</h1>
      <p><strong>@team-semicolon/community-core</strong>의 LoaderHooks는 전역 로딩 상태 관리와 사용자 인증/권한을 위한 훅들을 제공합니다.</p>
      
      <h2>📋 제공하는 훅들</h2>
      <ul>
        <li><strong>🔄 useGlobalLoader</strong>: 전역 로딩 인디케이터 관리 훅</li>
        <li><strong>🔐 useAuth</strong>: 사용자 인증 상태 및 로그인/로그아웃 기능</li>
        <li><strong>🛡️ usePermission</strong>: 사용자 권한 레벨 확인</li>
      </ul>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3>📚 완전한 사용 가이드</h3>
        <p>실제 구현 코드 예시와 상세한 사용법은 별도 문서를 참고하세요:</p>
        <a 
          href="https://github.com/semicolon-labs/community-core/blob/main/storybook/src/stories/hooks/LoaderHooks.md" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: '#0066cc', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          📖 LoaderHooks 완전한 사용 가이드 보기
        </a>
      </div>
      
      <h3>🚀 주요 패턴</h3>
      <div style={{ marginTop: '1rem' }}>
        <h4>1. useGlobalLoader - withLoader 패턴</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`const { withLoader } = useGlobalLoader();

const handleSubmit = async () => {
  await withLoader(async () => {
    const response = await fetch('/api/submit', { ... });
    // 자동으로 로딩 시작/종료
  });
};`}
        </pre>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>2. useAuth - 인증 상태 관리</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`const { user, isLoggedIn, loginWithLoader } = useAuth();

if (!isLoggedIn) {
  return <LoginForm onLogin={loginWithLoader} />;
}

return <WelcomeUser user={user} />;`}
        </pre>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>3. usePermission - 권한 기반 UI</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`const { hasPermission } = usePermission({ requiredLevel: 5 });

return (
  <div>
    {hasPermission ? (
      <AdminPanel />
    ) : (
      <AccessDenied />
    )}
  </div>
);`}
        </pre>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '완전한 LoaderHooks 사용 가이드입니다. 실제 구현 코드와 베스트 프랙티스를 포함합니다.'
      }
    }
  }
};

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
          <span className={'px-2 py-0.5 text-xs rounded ' + (isLoading ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
            {isLoading ? '로딩 중' : '완료'}
          </span>
        </div>
        
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={handleAsyncOperation}
            disabled={isLoading}
          >
            withLoader 사용
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            onClick={handleManualLoader}
            disabled={isLoading}
          >
            수동 로더 제어
          </button>
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
          <span className={'px-2 py-0.5 text-xs rounded ' + (isLoggedIn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700')}>
            {isLoggedIn ? '로그인됨' : '로그아웃됨'}
          </span>
          {user && <span className="text-sm text-gray-600">({user.name})</span>}
        </div>
        
        <div className="space-x-2">
          {!isLoggedIn ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleLogin}
            >
              로그인
            </button>
          ) : (
            <button
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              onClick={logout}
            >
              로그아웃
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• useAuth: 인증 상태와 로그인/로그아웃 기능 제공</p>
          <p>• 자동으로 사용자 정보를 Redux store에 저장</p>
          <p>• loginWithLoader는 자동으로 로딩 상태를 처리</p>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
          <strong>구현 팁:</strong> useAuth는 Redux와 연동되며, loginWithLoader 사용 시 전역 로더와 토스트 메시지가 자동으로 처리됩니다.
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
          <span className={'px-2 py-0.5 text-xs rounded ' +
            (loading ? 'bg-yellow-100 text-yellow-700' :
             hasPermission ? 'bg-green-100 text-green-700' :
             'bg-red-100 text-red-700')}>
            {loading ? '확인 중' : hasPermission ? '권한 있음' : '권한 없음'}
          </span>
        </div>
        
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !hasPermission}
          >
            레벨 5 필요한 작업
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            disabled={!hasPermission}
          >
            권한 기반 버튼
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>• usePermission: 사용자의 권한 레벨 확인</p>
          <p>• requiredLevel prop으로 필요 레벨 지정</p>
          <p>• 자동으로 로딩 상태 관리</p>
        </div>
        
        <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
          <strong>구현 팁:</strong> usePermission은 사용자의 level 값과 requiredLevel을 비교하여 권한을 판단합니다. adminOnly 옵션도 지원합니다.
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
            <span className={'px-2 py-0.5 text-xs rounded ' + (isLoggedIn ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
              {isLoggedIn ? '완료' : '필요'}
            </span>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium mb-1">권한 (Lv.3)</div>
            <span className={'px-2 py-0.5 text-xs rounded ' +
              (permissionLoading ? 'bg-yellow-100 text-yellow-700' :
               hasPermission ? 'bg-green-100 text-green-700' :
               'bg-red-100 text-red-700')}>
              {permissionLoading ? '확인 중' : hasPermission ? '충족' : '부족'}
            </span>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium mb-1">작업</div>
            <span className={'px-2 py-0.5 text-xs rounded ' +
              (isLoading ? 'bg-yellow-100 text-yellow-700' :
               canPerformAction ? 'bg-blue-100 text-blue-700' :
               'bg-gray-100 text-gray-700')}>
              {isLoading ? '실행 중' : canPerformAction ? '준비됨' : '대기'}
            </span>
          </div>
        </div>
        
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleProtectedAction}
          disabled={!canPerformAction || isLoading}
        >
          {isLoading ? '실행 중...' : '보호된 작업 실행'}
        </button>
        
        <div className="text-sm text-gray-600">
          <p>• 인증, 권한, 로딩 상태를 모두 조합한 실제 사용 예시</p>
          <p>• 모든 조건이 충족되어야 작업 실행 가능</p>
        </div>
        
        <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-700">
          <strong>실제 사용 예시:</strong> 이런 패턴은 관리자 전용 기능, VIP 사용자 전용 콘텐츠 등에서 활용할 수 있습니다.
        </div>
      </div>
    );
  },
};
