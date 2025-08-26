import type { Meta, StoryObj } from '@storybook/react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Skeleton } from '../../components/Skeleton';

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
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

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