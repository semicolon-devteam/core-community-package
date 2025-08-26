import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Skeleton } from '@components/Skeleton';

// Mock 알림 데이터
const mockNotifications = [
  {
    id: '1',
    title: '새로운 댓글이 달렸습니다',
    body: '회원님의 게시글 "React 최적화 팁"에 새로운 댓글이 달렸습니다.',
    is_read: false,
    created_at: '2024-01-15T10:30:00Z',
    web_landing_url: '/posts/123',
  },
  {
    id: '2', 
    title: '포인트가 지급되었습니다',
    body: '출석체크로 10 포인트가 지급되었습니다.',
    is_read: false,
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: '3',
    title: '새로운 쪽지가 도착했습니다',
    body: '김철수님이 보낸 쪽지를 확인해보세요.',
    is_read: true,
    created_at: '2024-01-14T16:45:00Z',
    web_landing_url: '/messages/456',
  },
];

// Mock 훅들
const useNotificationsQueryMock = ({ page = 1, onlyUnread = false }: { page?: number; onlyUnread?: boolean } = {}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const filteredNotifications = onlyUnread 
        ? mockNotifications.filter(n => !n.is_read)
        : mockNotifications;
        
      setData({
        notifications: filteredNotifications,
        total_count: filteredNotifications.length,
        unread_count: mockNotifications.filter(n => !n.is_read).length,
        has_more: false,
        current_page: page,
        total_pages: 1,
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [page, onlyUnread]);
  
  return { data, isLoading, error: null };
};

const useUnreadNotificationCountQueryMock = () => {
  const [data, setData] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockNotifications.filter(n => !n.is_read).length);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { data, isLoading, error: null };
};

const useMarkNotificationAsReadCommandMock = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const mutate = async (notificationId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock: 해당 알림을 읽음으로 처리
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.is_read = true;
    }
    
    setIsLoading(false);
  };
  
  return { mutate, isLoading };
};

