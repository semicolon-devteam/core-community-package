# LoaderHooks 사용 가이드

**@team-semicolon/community-core**의 LoaderHooks는 전역 로딩 상태 관리와 사용자 인증/권한을 위한 훅들을 제공합니다.

## 📋 제공하는 훅들

### 🔄 useGlobalLoader
전역 로딩 인디케이터 관리 훅

### 🔐 useAuth  
사용자 인증 상태 및 로그인/로그아웃 기능

### 🛡️ usePermission
사용자 권한 레벨 확인

## 🚀 실제 구현 예시

### 1. useGlobalLoader - 기본 사용법

```tsx
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
```

### 2. useGlobalLoader - 수동 제어

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

### 3. useAuth - 인증 상태 관리

```tsx
import { useAuth } from '@team-semicolon/community-core';

function AuthenticationComponent() {
  const { user, isLoggedIn, loginWithLoader, logoutWithLoader } = useAuth();
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await loginWithLoader(credentials);
      alert('로그인 성공!');
    } catch (error) {
      alert('로그인 실패: ' + error.message);
    }
  };
  
  const handleLogout = async () => {
    await logoutWithLoader();
    alert('로그아웃되었습니다.');
  };
  
  if (isLoggedIn) {
    return (
      <div>
        <h2>환영합니다, {user?.name}님!</h2>
        <p>레벨: {user?.level}</p>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="아이디"
        value={credentials.userId}
        onChange={(e) => setCredentials(prev => ({ ...prev, userId: e.target.value }))}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
      />
      <button type="submit">로그인</button>
    </form>
  );
}
```

### 4. usePermission - 권한 기반 UI

```tsx
import { useAuth, usePermission } from '@team-semicolon/community-core';

function ProtectedContent() {
  const { user } = useAuth();
  const { hasPermission, loading } = usePermission({ 
    requiredLevel: 5 
  });
  
  if (loading) {
    return <div>권한을 확인하는 중...</div>;
  }
  
  if (!hasPermission) {
    return (
      <div>
        <h3>접근 권한이 없습니다</h3>
        <p>이 콘텐츠를 보려면 레벨 5 이상이 필요합니다.</p>
        <p>현재 레벨: {user?.level || 0}</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2>VIP 전용 콘텐츠</h2>
      <p>축하합니다! 레벨 5 이상의 권한으로 특별 콘텐츠에 접근하셨습니다.</p>
    </div>
  );
}
```

### 5. 훅들을 조합한 실제 사용 예시

```tsx
import { useAuth, useGlobalLoader, usePermission } from '@team-semicolon/community-core';

function AdminPanel() {
  const { user, isLoggedIn } = useAuth();
  const { hasPermission, loading: permissionLoading } = usePermission({ 
    adminOnly: true 
  });
  const { withLoader } = useGlobalLoader();
  
  const handleAdminAction = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다');
      return;
    }
    
    if (!hasPermission) {
      alert('관리자 권한이 없습니다');
      return;
    }
    
    await withLoader(async () => {
      const response = await fetch('/api/admin/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('관리자 작업이 완료되었습니다!');
      }
    });
  };
  
  if (!isLoggedIn) {
    return <div>로그인이 필요합니다.</div>;
  }
  
  if (permissionLoading) {
    return <div>권한을 확인하는 중...</div>;
  }
  
  if (!hasPermission) {
    return <div>관리자 권한이 필요합니다.</div>;
  }
  
  return (
    <div>
      <h2>관리자 패널</h2>
      <p>관리자: {user?.name}</p>
      <button onClick={handleAdminAction}>
        관리자 작업 실행
      </button>
    </div>
  );
}
```

## 💡 사용 팁

### 로딩 상태 최적화
```tsx
// ✅ 권장: withLoader 사용
await withLoader(async () => {
  const data = await fetchData();
  processData(data);
});

// ❌ 비권장: 수동 로더 관리
showLoader();
try {
  const data = await fetchData();
  processData(data);
} finally {
  hideLoader(); // 에러 시 hideLoader가 실행되지 않을 수 있음
}
```

### 권한 체크 최적화
```tsx
// ✅ 권장: usePermission 훅 사용
const { hasPermission } = usePermission({ requiredLevel: 3 });

// ❌ 비권장: 직접 권한 체크
const hasPermission = user?.level >= 3;
```

### 인증 상태 확인
```tsx
// ✅ 권장: useAuth 훅 사용
const { isLoggedIn, user } = useAuth();

// ❌ 비권장: 직접 토큰 체크
const isLoggedIn = !!localStorage.getItem('token');
```

## ⚠️ 주의사항

1. **withLoader 사용 시**: 반드시 async 함수를 전달하세요
2. **권한 체크**: 클라이언트 측 권한 체크는 UI용이며, 서버 측 검증이 필요합니다
3. **로딩 상태**: 전역 로더는 하나만 존재하므로 중첩 호출 시 마지막 메시지가 표시됩니다
4. **에러 처리**: withLoader는 자동으로 에러를 처리하지만, 필요에 따라 try-catch를 추가하세요

## 🔗 관련 훅들

- **useRouterWithLoader**: 페이지 이동 시 로딩 표시
- **useAuthGuard**: 컴포넌트 레벨 권한 보호
- **useDeviceType**: 반응형 UI를 위한 기기 유형 감지