import { BaseService } from './baseService';
import type { CommonResponse } from '../types/common';
import type {
  ChatRoom,
  ChatParticipant,
  Message,
  ChatRoomListResponse,
  MessageListResponse,
  CreateChatRoomRequest,
  SendMessageRequest,
  UpdateChatRoomSettingsRequest,
  MessageSearchOptions,
  InviteChatParticipantRequest,
  ChatRoomStats,
  MarkMessagesAsReadRequest
} from '../types/messaging';

/**
 * 메시지 서비스 옵션
 */
export interface MessageServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

/**
 * 메시징 시스템 서비스
 * @description 채팅방, 메시지, 참여자 관리를 담당
 */
export class MessageService extends BaseService<Message> {
  constructor(options: MessageServiceOptions = {}) {
    super({
      baseUrl: options.baseUrl || '/api/messages',
      defaultHeaders: options.defaultHeaders,
    });
  }

  // =============================================================================
  // 채팅방 관리
  // =============================================================================

  /**
   * 사용자의 채팅방 목록 조회
   * @param page 페이지 번호 (기본값: 1)
   * @param pageSize 페이지당 항목 수 (기본값: 20)
   */
  async getChatRooms(
    page: number = 1,
    pageSize: number = 20
  ): Promise<CommonResponse<ChatRoomListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.get<ChatRoomListResponse>(`/rooms?${params}`);
  }

  /**
   * 특정 채팅방 정보 조회
   * @param roomId 채팅방 ID
   */
  async getChatRoom(roomId: string): Promise<CommonResponse<ChatRoom>> {
    return this.get<ChatRoom>(`/rooms/${roomId}`);
  }

  /**
   * 새로운 채팅방 생성
   * @param request 채팅방 생성 요청
   */
  async createChatRoom(request: CreateChatRoomRequest): Promise<CommonResponse<ChatRoom>> {
    return this.post<ChatRoom>('/rooms', request);
  }

  /**
   * 채팅방 나가기
   * @param roomId 채팅방 ID
   */
  async leaveChatRoom(roomId: string): Promise<CommonResponse<void>> {
    return this.delete<void>(`/rooms/${roomId}/leave`);
  }

  /**
   * 채팅방 참여자 초대
   * @param request 참여자 초대 요청
   */
  async inviteParticipants(request: InviteChatParticipantRequest): Promise<CommonResponse<void>> {
    return this.post<void>('/rooms/invite', request);
  }

  /**
   * 채팅방 설정 업데이트
   * @param request 설정 업데이트 요청
   */
  async updateChatRoomSettings(request: UpdateChatRoomSettingsRequest): Promise<CommonResponse<ChatParticipant>> {
    return this.patch<ChatParticipant>(`/rooms/${request.room_id}/settings`, request.notification_settings);
  }

  // =============================================================================
  // 메시지 관리
  // =============================================================================

  /**
   * 채팅방의 메시지 목록 조회
   * @param roomId 채팅방 ID
   * @param page 페이지 번호 (기본값: 1)
   * @param pageSize 페이지당 항목 수 (기본값: 50)
   */
  async getMessages(
    roomId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<CommonResponse<MessageListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.get<MessageListResponse>(`/rooms/${roomId}/messages?${params}`);
  }

  /**
   * 메시지 전송
   * @param request 메시지 전송 요청
   */
  async sendMessage(request: SendMessageRequest): Promise<CommonResponse<Message>> {
    return this.post<Message>('/send', request);
  }

  /**
   * 메시지 수정
   * @param messageId 메시지 ID
   * @param content 새로운 내용
   */
  async updateMessage(messageId: string, content: string): Promise<CommonResponse<Message>> {
    return this.patch<Message>(`/${messageId}`, { content });
  }

  /**
   * 메시지 삭제
   * @param messageId 메시지 ID
   */
  async deleteMessage(messageId: string): Promise<CommonResponse<void>> {
    return this.delete<void>(`/${messageId}`);
  }

  /**
   * 메시지를 읽음으로 처리
   * @param request 읽음 처리 요청
   */
  async markMessagesAsRead(request: MarkMessagesAsReadRequest): Promise<CommonResponse<void>> {
    return this.patch<void>(`/rooms/${request.room_id}/read`, {
      message_ids: request.message_ids,
      read_until: request.read_until,
    });
  }

  /**
   * 메시지 검색
   * @param options 검색 옵션
   */
  async searchMessages(options: MessageSearchOptions): Promise<CommonResponse<MessageListResponse>> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.get<MessageListResponse>(`/search?${params}`);
  }

  /**
   * 채팅방 통계 조회
   */
  async getChatRoomStats(): Promise<CommonResponse<ChatRoomStats>> {
    return this.get<ChatRoomStats>('/stats');
  }

  // =============================================================================
  // 파일 관련 기능
  // =============================================================================

  /**
   * 메시지용 파일 업로드
   * @param file 업로드할 파일
   * @param roomId 채팅방 ID
   */
  async uploadMessageFile(file: File, roomId: string): Promise<CommonResponse<{ file_id: string; file_url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', roomId);

    return this.post<{ file_id: string; file_url: string }>('/upload', formData);
  }

  /**
   * 메시지 파일 다운로드 URL 조회
   * @param fileId 파일 ID
   */
  async getMessageFileUrl(fileId: string): Promise<CommonResponse<{ download_url: string }>> {
    return this.get<{ download_url: string }>(`/files/${fileId}/download-url`);
  }

  // =============================================================================
  // Silent 메서드 (글로벌 로더 비활성화)
  // =============================================================================

  /**
   * Silent - 채팅방 목록 조회 (로더 없이)
   */
  async getChatRoomsSilent(
    page: number = 1,
    pageSize: number = 20
  ): Promise<CommonResponse<ChatRoomListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.getSilent<ChatRoomListResponse>(`/rooms?${params}`);
  }

  /**
   * Silent - 메시지 목록 조회 (로더 없이)
   */
  async getMessagesSilent(
    roomId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<CommonResponse<MessageListResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.getSilent<MessageListResponse>(`/rooms/${roomId}/messages?${params}`);
  }

  /**
   * Silent - 메시지 전송 (로더 없이)
   */
  async sendMessageSilent(request: SendMessageRequest): Promise<CommonResponse<Message>> {
    return this.postSilent<Message>('/send', request);
  }

  /**
   * Silent - 읽음 처리 (로더 없이)
   */
  async markMessagesAsReadSilent(request: MarkMessagesAsReadRequest): Promise<CommonResponse<void>> {
    return this.patchSilent<void>(`/rooms/${request.room_id}/read`, {
      message_ids: request.message_ids,
      read_until: request.read_until,
    });
  }

  /**
   * Silent - 채팅방 통계 조회 (로더 없이)
   */
  async getChatRoomStatsSilent(): Promise<CommonResponse<ChatRoomStats>> {
    return this.getSilent<ChatRoomStats>('/stats');
  }

  // =============================================================================
  // 유틸리티 메서드
  // =============================================================================

  /**
   * 1:1 채팅방 찾기 또는 생성
   * @param targetUserId 대화 상대 사용자 ID
   */
  async getOrCreateDirectChat(targetUserId: string): Promise<CommonResponse<ChatRoom>> {
    return this.post<ChatRoom>('/rooms/direct', { target_user_id: targetUserId });
  }

  /**
   * 사용자와의 채팅방 존재 여부 확인
   * @param targetUserId 대화 상대 사용자 ID
   */
  async checkDirectChatExists(targetUserId: string): Promise<CommonResponse<{ exists: boolean; room_id?: string }>> {
    return this.get<{ exists: boolean; room_id?: string }>(`/rooms/direct/check/${targetUserId}`);
  }

  /**
   * 채팅방 참여자 목록 조회
   * @param roomId 채팅방 ID
   */
  async getChatParticipants(roomId: string): Promise<CommonResponse<ChatParticipant[]>> {
    return this.get<ChatParticipant[]>(`/rooms/${roomId}/participants`);
  }
}

// 기본 인스턴스 생성 (하위 호환성)
export const messageService = new MessageService();

// 타입 재export
export type {
  ChatRoom,
  ChatParticipant,
  Message,
  ChatRoomListResponse,
  MessageListResponse,
  CreateChatRoomRequest,
  SendMessageRequest,
  UpdateChatRoomSettingsRequest,
  MessageSearchOptions,
  InviteChatParticipantRequest,
  ChatRoomStats,
  MarkMessagesAsReadRequest,
  OnlineUser,
  ChatRoomStatus,
  MessageStatus
} from '../types/messaging';