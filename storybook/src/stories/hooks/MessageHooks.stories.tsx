import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Button } from '@components/Button';
import { Badge } from '@components/Badge';
import { Skeleton } from '@components/Skeleton';

// Mock 메시징 데이터
const mockChatRooms = [
  {
    id: 'room-1',
    status: 'active',
    last_message_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-10T09:00:00Z',
    participants: [
      {
        id: 'participant-1',
        room_id: 'room-1',
        user_id: 'user-1',
        joined_at: '2024-01-10T09:00:00Z',
        is_active: true,
        notification_settings: { mute: false, push_enabled: true },
        user: { id: 'user-1', nickname: '김철수', avatar_path: '/avatar1.jpg', permission_type: 'user' }
      },
      {
        id: 'participant-2',
        room_id: 'room-1',
        user_id: 'user-2',
        joined_at: '2024-01-10T09:30:00Z',
        is_active: true,
        notification_settings: { mute: false, push_enabled: true },
        user: { id: 'user-2', nickname: '이영희', avatar_path: '/avatar2.jpg', permission_type: 'user' }
      }
    ],
    last_message: {
      id: 'msg-1',
      room_id: 'room-1',
      sender_id: 'user-1',
      content: '안녕하세요! 오늘 프로젝트 회의 어떠셨나요?',
      status: 'read',
      created_at: '2024-01-15T10:30:00Z',
      sender: { id: 'user-1', nickname: '김철수', avatar_path: '/avatar1.jpg' }
    },
    unread_count: 3
  },
  {
    id: 'room-2',
    status: 'active',
    last_message_at: '2024-01-15T09:15:00Z',
    created_at: '2024-01-12T14:20:00Z',
    participants: [
      {
        id: 'participant-3',
        room_id: 'room-2',
        user_id: 'user-3',
        joined_at: '2024-01-12T14:20:00Z',
        is_active: true,
        notification_settings: { mute: true, push_enabled: false },
        user: { id: 'user-3', nickname: '박민수', avatar_path: '/avatar3.jpg', permission_type: 'user' }
      }
    ],
    last_message: {
      id: 'msg-5',
      room_id: 'room-2',
      sender_id: 'user-3',
      content: '네, 알겠습니다!',
      status: 'delivered',
      created_at: '2024-01-15T09:15:00Z',
      sender: { id: 'user-3', nickname: '박민수', avatar_path: '/avatar3.jpg' }
    },
    unread_count: 0
  }
];

const mockMessages = [
  {
    id: 'msg-1',
    room_id: 'room-1',
    sender_id: 'user-1',
    content: '안녕하세요! 오늘 프로젝트 회의 어떠셨나요?',
    status: 'read',
    created_at: '2024-01-15T10:30:00Z',
    sender: { id: 'user-1', nickname: '김철수', avatar_path: '/avatar1.jpg' }
  },
  {
    id: 'msg-2',
    room_id: 'room-1',
    sender_id: 'user-2',
    content: '회의 잘 마무리됐습니다. 다음 주 일정도 논의해봐야겠어요.',
    status: 'read',
    reply_to_id: 'msg-1',
    created_at: '2024-01-15T10:35:00Z',
    sender: { id: 'user-2', nickname: '이영희', avatar_path: '/avatar2.jpg' }
  },
  {
    id: 'msg-3',
    room_id: 'room-1',
    sender_id: 'current-user',
    content: '좋은 아이디어네요! 내일 오전에 시간 있으실까요?',
    status: 'sent',
    created_at: '2024-01-15T10:40:00Z',
    sender: { id: 'current-user', nickname: '현재사용자', avatar_path: '/my-avatar.jpg' }
  }
];

const mockStats = {
  total_rooms: 5,
  active_rooms: 3,
  total_messages: 124,
  unread_messages: 8,
  participants_count: 15
};

