# NotificationHooks 사용 가이드

**@team-semicolon/community-core**의 NotificationHooks는 알림 시스템을 위한 React Query 기반 훅들을 제공합니다.

## 📋 제공하는 훅들

### 🔔 useNotificationsQuery
사용자 알림 목록 조회

### ✅ useMarkNotificationReadCommand  
알림을 읽음 상태로 변경

### 🗑️ useDeleteNotificationCommand
알림 삭제

### 📊 useNotificationStatsQuery
읽지 않은 알림 개수 등 통계 조회

## 🚀 실제 구현 예시

### 1. 기본 알림 센터 구현

```tsx
import { 
  useNotificationsQuery,
  useMarkNotificationReadCommand,
  useDeleteNotificationCommand 
} from '@team-semicolon/community-core';

function NotificationCenter({ userId }) {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  // 알림 목록 조회
  const { 
    data: notifications, 
    isLoading, 
    error,
    refetch 
  } = useNotificationsQuery({
    userId,
    filter,
    enabled: !!userId
  });
  
  // 알림 읽음 처리
  const { mutate: markAsRead } = useMarkNotificationReadCommand({
    onSuccess: () => {
      refetch();
    }
  });
  
  // 알림 삭제
  const { mutate: deleteNotification } = useDeleteNotificationCommand({
    onSuccess: () => {
      refetch();
    }
  });
  
  const handleNotificationClick = (notification) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.is_read) {
      markAsRead({ notificationId: notification.id });
    }
    
    // 알림과 관련된 페이지로 이동
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };
  
  const handleDelete = (notificationId, e) => {
    e.stopPropagation();
    
    if (confirm('이 알림을 삭제하시겠습니까?')) {
      deleteNotification({ notificationId });
    }
  };
  
  if (isLoading) return <div>알림을 불러오는 중...</div>;
  if (error) return <div>알림 로딩 실패: {error.message}</div>;
  
  return (
    <div className="notification-center">
      {/* 필터 탭 */}
      <div className="notification-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          전체 ({notifications?.total || 0})
        </button>
        <button 
          className={filter === 'unread' ? 'active' : ''}
          onClick={() => setFilter('unread')}
        >
          읽지 않음 ({notifications?.unreadCount || 0})
        </button>
        <button 
          className={filter === 'read' ? 'active' : ''}
          onClick={() => setFilter('read')}
        >
          읽음
        </button>
      </div>
      
      {/* 알림 목록 */}
      <div className="notification-list">
        {notifications?.items?.length === 0 ? (
          <div className="no-notifications">
            {filter === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
          </div>
        ) : (
          notifications?.items?.map((notification) => (
            <div
              key={notification.id}
              className={'notification-item ' + (!notification.is_read ? 'unread' : '')}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">
                  {formatNotificationTime(notification.created_at)}
                </div>
              </div>
              
              <div className="notification-actions">
                {!notification.is_read && (
                  <div className="unread-dot"></div>
                )}
                <button
                  className="delete-btn"
                  onClick={(e) => handleDelete(notification.id, e)}
                  title="삭제"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 페이지네이션 */}
      {notifications?.totalPages > 1 && (
        <div className="notification-pagination">
          {/* 페이지네이션 구현 */}
        </div>
      )}
    </div>
  );
}

// 알림 타입별 아이콘 반환
function getNotificationIcon(type) {
  const icons = {
    'comment': '💬',
    'like': '❤️',
    'follow': '👥',
    'system': '🔔',
    'achievement': '🏆',
    'message': '📩'
  };
  return icons[type] || '🔔';
}
```

### 2. 실시간 알림 토스트 시스템