const useNotificationSettingsQueryMock = () => {
  const [data, setData] = useState({
    push_enabled: true,
    email_enabled: false,
    sms_enabled: false,
    comment_notifications: true,
    message_notifications: true,
    system_notifications: true,
    marketing_notifications: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { data, isLoading, error: null, setData };
};

// Storybook Meta
const meta: Meta = {
  title: 'Hooks/Notification',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**알림 시스템 훅 예제**

@team-semicolon/community-core에서 제공하는 알림 관련 훅들의 사용 예시를 보여줍니다.

## 포함된 훅들
- \`useNotificationsQuery\`: 알림 목록 조회
- \`useUnreadNotificationCountQuery\`: 읽지 않은 알림 개수
- \`useMarkNotificationAsReadCommand\`: 알림 읽음 처리
- \`useNotificationSettingsQuery\`: 알림 설정 관리

## 사용법
\`\`\`tsx
import { 
  useNotificationsQuery, 
  useUnreadNotificationCountQuery,
  useMarkNotificationAsReadCommand 
} from '@team-semicolon/community-core';

const { data: notifications } = useNotificationsQuery({ page: 1 });
const { data: unreadCount } = useUnreadNotificationCountQuery();
const { mutate: markAsRead } = useMarkNotificationAsReadCommand();
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// 알림 목록 조회 훅 예시
export const NotificationListExample: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [onlyUnread, setOnlyUnread] = useState(false);
    
    const { data, isLoading } = useNotificationsQueryMock({ page, onlyUnread });
    const { mutate: markAsRead, isLoading: isMarking } = useMarkNotificationAsReadCommandMock();
    
    const handleMarkAsRead = async (notificationId: string) => {
      await markAsRead(notificationId);
      // 실제로는 queryClient.invalidateQueries로 자동 업데이트됨
    };
    
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">useNotificationsQuery 훅 예시</h3>
        
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={onlyUnread ? 'primary' : 'outline'}
            onClick={() => setOnlyUnread(!onlyUnread)}
          >
            {onlyUnread ? '전체 보기' : '읽지 않음만'}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(p => p === 1 ? 2 : 1)}
          >
            페이지 {page === 1 ? 2 : 1}로 이동
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2" />
                  <div className="flex-1">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-full h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data?.notifications ? (
            <div className="space-y-3">
              {data.notifications.map((notification: any) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.is_read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.is_read && (
                          <Badge variant="primary" size="sm">NEW</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    
                    {!notification.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        loading={isMarking}
                        disabled={isMarking}
                      >
                        읽음 처리
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="text-sm text-gray-500 text-center pt-2 border-t">
                총 {data.total_count}개 알림 (읽지 않음: {data.unread_count}개)
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              알림이 없습니다
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>자동 캐싱 및 백그라운드 새로고침</li>
            <li>읽음/안읽음 필터링</li>
            <li>페이지네이션 지원</li>
            <li>실시간 카운트 업데이트</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'useNotificationsQuery 훅을 사용한 알림 목록 조회 및 관리 예시입니다.',
      },
    },
  },
};

// 읽지 않은 알림 개수 훅 예시
export const UnreadCountExample: Story = {
  render: () => {
    const { data: unreadCount, isLoading } = useUnreadNotificationCountQueryMock();
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">useUnreadNotificationCountQuery 훅 예시</h3>
        
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <div className="relative inline-block">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              🔔 알림
            </Button>
            
            {!isLoading && unreadCount > 0 && (
              <Badge 
                variant="error" 
                size="sm"
                className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {isLoading ? (
              <Skeleton className="w-32 h-4 mx-auto" />
            ) : (
              <p>읽지 않은 알림: <strong>{unreadCount}개</strong></p>
            )}
          </div>
          
          {showDetails && (
            <div className="mt-3 p-3 bg-white rounded border text-left">
              <p className="text-xs text-gray-500 mb-2">실시간 업데이트:</p>
              <ul className="text-xs space-y-1">
                <li>• 30초마다 자동 새로고침</li>
                <li>• 창 포커스 시 즉시 업데이트</li>
                <li>• 1분간 캐시 유지</li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>주요 기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>실시간 개수 업데이트 (30초 간격)</li>
            <li>UI 배지 컴포넌트와 완벽 호환</li>
            <li>자동 캐싱으로 성능 최적화</li>
            <li>읽음 처리 시 자동 카운트 감소</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'useUnreadNotificationCountQuery 훅을 사용한 실시간 알림 개수 표시 예시입니다.',
      },
    },
  },
};

// 알림 설정 관리 훅 예시
export const NotificationSettingsExample: Story = {
  render: () => {
    const { data: settings, isLoading, setData } = useNotificationSettingsQueryMock();
    const [isUpdating, setIsUpdating] = useState(false);
    
    const updateSetting = async (key: string, value: boolean) => {
      setIsUpdating(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData((prev: any) => ({
        ...prev,
        [key]: value,
      }));
      setIsUpdating(false);
    };
    
    if (isLoading) {
      return (
        <div className="space-y-4 max-w-md">
          <h3 className="text-lg font-semibold">알림 설정 로딩 중...</h3>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-12 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    const settingItems = [
      { key: 'push_enabled', label: '푸시 알림', description: '브라우저/앱 푸시 알림' },
      { key: 'email_enabled', label: '이메일 알림', description: '이메일로 알림 수신' },
      { key: 'comment_notifications', label: '댓글 알림', description: '내 글에 댓글 달릴 때' },
      { key: 'message_notifications', label: '쪽지 알림', description: '새 쪽지 수신 시' },
      { key: 'system_notifications', label: '시스템 알림', description: '공지사항 및 시스템 메시지' },
      { key: 'marketing_notifications', label: '마케팅 알림', description: '이벤트 및 프로모션 정보' },
    ];
    
    return (
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">useNotificationSettingsQuery 훅 예시</h3>
        
        <div className="space-y-3">
          {settingItems.map((item) => (
            <div 
              key={item.key}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                isUpdating ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              
              <Button
                size="sm"
                variant={settings[item.key] ? 'success' : 'outline'}
                onClick={() => updateSetting(item.key, !settings[item.key])}
                disabled={isUpdating}
              >
                {settings[item.key] ? 'ON' : 'OFF'}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-1">현재 설정 요약</div>
          <div className="text-xs text-blue-600">
            활성화된 알림: {Object.values(settings).filter(Boolean).length}개 / {Object.keys(settings).length}개
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>개별 알림 타입별 설정 관리</li>
            <li>설정 변경 시 자동 저장</li>
            <li>실시간 UI 업데이트</li>
            <li>서버 동기화 및 캐싱</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'useNotificationSettingsQuery 훅을 사용한 알림 설정 관리 예시입니다.',
      },
    },
  },
};

// 통합 사용 예시
export const NotificationSystemExample: Story = {
  render: () => {
    const [currentTab, setCurrentTab] = useState<'all' | 'unread'>('all');
    
    const { data: notifications, isLoading: notificationsLoading } = useNotificationsQueryMock({ 
      onlyUnread: currentTab === 'unread' 
    });
    const { data: unreadCount, isLoading: countLoading } = useUnreadNotificationCountQueryMock();
    const { mutate: markAsRead } = useMarkNotificationAsReadCommandMock();
    
    return (
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">알림 시스템 통합 예시</h3>
        
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔔</span>
            <h4 className="font-medium">알림 센터</h4>
            {!countLoading && unreadCount > 0 && (
              <Badge variant="error" size="sm">
                {unreadCount}개 안읽음
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={currentTab === 'all' ? 'primary' : 'ghost'}
              onClick={() => setCurrentTab('all')}
            >
              전체
            </Button>
            <Button
              size="sm"
              variant={currentTab === 'unread' ? 'primary' : 'ghost'}
              onClick={() => setCurrentTab('unread')}
            >
              안읽음
            </Button>
          </div>
        </div>
        
        {/* 알림 목록 영역 */}
        <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
          {notificationsLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2" />
                  <div className="flex-1">
                    <Skeleton className="w-3/4 h-4 mb-2" />
                    <Skeleton className="w-full h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications?.notifications?.length > 0 ? (
            <div className="divide-y">
              {notifications.notifications.map((notification: any) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-1">{notification.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-3">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      
                      {notification.web_landing_url && (
                        <Button size="sm" variant="ghost">
                          보기
                        </Button>
                      )}
                      
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          읽음
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {currentTab === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          <p><strong>통합된 기능:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>실시간 알림 개수 업데이트</li>
            <li>읽음/안읽음 상태 관리</li>
            <li>자동 캐싱 및 동기화</li>
            <li>사용자 경험 최적화</li>
          </ul>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '알림 시스템의 모든 훅을 통합한 실제 사용 사례 예시입니다.',
      },
    },
  },
};