// Mock 훅들
const useChatRoomsQueryMock = ({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number } = {}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        rooms: mockChatRooms,
        total_count: mockChatRooms.length,
        has_more: false,
        current_page: page,
        total_pages: 1
      });
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [page, pageSize]);
  
  return { 
    data, 
    isLoading, 
    error: null,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };
};

const useMessagesQueryMock = ({ roomId }: { roomId: string }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const roomMessages = mockMessages.filter(m => m.room_id === roomId);
      setData({
        messages: roomMessages,
        total_count: roomMessages.length,
        has_more: false,
        current_page: 1,
        total_pages: 1,
        participants: mockChatRooms.find(r => r.id === roomId)?.participants || []
      });
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [roomId]);
  
  return { 
    data, 
    isLoading, 
    error: null,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };
};

const useChatRoomStatsQueryMock = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockStats);
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { data, isLoading, error: null };
};

const useSendMessageCommandMock = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  
  const mutateAsync = async ({ request }: { request: any }) => {
    setIsPending(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% 성공률
          const newMessage = {
            id: 'new-msg-' + Date.now(),
            room_id: request.room_id,
            sender_id: 'current-user',
            content: request.content,
            status: 'sent',
            created_at: new Date().toISOString(),
            sender: { id: 'current-user', nickname: '현재사용자', avatar_path: '/my-avatar.jpg' }
          };
          setData(newMessage);
          setIsPending(false);
          resolve(newMessage);
        } else {
          const errorMsg = new Error('네트워크 연결을 확인해주세요.');
          setError(errorMsg);
          setIsPending(false);
          reject(errorMsg);
        }
      }, 1200);
    });
  };
  
  return { isPending, error, data, mutateAsync };
};

const useCreateChatRoomCommandMock = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mutateAsync = async (request: any) => {
    setIsPending(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request.participant_ids.length > 0) {
          const newRoom = {
            id: 'room-' + Date.now(),
            status: 'active',
            created_at: new Date().toISOString(),
            participants: request.participant_ids.map((id: string) => ({
              id: 'participant-' + id,
              room_id: 'room-' + Date.now(),
              user_id: id,
              joined_at: new Date().toISOString(),
              is_active: true,
              notification_settings: { mute: false, push_enabled: true }
            }))
          };
          setIsPending(false);
          resolve(newRoom);
        } else {
          const errorMsg = new Error('최소 1명의 참여자가 필요합니다.');
          setError(errorMsg);
          setIsPending(false);
          reject(errorMsg);
        }
      }, 1500);
    });
  };
  
  return { isPending, error, mutateAsync };
};