```tsx
import { 
  useNotificationsQuery,
  useNotificationStatsQuery 
} from '@team-semicolon/community-core';
import { toast } from 'react-toastify';

function NotificationToastProvider({ userId, children }) {
  const [lastNotificationId, setLastNotificationId] = useState(null);
  
  // 실시간으로 최신 알림 체크
  const { data: latestNotifications } = useNotificationsQuery({
    userId,
    filter: 'unread',
    limit: 1,
    refetchInterval: 30000, // 30초마다 체크
    enabled: !!userId
  });
  
  // 새 알림이 도착했는지 확인
  useEffect(() => {
    if (!latestNotifications?.items?.length) return;
    
    const latestNotification = latestNotifications.items[0];
    
    // 이전에 표시하지 않은 새 알림인지 확인
    if (latestNotification.id !== lastNotificationId) {
      showNotificationToast(latestNotification);
      setLastNotificationId(latestNotification.id);
    }
  }, [latestNotifications, lastNotificationId]);
  
  const showNotificationToast = (notification) => {
    toast(
      <NotificationToast 
        notification={notification}
        onClick={() => handleToastClick(notification)}
      />,
      {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };
  
  const handleToastClick = (notification) => {
    // 알림 클릭 시 해당 페이지로 이동
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
    
    // 읽음 처리는 실제 알림 센터에서 처리
  };
  
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

// 알림 토스트 컴포넌트
function NotificationToast({ notification, onClick }) {
  return (
    <div className="notification-toast" onClick={onClick}>
      <div className="toast-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="toast-content">
        <div className="toast-title">{notification.title}</div>
        <div className="toast-message">{notification.message}</div>
      </div>
    </div>
  );
}
```

### 3. 헤더 알림 벨 아이콘 구현

```tsx
import { 
  useNotificationStatsQuery,
  useNotificationsQuery 
} from '@team-semicolon/community-core';

function NotificationBell({ userId }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 읽지 않은 알림 개수
  const { data: stats } = useNotificationStatsQuery({
    userId,
    enabled: !!userId,
    refetchInterval: 60000, // 1분마다 갱신
  });
  
  // 최근 알림 미리보기 (드롭다운용)
  const { data: recentNotifications } = useNotificationsQuery({
    userId,
    limit: 5,
    enabled: !!userId && isDropdownOpen
  });
  
  const unreadCount = stats?.unreadCount || 0;
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleNotificationClick = (notification) => {
    setIsDropdownOpen(false);
    
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  };
  
  return (
    <div className="notification-bell-container">
      {/* 알림 벨 아이콘 */}
      <button 
        className="notification-bell"
        onClick={toggleDropdown}
        title={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '알림'}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* 알림 드롭다운 */}
      {isDropdownOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h4>최근 알림</h4>
            <a href="/notifications">전체보기</a>
          </div>
          
          <div className="dropdown-notifications">
            {recentNotifications?.items?.length === 0 ? (
              <div className="no-notifications">새 알림이 없습니다</div>
            ) : (
              recentNotifications?.items?.map((notification) => (
                <div
                  key={notification.id}
                  className={'dropdown-notification ' + (!notification.is_read ? 'unread' : '')}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-time">
                      {formatNotificationTime(notification.created_at)}
                    </div>
                  </div>
                  {!notification.is_read && <div className="unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
          
          {recentNotifications?.items?.length > 0 && (
            <div className="dropdown-footer">
              <a href="/notifications">모든 알림 보기</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 4. 알림 설정 관리

```tsx
import { 
  useNotificationSettingsQuery,
  useUpdateNotificationSettingsCommand 
} from '@team-semicolon/community-core';

