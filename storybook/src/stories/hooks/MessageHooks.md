# MessageHooks 사용 가이드

**@team-semicolon/community-core**의 MessageHooks는 실시간 메시징 시스템을 위한 React Query 기반 훅들을 제공합니다.

## 📋 제공하는 훅들

### 💬 useMessagesQuery
특정 채팅방의 메시지 목록 조회

### 📤 useSendMessageCommand
새 메시지 전송

### 🔄 useMessageRealtime
실시간 메시지 업데이트 구독

## 🚀 실제 구현 예시

### 1. 기본 채팅방 구현

```tsx
import { 
  useMessagesQuery, 
  useSendMessageCommand 
} from '@team-semicolon/community-core';

function ChatRoom({ roomId, currentUserId }) {
  const [newMessage, setNewMessage] = useState('');
  
  // 메시지 목록 조회
  const { 
    data: messages, 
    isLoading, 
    error 
  } = useMessagesQuery({
    roomId,
    enabled: !!roomId
  });
  
  // 메시지 전송
  const { 
    mutate: sendMessage, 
    isPending: isSending 
  } = useSendMessageCommand({
    onSuccess: () => {
      setNewMessage('');
      scrollToBottom();
    },
    onError: (error) => {
      alert('메시지 전송 실패: ' + error.message);
    }
  });
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    sendMessage({
      roomId,
      content: newMessage.trim(),
      userId: currentUserId
    });
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (isLoading) return <div>메시지를 불러오는 중...</div>;
  if (error) return <div>메시지 로딩 실패: {error.message}</div>;
  
  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages?.map((message) => (
          <div 
            key={message.id} 
            className={'message ' + (message.userId === currentUserId ? 'sent' : 'received')}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={isSending}
        />
        <button type="submit" disabled={!newMessage.trim() || isSending}>
          {isSending ? '전송 중...' : '전송'}
        </button>
      </form>
    </div>
  );
}
```

### 2. 실시간 채팅방 (Supabase Realtime 통합)

```tsx
import { 
  useMessagesQuery, 
  useSendMessageCommand,
  useMessageRealtime 
} from '@team-semicolon/community-core';

function RealtimeChatRoom({ roomId, currentUserId }) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // 메시지 목록 조회
  const { 
    data: messages, 
    isLoading 
  } = useMessagesQuery({
    roomId,
    enabled: !!roomId
  });
  
  // 실시간 메시지 업데이트
  useMessageRealtime({
    roomId,
    onNewMessage: (message) => {
      // 새 메시지 도착 시 자동 스크롤
      setTimeout(scrollToBottom, 100);
      
      // 알림음 재생 (다른 사용자 메시지만)
      if (message.userId !== currentUserId) {
        playNotificationSound();
      }
    },
    onTyping: (data) => {
      setIsTyping(data.userId !== currentUserId && data.isTyping);
    }
  });
  
  // 메시지 전송
  const { mutate: sendMessage } = useSendMessageCommand({
    onSuccess: () => {
      setNewMessage('');
      scrollToBottom();
    }
  });
  
  // 타이핑 상태 전송
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // 타이핑 상태 전송 (디바운싱)
    debouncedSendTyping(true);
    
    // 2초 후 타이핑 중지
    setTimeout(() => debouncedSendTyping(false), 2000);
  };
  
  const debouncedSendTyping = useCallback(
    debounce((typing) => {
      // 타이핑 상태를 실시간으로 전송
      supabase.channel(roomId)
        .send({
          type: 'typing',
          payload: { userId: currentUserId, isTyping: typing }
        });
    }, 500),
    [roomId, currentUserId]
  );
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessage({
      roomId,
      content: newMessage.trim(),
      userId: currentUserId
    });
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const playNotificationSound = () => {
    const audio = new Audio('/message-notification.mp3');
    audio.play().catch(console.error);
  };
  
  return (
    <div className="realtime-chat-room">
      <div className="messages-container">
        {messages?.map((message) => (
          <div 
            key={message.id} 
            className={'message ' + (message.userId === currentUserId ? 'sent' : 'received')}
          >
            <div className="message-avatar">
              <img src={message.user?.avatar} alt={message.user?.name} />
            </div>
            <div className="message-bubble">
              <div className="message-sender">{message.user?.name}</div>
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>상대방이 메시지를 입력 중...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="메시지를 입력하세요..."
        />
        <button type="submit" disabled={!newMessage.trim()}>
          전송
        </button>
      </form>
    </div>
  );
}
```

### 3. 채팅방 목록과 메시지 통합

