import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageService } from '../../services/messageService';
import type { 
  CreateChatRoomRequest,
  SendMessageRequest,
  UpdateChatRoomSettingsRequest,
  InviteChatParticipantRequest,
  MarkMessagesAsReadRequest,
  ChatRoom,
  Message
} from '../../types/messaging';

const messageService = new MessageService();

/**
 * 채팅방 생성 명령 훅
 */
export const useCreateChatRoomCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateChatRoomRequest) => {
      const response = await messageService.createChatRoom(request);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 생성 중 오류가 발생했습니다.');
    },
    onSuccess: () => {
      // 채팅방 목록 다시 조회
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['chatRoomStats'] });
    },
  });
};

/**
 * 1:1 채팅방 찾기 또는 생성 명령 훅
 */
export const useGetOrCreateDirectChatCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const response = await messageService.getOrCreateDirectChat(targetUserId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '1:1 채팅방 생성 중 오류가 발생했습니다.');
    },
    onSuccess: () => {
      // 채팅방 목록 및 통계 갱신
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['chatRoomStats'] });
      queryClient.invalidateQueries({ queryKey: ['directChatExists'] });
    },
  });
};

/**
 * 메시지 전송 명령 훅
 */
export const useSendMessageCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, silent = false }: { request: SendMessageRequest; silent?: boolean }) => {
      const response = silent
        ? await messageService.sendMessageSilent(request)
        : await messageService.sendMessage(request);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '메시지 전송 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방의 메시지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['messages', data.room_id] });
      // 채팅방 목록 갱신 (last_message 업데이트)
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.room_id] });
    },
  });
};

/**
 * 메시지 수정 명령 훅
 */
export const useUpdateMessageCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      const response = await messageService.updateMessage(messageId, content);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '메시지 수정 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방의 메시지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['messages', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.room_id] });
    },
  });
};

/**
 * 메시지 삭제 명령 훅
 */
export const useDeleteMessageCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, roomId }: { messageId: string; roomId: string }) => {
      const response = await messageService.deleteMessage(messageId);
      
      if (response.successOrNot === 'Y') {
        return { messageId, roomId };
      }
      throw new Error(response.message || '메시지 삭제 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방의 메시지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['messages', data.roomId] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.roomId] });
    },
  });
};

/**
 * 메시지를 읽음으로 처리 명령 훅
 */
export const useMarkMessagesAsReadCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ request, silent = false }: { request: MarkMessagesAsReadRequest; silent?: boolean }) => {
      const response = silent
        ? await messageService.markMessagesAsReadSilent(request)
        : await messageService.markMessagesAsRead(request);
      
      if (response.successOrNot === 'Y') {
        return request;
      }
      throw new Error(response.message || '메시지 읽음 처리 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방의 메시지 및 채팅방 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['messages', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['chatRoomStats'] });
    },
  });
};

/**
 * 채팅방 나가기 명령 훅
 */
export const useLeaveChatRoomCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await messageService.leaveChatRoom(roomId);
      
      if (response.successOrNot === 'Y') {
        return roomId;
      }
      throw new Error(response.message || '채팅방 나가기 중 오류가 발생했습니다.');
    },
    onSuccess: (roomId) => {
      // 채팅방 목록 및 통계 갱신
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['chatRoomStats'] });
      // 해당 채팅방 관련 모든 쿼리 제거
      queryClient.removeQueries({ queryKey: ['chatRoom', roomId] });
      queryClient.removeQueries({ queryKey: ['messages', roomId] });
      queryClient.removeQueries({ queryKey: ['chatParticipants', roomId] });
    },
  });
};

/**
 * 채팅방 참여자 초대 명령 훅
 */
export const useInviteParticipantsCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: InviteChatParticipantRequest) => {
      const response = await messageService.inviteParticipants(request);
      
      if (response.successOrNot === 'Y') {
        return request;
      }
      throw new Error(response.message || '참여자 초대 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방의 참여자 목록 및 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['chatParticipants', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRoomStats'] });
    },
  });
};

/**
 * 채팅방 설정 업데이트 명령 훅
 */
export const useUpdateChatRoomSettingsCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: UpdateChatRoomSettingsRequest) => {
      const response = await messageService.updateChatRoomSettings(request);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '채팅방 설정 업데이트 중 오류가 발생했습니다.');
    },
    onSuccess: (data) => {
      // 해당 채팅방 참여자 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['chatParticipants', data.room_id] });
      queryClient.invalidateQueries({ queryKey: ['chatRoom', data.room_id] });
    },
  });
};

/**
 * 메시지 파일 업로드 명령 훅
 */
export const useUploadMessageFileCommand = () => {
  return useMutation({
    mutationFn: async ({ file, roomId }: { file: File; roomId: string }) => {
      const response = await messageService.uploadMessageFile(file, roomId);
      
      if (response.successOrNot === 'Y' && response.data) {
        return response.data;
      }
      throw new Error(response.message || '파일 업로드 중 오류가 발생했습니다.');
    },
  });
};