const meta: Meta = {
  title: 'Hooks/MessageHooks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
메시징 시스템 관련 React Query 훅들을 테스트할 수 있는 인터랙티브 스토리입니다.

## 주요 기능
- **채팅방 관리**: 목록 조회, 생성, 나가기, 설정 변경
- **메시지 관리**: 전송, 수정, 삭제, 읽음 처리
- **참여자 관리**: 초대, 목록 조회
- **파일 업로드**: 메시지 첨부 파일 관리
- **검색 기능**: 메시지 검색 및 필터링

## 사용법
\`\`\`typescript
import { 
  useChatRoomsQuery,
  useSendMessageCommand 
} from '@team-semicolon/community-core';

// 채팅방 목록 조회
const { data: chatRooms, isLoading } = useChatRoomsQuery({
  page: 1,
  pageSize: 20
});

// 메시지 전송
const sendMessage = useSendMessageCommand();
await sendMessage.mutateAsync({
  request: {
    room_id: 'room-1',
    content: '안녕하세요!'
  }
});
\`\`\`

## 실제 구현 코드 예시

### 채팅방 목록 컴포넌트 구현
\`\`\`tsx
import { useChatRoomsQuery, useChatRoomStatsQuery } from '@team-semicolon/community-core';

function ChatRoomList() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    data: chatRooms, 
    isLoading, 
    error, 
    refetch 
  } = useChatRoomsQuery({
    page,
    pageSize: 20,
    search: searchQuery
  });
  
  const { data: stats } = useChatRoomStatsQuery();
  
  if (isLoading) return <div>채팅방 목록을 불러오는 중...</div>;
  if (error) return <div>채팅방을 불러올 수 없습니다: {error.message}</div>;
  
  return (
    <div className="chat-room-list">
      <div className="stats-bar">
        <span>전체 채팅방: {stats?.total_rooms}</span>
        <span>활성 채팅방: {stats?.active_rooms}</span>
        <span>읽지 않은 메시지: {stats?.unread_messages}</span>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="채팅방 검색..."
        />
        <button onClick={() => refetch()}>새로고침</button>
      </div>
      
      <div className="room-list">
        {chatRooms?.rooms?.map(room => (
          <div key={room.id} className="room-item">
            <div className="room-info">
              <h3>채팅방 {room.id}</h3>
              <p className="last-message">
                {room.last_message ? (
                  <>
                    <strong>{room.last_message.sender?.nickname}:</strong>
                    {room.last_message.content}
                  </>
                ) : (
                  '메시지가 없습니다'
                )}
              </p>
              <span className="timestamp">
                {new Date(room.last_message_at || room.created_at).toLocaleString()}
              </span>
            </div>
            
            <div className="room-meta">
              <div className="participant-count">
                👥 {room.participants?.length || 0}명
              </div>
              {room.unread_count > 0 && (
                <div className="unread-badge">
                  {room.unread_count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          이전
        </button>
        <span>페이지 {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!chatRooms?.has_more}
        >
          다음
        </button>
      </div>
    </div>
  );
}
\`\`\`

### 실시간 채팅 컴포넌트 구현
\`\`\`tsx
import { 
  useMessagesQuery,
  useSendMessageCommand,
  useMarkAllMessagesAsReadCommand 
} from '@team-semicolon/community-core';

function ChatRoom({ roomId }: { roomId: string }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 메시지 목록 조회
  const { 
    data: messages, 
    isLoading, 
    refetch 
  } = useMessagesQuery({ 
    roomId,
    refetchInterval: 3000 // 3초마다 자동 새로고침
  });
  
  // 메시지 전송
  const sendMessage = useSendMessageCommand();
  
  // 모든 메시지 읽음 처리
  const markAllAsRead = useMarkAllMessagesAsReadCommand();
  
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
  
  // 메시지 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync(roomId);
    } catch (error) {
      console.error('읽음 처리 실패:', error);
    }
  };
  
  // 컴포넌트 마운트 시 읽음 처리
  useEffect(() => {
    if (messages?.messages?.length > 0) {
      handleMarkAllAsRead();
    }
  }, [roomId, messages?.messages?.length]);
  
  if (isLoading) return <div>메시지를 불러오는 중...</div>;
  
  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>채팅방 {roomId}</h2>
        <div className="participants">
          👥 {messages?.participants?.length || 0}명 참여 중
        </div>
      </div>
      
      <div className="message-list" style={{ height: '400px', overflowY: 'auto' }}>
        {messages?.messages?.map(message => (
          <div 
            key={message.id} 
            className={'message ' + (message.sender_id === 'current-user' ? 'own' : 'other')}
          >
            <div className="message-header">
              <span className="sender">{message.sender?.nickname}</span>
              <span className="timestamp">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
              <span className={'status ' + message.status}>
                {message.status === 'read' ? '읽음' : '전송됨'}
              </span>
            </div>
            <div className="message-content">
              {message.reply_to_id && (
                <div className="reply-indicator">↳ 답장</div>
              )}
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={sendMessage.isPending}
        />
        <button 
          type="submit"
          disabled={!newMessage.trim() || sendMessage.isPending}
        >
          {sendMessage.isPending ? '전송 중...' : '전송'}
        </button>
      </form>
      
      {sendMessage.error && (
        <div className="error-message">
          전송 실패: {sendMessage.error.message}
        </div>
      )}
    </div>
  );
}
\`\`\`

### 채팅방 생성 컴포넌트 구현
\`\`\`tsx
import { 
  useCreateChatRoomCommand,
  useDirectChatRoomQuery,
  useInviteParticipantsCommand 
} from '@team-semicolon/community-core';

function CreateChatRoom() {
  const [roomType, setRoomType] = useState<'group' | 'direct'>('group');
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [roomName, setRoomName] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  
  const createChatRoom = useCreateChatRoomCommand();
  const inviteParticipants = useInviteParticipantsCommand();
  
  // 1:1 채팅방 존재 여부 확인
  const { data: directChat } = useDirectChatRoomQuery(
    targetUserId,
    { enabled: roomType === 'direct' && !!targetUserId }
  );
  
  const handleCreateGroup = async () => {
    try {
      const result = await createChatRoom.mutateAsync({
        participant_ids: participantIds,
        room_name: roomName,
        room_type: 'group'
      });
      
      console.log('그룹 채팅방 생성 성공:', result);
      
      // 초기화
      setParticipantIds([]);
      setRoomName('');
      
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };
  
  const handleCreateDirectChat = async () => {
    if (directChat?.exists) {
      // 기존 채팅방으로 이동
      window.location.href = \`/chat/\${directChat.room_id}\`;
      return;
    }
    
    try {
      const result = await createChatRoom.mutateAsync({
        participant_ids: [targetUserId],
        room_type: 'direct'
      });
      
      console.log('1:1 채팅방 생성 성공:', result);
      
    } catch (error) {
      console.error('1:1 채팅방 생성 실패:', error);
    }
  };
  
  return (
    <div className="create-chat-room">
      <h2>새 채팅방 만들기</h2>
      
      <div className="room-type-selector">
        <label>
          <input
            type="radio"
            value="group"
            checked={roomType === 'group'}
            onChange={(e) => setRoomType(e.target.value as 'group')}
          />
          그룹 채팅
        </label>
        <label>
          <input
            type="radio"
            value="direct"
            checked={roomType === 'direct'}
            onChange={(e) => setRoomType(e.target.value as 'direct')}
          />
          1:1 채팅
        </label>
      </div>
      
      {roomType === 'group' && (
        <div className="group-chat-form">
          <div className="form-field">
            <label>채팅방 이름</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="채팅방 이름을 입력하세요"
            />
          </div>
          
          <div className="form-field">
            <label>참여자 (사용자 ID로 입력)</label>
            <input
              type="text"
              placeholder="참여자 ID를 입력하고 Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = e.currentTarget.value.trim();
                  if (value && !participantIds.includes(value)) {
                    setParticipantIds([...participantIds, value]);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <div className="participant-list">
              {participantIds.map(id => (
                <span key={id} className="participant-tag">
                  {id}
                  <button onClick={() => setParticipantIds(ids => ids.filter(i => i !== id))}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleCreateGroup}
            disabled={createChatRoom.isPending || !roomName || participantIds.length === 0}
          >
            {createChatRoom.isPending ? '생성 중...' : '그룹 채팅방 생성'}
          </button>
        </div>
      )}
      
      {roomType === 'direct' && (
        <div className="direct-chat-form">
          <div className="form-field">
            <label>대화할 사용자 ID</label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="사용자 ID를 입력하세요"
            />
          </div>
          
          {targetUserId && directChat?.exists && (
            <div className="existing-chat-notice">
              ✅ 이미 대화 중인 채팅방이 있습니다.
            </div>
          )}
          
          <button 
            onClick={handleCreateDirectChat}
            disabled={!targetUserId || createChatRoom.isPending}
          >
            {createChatRoom.isPending ? '처리 중...' : 
             directChat?.exists ? '기존 채팅방으로 이동' : '1:1 채팅 시작'}
          </button>
        </div>
      )}
      
      {createChatRoom.error && (
        <div className="error-message">
          생성 실패: {createChatRoom.error.message}
        </div>
      )}
    </div>
  );
}
\`\`\`
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 문서 스토리 (최상단 배치)
export const Docs: Story = {
  render: () => (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>MessageHooks 사용 가이드</h1>
      <p><strong>@team-semicolon/community-core</strong>의 MessageHooks는 실시간 메시징 시스템을 위한 React Query 기반 훅들을 제공합니다.</p>
      
      <h2>📋 제공하는 훅들</h2>
      <ul>
        <li><strong>💬 useMessagesQuery</strong>: 특정 채팅방의 메시지 목록 조회</li>
        <li><strong>📤 useSendMessageCommand</strong>: 새 메시지 전송</li>
        <li><strong>🔄 useMessageRealtime</strong>: 실시간 메시지 업데이트 구독</li>
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
          href="https://github.com/semicolon-labs/community-core/blob/main/storybook/src/stories/hooks/MessageHooks.md" 
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: '#0066cc', 
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          📖 MessageHooks 완전한 사용 가이드 보기
        </a>
      </div>
      
      <h3>🚀 주요 패턴</h3>
      <div style={{ marginTop: '1rem' }}>
        <h4>1. 기본 채팅방 구현</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`const { data: messages } = useMessagesQuery({ roomId });
const { mutate: sendMessage } = useSendMessageCommand();

const handleSend = (content) => {
  sendMessage({ roomId, content, userId });
};

return (
  <div>
    {messages?.map(msg => (
      <div key={msg.id}>{msg.content}</div>
    ))}
    <MessageInput onSend={handleSend} />
  </div>
);`}
        </pre>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>2. 실시간 채팅방</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`// 실시간 메시지 업데이트
useMessageRealtime({
  roomId,
  onNewMessage: (message) => {
    scrollToBottom();
    playNotificationSound();
  },
  onTyping: (data) => {
    setTypingUsers(data.users);
  }
});`}
        </pre>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <h4>3. 채팅방 목록 관리</h4>
        <pre style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`const { data: rooms } = useChatRoomsQuery({ userId });

return (
  <div>
    {rooms?.map(room => (
      <ChatRoomItem 
        key={room.id}
        room={room}
        onClick={() => selectRoom(room.id)}
        unreadCount={room.unreadCount}
      />
    ))}
  </div>
);`}
        </pre>
      </div>
      
      <h3>💡 주요 특징</h3>
      <ul style={{ marginTop: '1rem' }}>
        <li>🔄 <strong>실시간 동기화</strong>: Supabase Realtime을 통한 실시간 메시지 업데이트</li>
        <li>📱 <strong>반응형 UI</strong>: 모바일과 데스크톱 모두 지원</li>
        <li>🔍 <strong>고급 검색</strong>: 메시지 내용, 파일, 사용자별 검색</li>
        <li>📎 <strong>파일 지원</strong>: 이미지, 문서 등 다양한 파일 형식 지원</li>
        <li>⚡ <strong>성능 최적화</strong>: React Query 캐싱으로 빠른 응답</li>
      </ul>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '완전한 MessageHooks 사용 가이드입니다. 실제 채팅 시스템 구현에 필요한 모든 패턴을 포함합니다.'
      }
    }
  }
};

/**
 * 채팅방 목록 조회 기능 테스트
 */
export const ChatRoomsList: Story = {
  render: () => {
    const { data: chatRooms, isLoading, error, refetch } = useChatRoomsQueryMock({
      page: 1,
      pageSize: 10
    });

    const { data: stats } = useChatRoomStatsQueryMock();

    if (isLoading) return <div>채팅방 목록을 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red' }}>오류: {error.message}</div>;

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>📋 채팅방 목록</h3>
        
        {/* 통계 정보 */}
        {stats && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '0.5rem'
          }}>
            <div><strong>전체:</strong> {stats.total_rooms}</div>
            <div><strong>활성:</strong> {stats.active_rooms}</div>
            <div><strong>메시지:</strong> {stats.total_messages}</div>
            <div><strong>읽지않음:</strong> {stats.unread_messages}</div>
          </div>
        )}

        {/* 채팅방 목록 */}
        {chatRooms?.rooms?.map((room: any) => (
          <div key={room.id} style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '1rem',
            marginBottom: '0.5rem',
            background: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  채팅방 ID: {room.id}
                  {room.unread_count > 0 && (
                    <Badge variant="danger" style={{ marginLeft: '0.5rem' }}>
                      {room.unread_count}
                    </Badge>
                  )}
                </div>
                {room.last_message && (
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    <strong>{room.last_message.sender?.nickname}:</strong> {room.last_message.content}
                  </div>
                )}
                <div style={{ color: '#888', fontSize: '12px', marginTop: '0.25rem' }}>
                  {new Date(room.last_message_at || room.created_at).toLocaleString()}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                참여자: {room.participants?.length || 0}명
              </div>
            </div>
          </div>
        ))}

        <Button onClick={() => refetch()} variant="secondary">
          🔄 새로고침
        </Button>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '채팅방 목록 조회 기능을 테스트할 수 있습니다. 실시간 통계와 함께 채팅방 정보가 표시됩니다.'
      }
    }
  }
};

/**
 * 메시지 목록 및 전송 기능 테스트
 */
export const MessagesManagement: Story = {
  render: () => {
    const [selectedRoomId, setSelectedRoomId] = useState('room-1');
    const [newMessage, setNewMessage] = useState('');
    
    const { data: messages, isLoading: messagesLoading, refetch } = useMessagesQueryMock({
      roomId: selectedRoomId
    });

    const sendMessage = useSendMessageCommandMock();

    const handleSendMessage = async () => {
      if (!newMessage.trim()) return;
      
      try {
        await sendMessage.mutateAsync({
          request: {
            room_id: selectedRoomId,
            content: newMessage.trim()
          }
        });
        setNewMessage('');
        // 성공 후 refetch는 자동으로 처리됨
        setTimeout(() => refetch(), 500);
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      }
    };

    if (messagesLoading) return <Skeleton className="w-full h-64" />;

    return (
      <div style={{ maxWidth: '700px' }}>
        <h3>💬 메시지 관리</h3>
        
        {/* 채팅방 선택 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            📍 채팅방 선택:
          </label>
          <select 
            value={selectedRoomId} 
            onChange={(e) => setSelectedRoomId(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="room-1">일반 채팅방 (room-1)</option>
            <option value="room-2">프로젝트 논의 (room-2)</option>
            <option value="room-3">1:1 대화 (room-3)</option>
          </select>
        </div>

        {/* 참여자 정보 */}
        {messages?.participants && messages.participants.length > 0 && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '0.75rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <strong>👥 참여자 ({messages.participants.length}명):</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {messages.participants.map((p: any) => (
                <Badge key={p.id} variant="secondary" style={{ marginRight: '0.5rem' }}>
                  {p.user?.nickname}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 메시지 목록 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem',
          minHeight: '300px',
          maxHeight: '300px',
          overflowY: 'auto',
          background: '#fafafa'
        }}>
          {messages?.messages?.map((message: any) => (
            <div key={message.id} style={{ 
              marginBottom: '1rem',
              padding: '0.75rem',
              background: message.sender_id === 'current-user' ? '#dcf8c6' : '#fff',
              borderRadius: '8px',
              marginLeft: message.sender_id === 'current-user' ? '2rem' : '0',
              marginRight: message.sender_id === 'current-user' ? '0' : '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '14px' }}>{message.sender?.nickname}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(message.created_at).toLocaleTimeString()}
                  <Badge 
                    variant={message.status === 'read' ? 'success' : 'secondary'} 
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {message.status === 'read' ? '읽음' : '전송됨'}
                  </Badge>
                </div>
              </div>
              <div style={{ fontSize: '14px' }}>{message.content}</div>
              {message.reply_to_id && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic',
                  marginTop: '0.25rem'
                }}>
                  ↳ 답장
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 메시지 전송 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessage.isPending}
            loading={sendMessage.isPending}
            variant="primary"
          >
            📤 전송
          </Button>
        </div>

        {/* 액션 버튼들 */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="success" size="sm">
            ✅ 모두 읽음 처리
          </Button>
          
          <Button onClick={() => refetch()} variant="secondary" size="sm">
            🔄 메시지 새로고침
          </Button>
        </div>

        {/* 에러 표시 */}
        {sendMessage.error && (
          <div style={{ 
            color: '#ef4444', 
            marginTop: '1rem', 
            padding: '0.5rem',
            background: '#fef2f2',
            borderRadius: '4px'
          }}>
            전송 실패: {sendMessage.error.message}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '메시지 전송, 수정, 삭제, 읽음 처리 등의 메시지 관리 기능을 테스트할 수 있습니다.'
      }
    }
  }
};

/**
 * 채팅방 생성 및 관리 기능 테스트
 */
export const ChatRoomManagement: Story = {
  render: () => {
    const [participantIds, setParticipantIds] = useState('user-2,user-3');
    const [roomName, setRoomName] = useState('새로운 채팅방');
    const [targetUserId, setTargetUserId] = useState('user-2');
    const [directChatExists, setDirectChatExists] = useState({ exists: false, room_id: undefined });

    const createChatRoom = useCreateChatRoomCommandMock();

    // 1:1 채팅방 존재 여부 시뮬레이션
    useEffect(() => {
      const timer = setTimeout(() => {
        setDirectChatExists({
          exists: targetUserId === 'user-2',
          room_id: targetUserId === 'user-2' ? 'room-direct-1' : undefined
        });
      }, 500);
      return () => clearTimeout(timer);
    }, [targetUserId]);

    const handleCreateChatRoom = async () => {
      try {
        const request = {
          participant_ids: participantIds.split(',').map(id => id.trim()),
          room_name: roomName,
          room_type: 'group'
        };
        
        const result = await createChatRoom.mutateAsync(request);
        console.log('채팅방 생성 성공:', result);
      } catch (error) {
        console.error('채팅방 생성 실패:', error);
      }
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>🏗️ 채팅방 관리</h3>
        
        {/* 그룹 채팅방 생성 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4>📝 그룹 채팅방 생성</h4>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>채팅방 이름:</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>
              참여자 ID (쉼표로 구분):
            </label>
            <input
              type="text"
              value={participantIds}
              onChange={(e) => setParticipantIds(e.target.value)}
              placeholder="user-2,user-3,user-4"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <Button 
            onClick={handleCreateChatRoom}
            disabled={createChatRoom.isPending}
            loading={createChatRoom.isPending}
            variant="primary"
          >
            🏗️ 채팅방 생성
          </Button>
          
          {createChatRoom.error && (
            <div style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '14px' }}>
              오류: {createChatRoom.error.message}
            </div>
          )}
        </div>

        {/* 1:1 채팅방 생성 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4>👤 1:1 채팅방 관리</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>대상 사용자 ID:</label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ 
            background: directChatExists.exists ? '#d1fae5' : '#fef3c7',
            padding: '0.5rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '14px'
          }}>
            {directChatExists.exists 
              ? `✅ 기존 채팅방이 있습니다 (ID: ${directChatExists.room_id})`
              : '❌ 기존 채팅방이 없습니다'
            }
          </div>
          
          <Button variant="success">
            👤 1:1 채팅방 찾기/생성
          </Button>
        </div>

        {/* 참여자 초대 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem'
        }}>
          <h4>➕ 참여자 관리</h4>
          <Button variant="outline" size="sm">
            ➕ 참여자 초대 (room-1)
          </Button>
          
          <div style={{ marginTop: '0.5rem', fontSize: '14px', color: '#666' }}>
            현재 참여자: 2명
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '채팅방 생성, 1:1 채팅방 관리, 참여자 초대 등의 채팅방 관리 기능을 테스트할 수 있습니다.'
      }
    }
  }
};

/**
 * 메시지 검색 기능 테스트
 */
export const MessageSearch: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchRoomId, setSearchRoomId] = useState('room-1');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any>(null);

    const handleSearch = () => {
      if (!searchQuery.trim()) return;
      
      setIsSearching(true);
      setTimeout(() => {
        const filteredMessages = mockMessages.filter(msg => 
          msg.room_id === searchRoomId && 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults({
          messages: filteredMessages,
          total_count: filteredMessages.length,
          has_more: false,
          current_page: 1,
          total_pages: 1,
          participants: []
        });
        setIsSearching(false);
      }, 1000);
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>🔍 메시지 검색</h3>
        
        {/* 검색 옵션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>채팅방 선택:</label>
            <select 
              value={searchRoomId} 
              onChange={(e) => setSearchRoomId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="room-1">일반 채팅방</option>
              <option value="room-2">프로젝트 논의</option>
              <option value="room-3">1:1 대화</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색할 키워드를 입력하세요..."
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              loading={isSearching}
              variant="secondary"
            >
              🔍 검색
            </Button>
          </div>
        </div>

        {/* 검색 결과 */}
        {searchResults && (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '1rem'
          }}>
            <h4>📋 검색 결과 ({searchResults.total_count}개)</h4>
            
            {searchResults.messages.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                검색 결과가 없습니다.
              </div>
            ) : (
              <div>
                {searchResults.messages.map((message: any) => (
                  <div key={message.id} style={{ 
                    background: '#f8f9fa',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>{message.sender?.nickname}</strong>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '14px' }}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '메시지 검색, 채팅방 생성, 참여자 관리 등의 고급 기능을 테스트할 수 있습니다.'
      }
    }
  }
};

/**
 * 파일 업로드 기능 테스트
 */
export const FileUpload: Story = {
  render: () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [roomId, setRoomId] = useState('room-1');
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setUploadResult(null);
      }
    };

    const handleUpload = async () => {
      if (!selectedFile) return;

      setIsUploading(true);
      setTimeout(() => {
        setUploadResult({
          file_id: 'file-' + Date.now(),
          file_url: `https://example.com/files/${selectedFile.name}`
        });
        setIsUploading(false);
        setSelectedFile(null);
      }, 2000);
    };

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>📎 파일 업로드</h3>
        
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>채팅방 선택:</label>
            <select 
              value={roomId} 
              onChange={(e) => setRoomId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="room-1">일반 채팅방</option>
              <option value="room-2">프로젝트 논의</option>
              <option value="room-3">1:1 대화</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>파일 선택:</label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          {selectedFile && (
            <div style={{ 
              background: '#f0f9ff',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>선택된 파일:</div>
              <div style={{ fontSize: '14px' }}>
                📄 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                타입: {selectedFile.type || '알 수 없음'}
              </div>
            </div>
          )}

          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            loading={isUploading}
            variant="primary"
          >
            📤 파일 업로드
          </Button>
          
          {uploadResult && (
            <div style={{ 
              background: '#d1fae5',
              padding: '0.75rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>✅ 업로드 성공!</div>
              <div style={{ fontSize: '14px', marginTop: '0.25rem' }}>
                파일 ID: {uploadResult.file_id}
              </div>
              <div style={{ fontSize: '14px' }}>
                파일 URL: <a href={uploadResult.file_url} target="_blank" rel="noopener noreferrer">
                  {uploadResult.file_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 파일 다운로드 URL 조회 예시 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem'
        }}>
          <h4>🔗 파일 다운로드 URL 조회 예시</h4>
          <div style={{ fontSize: '14px', color: '#666' }}>
            샘플 파일 ID에 대한 다운로드 URL:
          </div>
          <div style={{ 
            background: '#f8f9fa',
            padding: '0.5rem',
            borderRadius: '4px',
            marginTop: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            https://example.com/files/sample-file.jpg
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '메시지 검색, 파일 업로드, 다운로드 URL 조회 등의 고급 기능을 테스트할 수 있습니다.'
      }
    }
  }
};