function NotificationSettings({ userId }) {
  const { 
    data: settings, 
    isLoading 
  } = useNotificationSettingsQuery({
    userId,
    enabled: !!userId
  });
  
  const { mutate: updateSettings } = useUpdateNotificationSettingsCommand({
    onSuccess: () => {
      toast.success('알림 설정이 저장되었습니다');
    },
    onError: (error) => {
      toast.error('설정 저장 실패: ' + error.message);
    }
  });
  
  const handleSettingChange = (type, method, enabled) => {
    updateSettings({
      userId,
      settings: {
        ...settings,
        [type]: {
          ...settings[type],
          [method]: enabled
        }
      }
    });
  };
  
  if (isLoading) return <div>설정을 불러오는 중...</div>;
  
  const notificationTypes = [
    { key: 'comment', label: '댓글 알림', description: '내 글에 댓글이 달렸을 때' },
    { key: 'like', label: '좋아요 알림', description: '내 글에 좋아요를 받았을 때' },
    { key: 'follow', label: '팔로우 알림', description: '다른 사용자가 나를 팔로우했을 때' },
    { key: 'message', label: '메시지 알림', description: '새 메시지를 받았을 때' },
    { key: 'system', label: '시스템 알림', description: '중요한 공지사항이 있을 때' }
  ];
  
  const methods = [
    { key: 'web', label: '웹 알림' },
    { key: 'email', label: '이메일 알림' },
    { key: 'push', label: '푸시 알림' }
  ];
  
  return (
    <div className="notification-settings">
      <h2>알림 설정</h2>
      
      <div className="settings-table">
        <div className="table-header">
          <div className="type-column">알림 유형</div>
          {methods.map(method => (
            <div key={method.key} className="method-column">
              {method.label}
            </div>
          ))}
        </div>
        
        {notificationTypes.map(type => (
          <div key={type.key} className="settings-row">
            <div className="type-info">
              <div className="type-label">{type.label}</div>
              <div className="type-description">{type.description}</div>
            </div>
            
            {methods.map(method => (
              <div key={method.key} className="method-toggle">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings?.[type.key]?.[method.key] || false}
                    onChange={(e) => handleSettingChange(
                      type.key, 
                      method.key, 
                      e.target.checked
                    )}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* 글로벌 설정 */}
      <div className="global-settings">
        <h3>전체 설정</h3>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings?.globalSettings?.enabled || false}
            onChange={(e) => handleSettingChange(
              'globalSettings', 
              'enabled', 
              e.target.checked
            )}
          />
          모든 알림 받기
        </label>
        
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings?.globalSettings?.doNotDisturb || false}
            onChange={(e) => handleSettingChange(
              'globalSettings', 
              'doNotDisturb', 
              e.target.checked
            )}
          />
          방해 금지 모드 (오후 10시 ~ 오전 8시)
        </label>
      </div>
    </div>
  );
}
```

### 5. 알림 기반 푸시 알림 구현

```tsx
import { 
  useNotificationsQuery,
  useRegisterPushTokenCommand 
} from '@team-semicolon/community-core';

function PushNotificationManager({ userId }) {
  const [pushPermission, setPushPermission] = useState('default');
  const [isRegistered, setIsRegistered] = useState(false);
  
  const { mutate: registerPushToken } = useRegisterPushTokenCommand({
    onSuccess: () => {
      setIsRegistered(true);
      toast.success('푸시 알림이 활성화되었습니다');
    },
    onError: (error) => {
      toast.error('푸시 알림 설정 실패: ' + error.message);
    }
  });
  
  useEffect(() => {
    // 브라우저 알림 권한 확인
    if ('Notification' in window) {
      setPushPermission(Notification.permission);
    }
  }, []);
  
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('이 브라우저는 알림을 지원하지 않습니다');
      return;
    }
    
    const permission = await Notification.requestPermission();
    setPushPermission(permission);
    
    if (permission === 'granted') {
      await registerForPushNotifications();
    }
  };
  
  const registerForPushNotifications = async () => {
    try {
      // Service Worker 등록
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Push 구독
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      // 서버에 토큰 등록
      registerPushToken({
        userId,
        subscription: JSON.stringify(subscription),
        device: navigator.userAgent
      });
      
    } catch (error) {
      console.error('Push notification registration failed:', error);
      toast.error('푸시 알림 등록에 실패했습니다');
    }
  };
  
  // 새 알림이 왔을 때 브라우저 알림 표시
  const { data: latestNotifications } = useNotificationsQuery({
    userId,
    filter: 'unread',
    limit: 1,
    refetchInterval: 30000,
    enabled: !!userId && pushPermission === 'granted'
  });
  
  useEffect(() => {
    if (latestNotifications?.items?.length && pushPermission === 'granted') {
      const notification = latestNotifications.items[0];
      
      // 브라우저 알림 표시
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        tag: notification.id,
        data: {
          url: notification.action_url
        }
      }).onclick = function() {
        window.focus();
        if (this.data.url) {
          window.location.href = this.data.url;
        }
        this.close();
      };
    }
  }, [latestNotifications, pushPermission]);
  
  return (
    <div className="push-notification-manager">
      <h3>푸시 알림 설정</h3>
      
      <div className="push-status">
        <div className="status-info">
          <span>현재 상태: </span>
          <span className={'status ' + pushPermission}>
            {pushPermission === 'granted' ? '✅ 활성화' : 
             pushPermission === 'denied' ? '❌ 비활성화' : 
             '⏳ 설정 필요'}
          </span>
        </div>
        
        {pushPermission === 'default' && (
          <button 
            onClick={requestNotificationPermission}
            className="enable-push-btn"
          >
            푸시 알림 활성화
          </button>
        )}
        
        {pushPermission === 'denied' && (
          <div className="permission-denied-info">
            브라우저 설정에서 알림을 허용해주세요.
          </div>
        )}
        
        {pushPermission === 'granted' && isRegistered && (
          <div className="registration-success">
            푸시 알림이 활성화되었습니다!
          </div>
        )}
      </div>
    </div>
  );
}
```

## 💡 사용 팁

### 1. 알림 캐싱 최적화
```tsx
// 읽지 않은 알림 개수는 자주 업데이트되므로 짧은 캐시 시간 설정
const { data: stats } = useNotificationStatsQuery({
  userId,
  staleTime: 30000, // 30초
  cacheTime: 60000,  // 1분
});
```

### 2. 실시간 업데이트 구현
```tsx
// WebSocket이나 Server-Sent Events로 실시간 알림 구현
useEffect(() => {
  const eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`);
  
  eventSource.onmessage = (event) => {
    const newNotification = JSON.parse(event.data);
    
    // React Query 캐시 업데이트
    queryClient.setQueryData(['notifications', userId], (oldData) => ({
      ...oldData,
      items: [newNotification, ...oldData.items]
    }));
    
    // 토스트 알림 표시
    showNotificationToast(newNotification);
  };
  
  return () => eventSource.close();
}, [userId]);
```

### 3. 배치 알림 읽음 처리
```tsx
const { mutate: markMultipleAsRead } = useMarkMultipleNotificationsReadCommand({
  onSuccess: () => {
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['notification-stats']);
  }
});

const markAllAsRead = () => {
  const unreadNotifications = notifications.items
    .filter(n => !n.is_read)
    .map(n => n.id);
    
  markMultipleAsRead({ notificationIds: unreadNotifications });
};
```

## ⚠️ 주의사항

1. **권한 관리**: 브라우저 푸시 알림 권한은 사용자가 직접 허용해야 합니다
2. **성능 최적화**: 알림 목록이 많을 경우 가상 스크롤이나 페이지네이션 구현이 필요합니다
3. **실시간 동기화**: 여러 탭이나 기기에서 읽음 상태 동기화를 위해 WebSocket 또는 폴링 사용
4. **배터리 최적화**: 모바일에서는 과도한 실시간 업데이트가 배터리를 소모할 수 있습니다

## 🔗 관련 훅들

- **useMessagesQuery**: 메시지 알림과 연동
- **useAuth**: 사용자별 알림 관리
- **useGlobalLoader**: 알림 작업 시 로딩 표시
- **useDeviceType**: 모바일/데스크톱별 알림 UI 최적화