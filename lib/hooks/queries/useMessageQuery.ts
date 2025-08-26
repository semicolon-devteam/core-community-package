import { useQuery } from '@tanstack/react-query';
import { MessageService } from '../../services/messageService';
import type { 
  ChatRoomListResponse,
  MessageListResponse,
  ChatRoom,
  ChatParticipant,
  ChatRoomStats,
  MessageSearchOptions
} from '../../types/messaging';

const messageService = new MessageService();

/**
 * 채팅방 목록 조회 훅
 */
export const useChatRoomsQuery = ({
  page = 1,
  pageSize = 20,
  enabled = true,
  silent = false
}: {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  silent?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ['chatRooms', page, pageSize],
    queryFn: async () => {
      const response = silent 
        ? await messageService.getChatRoomsSilent(page, pageSize)
        : await messageService.getChatRooms(page, pageSize);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 목록 조회 중 오류가 발생했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

/**
 * 특정 채팅방 정보 조회 훅
 */
export const useChatRoomQuery = ({
  roomId,
  enabled = true
}: {
  roomId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: async () => {
      const response = await messageService.getChatRoom(roomId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 정보 조회 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!roomId,
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};

/**
 * 채팅방 메시지 목록 조회 훅
 */
export const useMessagesQuery = ({
  roomId,
  page = 1,
  pageSize = 50,
  enabled = true,
  silent = false
}: {
  roomId: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
  silent?: boolean;
}) => {
  return useQuery({
    queryKey: ['messages', roomId, page, pageSize],
    queryFn: async () => {
      const response = silent
        ? await messageService.getMessagesSilent(roomId, page, pageSize)
        : await messageService.getMessages(roomId, page, pageSize);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '메시지 목록 조회 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!roomId,
    staleTime: 1000 * 30, // 30초
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 30, // 30초마다 자동 갱신
  });
};

/**
 * 채팅방 참여자 목록 조회 훅
 */
export const useChatParticipantsQuery = ({
  roomId,
  enabled = true
}: {
  roomId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['chatParticipants', roomId],
    queryFn: async () => {
      const response = await messageService.getChatParticipants(roomId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 참여자 조회 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!roomId,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

/**
 * 채팅방 통계 조회 훅
 */
export const useChatRoomStatsQuery = ({
  enabled = true,
  silent = false
}: {
  enabled?: boolean;
  silent?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ['chatRoomStats'],
    queryFn: async () => {
      const response = silent
        ? await messageService.getChatRoomStatsSilent()
        : await messageService.getChatRoomStats();
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 통계 조회 중 오류가 발생했습니다.');
    },
    enabled,
    staleTime: 1000 * 60 * 10, // 10분
    refetchOnWindowFocus: false,
  });
};

/**
 * 메시지 검색 훅
 */
export const useMessageSearchQuery = ({
  searchOptions,
  enabled = true
}: {
  searchOptions: MessageSearchOptions;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['messageSearch', searchOptions],
    queryFn: async () => {
      const response = await messageService.searchMessages(searchOptions);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '메시지 검색 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!searchOptions.room_id && !!searchOptions.query,
    staleTime: 1000 * 60, // 1분
    refetchOnWindowFocus: false,
  });
};

/**
 * 1:1 채팅방 존재 여부 확인 훅
 */
export const useDirectChatExistsQuery = ({
  targetUserId,
  enabled = true
}: {
  targetUserId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['directChatExists', targetUserId],
    queryFn: async () => {
      const response = await messageService.checkDirectChatExists(targetUserId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 존재 여부 확인 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!targetUserId,
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};

/**
 * 메시지 파일 다운로드 URL 조회 훅
 */
export const useMessageFileUrlQuery = ({
  fileId,
  enabled = true
}: {
  fileId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ['messageFileUrl', fileId],
    queryFn: async () => {
      const response = await messageService.getMessageFileUrl(fileId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '파일 URL 조회 중 오류가 발생했습니다.');
    },
    enabled: enabled && !!fileId,
    staleTime: 1000 * 60 * 10, // 10분 (URL은 오래 유지)
    refetchOnWindowFocus: false,
  });
};