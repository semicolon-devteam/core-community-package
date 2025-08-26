import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

// 메시징 훅들 import (직접 소스 경로 사용)
import { 
  useChatRoomsQuery,
  useChatRoomQuery,
  useMessagesQuery,
  useChatParticipantsQuery,
  useChatRoomStatsQuery,
  useMessageSearchQuery,
  useDirectChatExistsQuery,
  useMessageFileUrlQuery
} from '../../../../lib/hooks/queries/useMessageQuery';

import {
  useCreateChatRoomCommand,
  useGetOrCreateDirectChatCommand,
  useSendMessageCommand,
  useUpdateMessageCommand,
  useDeleteMessageCommand,
  useMarkMessagesAsReadCommand,
  useLeaveChatRoomCommand,
  useInviteParticipantsCommand,
  useUpdateChatRoomSettingsCommand,
  useUploadMessageFileCommand
} from '../../../../lib/hooks/commands/useMessageCommand';

import type {
  ChatRoom,
  Message,
  ChatParticipant,
  CreateChatRoomRequest,
  SendMessageRequest
} from '../../../../lib/types/messaging';

// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Mock API 응답 함수들
const mockApi = {
  getChatRooms: () => ({
    successOrNot: 'Y' as const,
    statusCode: 200,
    data: {
      rooms: [
        {
          id: 'room-1',
          status: 'active' as const,
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
            }
          ],
          last_message: {
            id: 'msg-1',
            room_id: 'room-1',
            sender_id: 'user-1',
            content: '안녕하세요!',
            status: 'read' as const,
            created_at: '2024-01-15T10:30:00Z',
            sender: { id: 'user-1', nickname: '김철수', avatar_path: '/avatar1.jpg' }
          },
          unread_count: 0
        }
      ],
      total_count: 1,
      has_more: false,
      current_page: 1,
      total_pages: 1
    }
  }),

  getChatRoomStats: () => ({
    successOrNot: 'Y' as const,
    statusCode: 200,
    data: {
      total_rooms: 5,
      active_rooms: 3,
      total_messages: 124,
      unread_messages: 8,
      participants_count: 15
    }
  }),

  getMessages: () => ({
    successOrNot: 'Y' as const,
    statusCode: 200,
    data: {
      messages: [
        {
          id: 'msg-1',
          room_id: 'room-1',
          sender_id: 'user-1',
          content: '안녕하세요! 오늘 날씨가 좋네요.',
          status: 'read' as const,
          created_at: '2024-01-15T10:30:00Z',
          sender: { id: 'user-1', nickname: '김철수', avatar_path: '/avatar1.jpg' }
        },
        {
          id: 'msg-2',
          room_id: 'room-1',
          sender_id: 'user-2',
          content: '네, 정말 맑고 따뜻해요!',
          status: 'read' as const,
          reply_to_id: 'msg-1',
          created_at: '2024-01-15T10:35:00Z',
          sender: { id: 'user-2', nickname: '이영희', avatar_path: '/avatar2.jpg' }
        }
      ],
      total_count: 2,
      has_more: false,
      current_page: 1,
      total_pages: 1,
      participants: []
    }
  }),

  sendMessage: (request: SendMessageRequest) => ({
    successOrNot: 'Y' as const,
    statusCode: 201,
    data: {
      id: 'new-msg-' + Date.now(),
      room_id: request.room_id,
      sender_id: 'current-user',
      content: request.content,
      status: 'sent' as const,
      created_at: new Date().toISOString(),
      sender: { id: 'current-user', nickname: '현재사용자', avatar_path: '/my-avatar.jpg' }
    }
  })
};

// Mock 서비스 오버라이드
const originalMessageService = require('../../../../lib/services/messageService');
jest.mock('../../../../lib/services/messageService', () => ({
  MessageService: class MockMessageService {
    async getChatRooms() { return mockApi.getChatRooms(); }
    async getChatRoomsSilent() { return mockApi.getChatRooms(); }
    async getChatRoom() { return { successOrNot: 'Y', statusCode: 200, data: mockApi.getChatRooms().data.rooms[0] }; }
    async getMessages() { return mockApi.getMessages(); }
    async getMessagesSilent() { return mockApi.getMessages(); }
    async getChatRoomStats() { return mockApi.getChatRoomStats(); }
    async getChatRoomStatsSilent() { return mockApi.getChatRoomStats(); }
    async sendMessage(request: SendMessageRequest) { return mockApi.sendMessage(request); }
    async sendMessageSilent(request: SendMessageRequest) { return mockApi.sendMessage(request); }
    async getChatParticipants() { return { successOrNot: 'Y', statusCode: 200, data: [] }; }
    async checkDirectChatExists() { return { successOrNot: 'Y', statusCode: 200, data: { exists: false } }; }
    async getMessageFileUrl() { return { successOrNot: 'Y', statusCode: 200, data: { download_url: 'https://example.com/file.jpg' } }; }
    async searchMessages() { return mockApi.getMessages(); }
  }
}));

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
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 채팅방 목록 조회 기능 테스트
 */