```tsx
import { 
  useChatRoomsQuery,
  useMessagesQuery, 
  useSendMessageCommand 
} from '@team-semicolon/community-core';

function MessagingApp({ currentUserId }) {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  
  // 채팅방 목록 조회
  const { 
    data: chatRooms, 
    isLoading: isLoadingRooms 
  } = useChatRoomsQuery({
    userId: currentUserId
  });
  
  // 선택된 채팅방의 메시지들
  const { 
    data: messages, 
    isLoading: isLoadingMessages 
  } = useMessagesQuery({
    roomId: selectedRoomId,
    enabled: !!selectedRoomId
  });
  
  // 메시지 전송
  const { mutate: sendMessage } = useSendMessageCommand({
    onSuccess: () => {
      setNewMessage('');
    }
  });
  
  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRoomId) return;
    
    sendMessage({
      roomId: selectedRoomId,
      content: newMessage.trim(),
      userId: currentUserId
    });
  };
  
  return (
    <div className="messaging-app">
      {/* 채팅방 목록 */}
      <div className="chat-rooms-sidebar">
        <h3>채팅방 목록</h3>
        
        {isLoadingRooms ? (
          <div>채팅방을 불러오는 중...</div>
        ) : (
          <div className="room-list">
            {chatRooms?.map((room) => (
              <div
                key={room.id}
                className={'room-item ' + (selectedRoomId === room.id ? 'active' : '')}
                onClick={() => handleRoomSelect(room.id)}
              >
                <div className="room-name">{room.name}</div>
                <div className="room-last-message">
                  {room.lastMessage?.content || '메시지 없음'}
                </div>
                <div className="room-time">
                  {room.lastMessage?.createdAt ? 
                    formatMessageTime(room.lastMessage.createdAt) : ''
                  }
                </div>
                {room.unreadCount > 0 && (
                  <div className="unread-badge">{room.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 메시지 영역 */}
      <div className="messages-main">
        {selectedRoomId ? (
          <>
            <div className="messages-header">
              <h4>
                {chatRooms?.find(r => r.id === selectedRoomId)?.name}
              </h4>
            </div>
            
            <div className="messages-container">
              {isLoadingMessages ? (
                <div>메시지를 불러오는 중...</div>
              ) : (
                messages?.map((message) => (
                  <div 
                    key={message.id} 
                    className={'message ' + (message.userId === currentUserId ? 'sent' : 'received')}
                  >
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
              />
              <button type="submit" disabled={!newMessage.trim()}>
                전송
              </button>
            </form>
          </>
        ) : (
          <div className="no-room-selected">
            채팅방을 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. 메시지 검색 및 필터링

```tsx
import { 
  useMessagesQuery,
  useMessageSearchQuery 
} from '@team-semicolon/community-core';

function SearchableChat({ roomId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'images', 'files'
  
  // 기본 메시지 목록
  const { 
    data: allMessages, 
    isLoading 
  } = useMessagesQuery({
    roomId,
    enabled: !!roomId && !searchTerm
  });
  
  // 검색 결과
  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useMessageSearchQuery({
    roomId,
    searchTerm,
    filterType,
    enabled: !!roomId && !!searchTerm
  });
  
  const messages = searchTerm ? searchResults : allMessages;
  
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직은 useMessageSearchQuery에서 자동 처리
  };
  
  const highlightText = (text, term) => {
    if (!term) return text;
    
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : part
    );
  };
  
  return (
    <div className="searchable-chat">
      {/* 검색 및 필터 영역 */}
      <div className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="메시지 검색..."
          />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">전체</option>
            <option value="text">텍스트만</option>
            <option value="images">이미지만</option>
            <option value="files">파일만</option>
          </select>
        </form>
        
        {searchTerm && (
          <div className="search-info">
            {isSearching ? (
              '검색 중...'
            ) : (
              `"${searchTerm}" 검색 결과: ${messages?.length || 0}개`
            )}
          </div>
        )}
      </div>
      
      {/* 메시지 목록 */}
      <div className="messages-container">
        {(isLoading || isSearching) ? (
          <div>로딩 중...</div>
        ) : (
          messages?.map((message) => (
            <div key={message.id} className="message">
              <div className="message-header">
                <span className="message-sender">{message.user?.name}</span>
                <span className="message-time">
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
              
              <div className="message-content">
                {message.type === 'text' ? (
                  <div>
                    {highlightText(message.content, searchTerm)}
                  </div>
                ) : message.type === 'image' ? (
                  <div className="message-image">
                    <img src={message.fileUrl} alt="첨부 이미지" />
                    {message.content && (
                      <div className="image-caption">
                        {highlightText(message.content, searchTerm)}
                      </div>
                    )}
                  </div>
                ) : message.type === 'file' ? (
                  <div className="message-file">
                    <a href={message.fileUrl} download>
                      📎 {message.fileName}
                    </a>
                    {message.content && (
                      <div className="file-description">
                        {highlightText(message.content, searchTerm)}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

## 💡 사용 팁

### 1. 메시지 캐싱 최적화
```tsx
// React Query의 캐싱을 활용한 성능 최적화
const { data: messages } = useMessagesQuery({
  roomId,
  staleTime: 30000, // 30초간 fresh 상태 유지
  cacheTime: 300000, // 5분간 캐시 유지
});
```

### 2. 실시간 업데이트 최적화
```tsx
// 실시간 연결은 필요할 때만 활성화
useMessageRealtime({
  roomId,
  enabled: isRoomActive && isWindowFocused,
  onNewMessage: handleNewMessage
});
```

### 3. 메시지 전송 에러 처리
```tsx
const { mutate: sendMessage } = useSendMessageCommand({
  onError: (error) => {
    // 네트워크 에러 vs 서버 에러 구분
    if (error.code === 'NETWORK_ERROR') {
      setOfflineMessages(prev => [...prev, failedMessage]);
    } else {
      showErrorToast(error.message);
    }
  }
});
```

## ⚠️ 주의사항

1. **실시간 연결**: 메모리 누수 방지를 위해 컴포넌트 unmount 시 자동으로 연결 해제됩니다
2. **메시지 순서**: 실시간으로 도착하는 메시지의 순서가 바뀔 수 있으므로 timestamp 기준 정렬이 필요합니다
3. **캐시 관리**: 긴 채팅 기록은 메모리 사용량이 클 수 있으므로 적절한 페이지네이션이 필요합니다
4. **타이핑 상태**: 과도한 실시간 전송을 방지하기 위해 디바운싱을 적용하세요

## 🔗 관련 훅들

- **useNotificationsQuery**: 메시지 알림 관리
- **useGlobalLoader**: 메시지 전송/로딩 상태 표시
- **useAuth**: 사용자 인증 정보 (메시지 전송자 정보)