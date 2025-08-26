/**
 * 메시징 시스템 관련 타입 정의
 * @description 채팅방, 메시지, 참여자 관련 타입
 */

/**
 * 채팅방 상태
 */
export type ChatRoomStatus = 'active' | 'archived' | 'deleted';

/**
 * 메시지 상태
 */
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'deleted';

/**
 * 채팅방 인터페이스
 */
export interface ChatRoom {
  id: string;
  status: ChatRoomStatus;
  last_message_at?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  
  // 관계 데이터
  participants?: ChatParticipant[];
  last_message?: Message;
  unread_count?: number;
}

/**
 * 채팅방 참여자 인터페이스
 */
export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  last_read_at?: string;
  left_at?: string;
  is_active: boolean;
  notification_settings: {
    mute: boolean;
    push_enabled: boolean;
  };
  
  // 관계 데이터
  user?: {
    id: string;
    nickname: string;
    avatar_path?: string;
    permission_type: string;
  };
}

/**
 * 메시지 인터페이스
 */
export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content?: string;
  file_id?: string;
  status: MessageStatus;
  reply_to_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  
  // 관계 데이터
  sender?: {
    id: string;
    nickname: string;
    avatar_path?: string;
  };
  reply_to?: Message;
  file_info?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

/**
 * 채팅방 목록 응답
 */
export interface ChatRoomListResponse {
  rooms: ChatRoom[];
  total_count: number;
  has_more: boolean;
  current_page: number;
  total_pages: number;
}

/**
 * 메시지 목록 응답
 */
export interface MessageListResponse {
  messages: Message[];
  total_count: number;
  has_more: boolean;
  current_page: number;
  total_pages: number;
  participants: ChatParticipant[];
}

/**
 * 채팅방 생성 요청
 */
export interface CreateChatRoomRequest {
  participant_ids: string[];
  room_name?: string;
  room_type?: 'direct' | 'group';
}

/**
 * 메시지 전송 요청
 */
export interface SendMessageRequest {
  room_id: string;
  content?: string;
  file_id?: string;
  reply_to_id?: string;
  metadata?: Record<string, any>;
}

/**
 * 채팅방 설정 업데이트 요청
 */
export interface UpdateChatRoomSettingsRequest {
  room_id: string;
  notification_settings?: {
    mute?: boolean;
    push_enabled?: boolean;
  };
}

/**
 * 메시지 검색 옵션
 */
export interface MessageSearchOptions {
  room_id: string;
  query?: string;
  sender_id?: string;
  date_from?: string;
  date_to?: string;
  message_type?: 'text' | 'file' | 'all';
  page?: number;
  page_size?: number;
}

/**
 * 채팅방 참여자 초대 요청
 */
export interface InviteChatParticipantRequest {
  room_id: string;
  user_ids: string[];
}

/**
 * 채팅방 통계 정보
 */
export interface ChatRoomStats {
  total_rooms: number;
  active_rooms: number;
  total_messages: number;
  unread_messages: number;
  participants_count: number;
}

/**
 * 온라인 사용자 정보 (Presence)
 */
export interface OnlineUser {
  user_id: string;
  nickname: string;
  avatar_path?: string;
  status: 'online' | 'away' | 'offline';
  last_seen?: string;
}

/**
 * 메시지 읽음 처리 요청
 */
export interface MarkMessagesAsReadRequest {
  room_id: string;
  message_ids?: string[]; // 특정 메시지들만 읽음 처리 (선택사항)
  read_until?: string; // 특정 시점까지 모든 메시지 읽음 처리 (선택사항)
}