export const ChatRoomsList: Story = {
  render: () => {
    const { data: chatRooms, isLoading, error, refetch } = useChatRoomsQuery({
      page: 1,
      pageSize: 10
    });

    const { data: stats } = useChatRoomStatsQuery();

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
        {chatRooms?.rooms?.map((room) => (
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
                  {room.unread_count! > 0 && (
                    <span style={{ 
                      background: '#ef4444', 
                      color: 'white', 
                      borderRadius: '12px', 
                      padding: '2px 8px', 
                      fontSize: '12px',
                      marginLeft: '0.5rem'
                    }}>
                      {room.unread_count}
                    </span>
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

        <button onClick={() => refetch()} style={{ 
          padding: '0.5rem 1rem', 
          background: '#3b82f6', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          🔄 새로고침
        </button>
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
    
    const { data: messages, isLoading: messagesLoading, refetch } = useMessagesQuery({
      roomId: selectedRoomId,
      page: 1,
      pageSize: 20
    });

    const { data: participants } = useChatParticipantsQuery({
      roomId: selectedRoomId
    });

    const sendMessage = useSendMessageCommand();
    const updateMessage = useUpdateMessageCommand();
    const deleteMessage = useDeleteMessageCommand();
    const markAsRead = useMarkMessagesAsReadCommand();

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
      } catch (error) {
        console.error('메시지 전송 실패:', error);
      }
    };

    const handleMarkAsRead = async () => {
      try {
        await markAsRead.mutateAsync({
          request: {
            room_id: selectedRoomId,
            read_until: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('읽음 처리 실패:', error);
      }
    };

    if (messagesLoading) return <div>메시지를 불러오는 중...</div>;

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
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="room-1">일반 채팅방 (room-1)</option>
            <option value="room-2">프로젝트 논의 (room-2)</option>
            <option value="room-3">1:1 대화 (room-3)</option>
          </select>
        </div>

        {/* 참여자 정보 */}
        {participants && participants.length > 0 && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '0.75rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <strong>👥 참여자 ({participants.length}명):</strong>
            <div style={{ marginTop: '0.5rem' }}>
              {participants.map((p) => (
                <span key={p.id} style={{ 
                  display: 'inline-block',
                  background: '#e9ecef',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  marginRight: '0.5rem'
                }}>
                  {p.user?.nickname}
                </span>
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
          {messages?.messages?.map((message) => (
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
                  <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>
                    {message.status === 'read' ? '읽음' : '전송됨'}
                  </span>
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
          <button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sendMessage.isPending}
            style={{ 
              padding: '0.75rem 1rem', 
              background: sendMessage.isPending ? '#ccc' : '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: sendMessage.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {sendMessage.isPending ? '전송 중...' : '📤 전송'}
          </button>
        </div>

        {/* 액션 버튼들 */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleMarkAsRead} style={{ 
            padding: '0.5rem 1rem', 
            background: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            ✅ 모두 읽음 처리
          </button>
          
          <button onClick={() => refetch()} style={{ 
            padding: '0.5rem 1rem', 
            background: '#6b7280', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            🔄 메시지 새로고침
          </button>
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

    const createChatRoom = useCreateChatRoomCommand();
    const createDirectChat = useGetOrCreateDirectChatCommand();
    const leaveChatRoom = useLeaveChatRoomCommand();
    const inviteParticipants = useInviteParticipantsCommand();

    const { data: directChatExists } = useDirectChatExistsQuery({
      targetUserId,
      enabled: !!targetUserId
    });

    const handleCreateChatRoom = async () => {
      try {
        const request: CreateChatRoomRequest = {
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

    const handleCreateDirectChat = async () => {
      try {
        const result = await createDirectChat.mutateAsync(targetUserId);
        console.log('1:1 채팅방 생성 성공:', result);
      } catch (error) {
        console.error('1:1 채팅방 생성 실패:', error);
      }
    };

    const handleInviteParticipants = async () => {
      try {
        await inviteParticipants.mutateAsync({
          room_id: 'room-1',
          user_ids: ['user-4', 'user-5']
        });
        console.log('참여자 초대 성공');
      } catch (error) {
        console.error('참여자 초대 실패:', error);
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
          <button 
            onClick={handleCreateChatRoom}
            disabled={createChatRoom.isPending}
            style={{ 
              padding: '0.5rem 1rem', 
              background: createChatRoom.isPending ? '#ccc' : '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: createChatRoom.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {createChatRoom.isPending ? '생성 중...' : '🏗️ 채팅방 생성'}
          </button>
          
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
          
          {directChatExists && (
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
          )}
          
          <button 
            onClick={handleCreateDirectChat}
            disabled={createDirectChat.isPending}
            style={{ 
              padding: '0.5rem 1rem', 
              background: createDirectChat.isPending ? '#ccc' : '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: createDirectChat.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {createDirectChat.isPending ? '처리 중...' : '👤 1:1 채팅방 찾기/생성'}
          </button>
        </div>

        {/* 참여자 초대 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4>➕ 참여자 관리</h4>
          <button 
            onClick={handleInviteParticipants}
            disabled={inviteParticipants.isPending}
            style={{ 
              padding: '0.5rem 1rem', 
              background: inviteParticipants.isPending ? '#ccc' : '#8b5cf6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: inviteParticipants.isPending ? 'not-allowed' : 'pointer'
            }}
          >
            {inviteParticipants.isPending ? '초대 중...' : '➕ 참여자 초대 (room-1)'}
          </button>
          
          {participants && (
            <div style={{ marginTop: '0.5rem', fontSize: '14px', color: '#666' }}>
              현재 참여자: {participants.length}명
            </div>
          )}
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
    const [senderId, setSenderId] = useState('');
    const [messageType, setMessageType] = useState<'text' | 'file' | 'all'>('all');

    const searchOptions = {
      room_id: searchRoomId,
      query: searchQuery,
      sender_id: senderId || undefined,
      message_type: messageType,
      page: 1,
      page_size: 10
    };

    const { data: searchResults, isLoading, refetch } = useMessageSearchQuery({
      searchOptions,
      enabled: !!searchQuery && !!searchRoomId
    });

    const handleSearch = () => {
      if (searchQuery.trim()) {
        refetch();
      }
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>채팅방 ID:</label>
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
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>메시지 타입:</label>
              <select 
                value={messageType} 
                onChange={(e) => setMessageType(e.target.value as 'text' | 'file' | 'all')}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="all">전체</option>
                <option value="text">텍스트만</option>
                <option value="file">파일만</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>발신자 ID (선택사항):</label>
            <input
              type="text"
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              placeholder="user-1"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
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
            <button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoading}
              style={{ 
                padding: '0.5rem 1rem', 
                background: isLoading ? '#ccc' : '#f59e0b', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? '검색 중...' : '🔍 검색'}
            </button>
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
                {searchResults.messages.map((message) => (
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
                    {message.file_info && (
                      <div style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '12px', 
                        color: '#8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        📎 {message.file_info.name} ({(message.file_info.size / 1024).toFixed(1)}KB)
                      </div>
                    )}
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

    const uploadFile = useUploadMessageFileCommand();
    const { data: fileUrl } = useMessageFileUrlQuery({
      fileId: 'sample-file-id',
      enabled: true
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    };

    const handleUpload = async () => {
      if (!selectedFile) return;

      try {
        const result = await uploadFile.mutateAsync({
          file: selectedFile,
          roomId
        });
        console.log('파일 업로드 성공:', result);
        setSelectedFile(null);
      } catch (error) {
        console.error('파일 업로드 실패:', error);
      }
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

          <button 
            onClick={handleUpload}
            disabled={!selectedFile || uploadFile.isPending}
            style={{ 
              padding: '0.5rem 1rem', 
              background: (!selectedFile || uploadFile.isPending) ? '#ccc' : '#06b6d4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: (!selectedFile || uploadFile.isPending) ? 'not-allowed' : 'pointer'
            }}
          >
            {uploadFile.isPending ? '업로드 중...' : '📤 파일 업로드'}
          </button>
          
          {uploadFile.error && (
            <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '14px' }}>
              업로드 실패: {uploadFile.error.message}
            </div>
          )}
          
          {uploadFile.data && (
            <div style={{ 
              background: '#d1fae5',
              padding: '0.75rem',
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <div style={{ fontWeight: 'bold', color: '#10b981' }}>✅ 업로드 성공!</div>
              <div style={{ fontSize: '14px', marginTop: '0.25rem' }}>
                파일 ID: {uploadFile.data.file_id}
              </div>
              <div style={{ fontSize: '14px' }}>
                파일 URL: <a href={uploadFile.data.file_url} target="_blank" rel="noopener noreferrer">
                  {uploadFile.data.file_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 파일 URL 조회 예시 */}
        {fileUrl && (
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
              {fileUrl.download_url}
            </div>
          </div>
        )}
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