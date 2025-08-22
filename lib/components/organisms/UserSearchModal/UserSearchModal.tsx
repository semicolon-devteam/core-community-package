import React, { useState } from 'react';
import { useUserCommands } from '@hooks/commands/useUserCommands';
import { useGlobalLoader } from '@hooks/common/useGlobalLoader';

interface User {
  id: number;
  nickname: string;
  profileImage?: string;
  level?: string;
  point?: number;
}

interface UserSearchModalProps {
  onSelect: (user: User) => void;
  onClose: () => void;
}

export default function UserSearchModal({
  onSelect,
  onClose,
}: UserSearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState('');

  const { getUserInfo } = useUserCommands();
  const { withLoader } = useGlobalLoader();

  // API 호출로 검색
  const handleSearch = async () => {
    try {
      const response = await withLoader(async () => {
        return await getUserInfo(keyword, true);
      });

      if (response.successOrNot === 'Y' && response.data) {
        const users = Array.isArray(response.data)
          ? response.data
          : [response.data];
        const formattedUsers = users.map((userData: any) => ({
          id: userData.id || userData.userId,
          nickname: userData.nickname,
          profileImage: userData.profileImageUrl || userData.profileImage,
          level: userData.level || userData.levelName,
          point: userData.point || userData.currentPoint,
        }));
        setResults(formattedUsers);
        setError('');
      } else {
        setResults([]);
        setError('사용자를 찾을 수 없습니다.');
      }
    } catch (e) {
      console.error('사용자 검색 오류:', e);
      setError('검색 중 오류가 발생했습니다.');
      setResults([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <h3 className="text-lg font-bold mb-4">사용자 검색</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder="닉네임 없이 검색할경우 최대 100명"
            className="flex-1 h-10 px-3 rounded-lg border border-border-default text-sm font-nexon focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="px-4 h-10 rounded-lg bg-primary text-white font-bold font-nexon text-sm"
          >
            검색
          </button>
        </div>
        {error && <div className="text-center text-red-500 py-2">{error}</div>}
        <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {results.map((user, index) => (
            <li
              key={user.id || `user-${index}`}
              className="py-3 px-2 cursor-pointer hover:bg-gray-50"
              onClick={() => onSelect(user)}
            >
              <span className="font-nexon text-sm text-text-primary">
                {user.nickname}
              </span>
              <span className="ml-2 text-xs text-gray-400">ID: {user.id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
