'use client';

import PointInput from '@atoms/PointInput/PointInput';
import RadioButton from '@atoms/RadioButton/RadioButton';
import UserSearchInput from '@atoms/UserSearchInput/UserSearchInput';
import { usePointCommand } from '@hooks/commands/usePointCommand';
import {
  useAppDispatch,
  useGlobalPopup,
  useRouterWithLoader,
} from '@hooks/common';
import UserSearchModal from '@organisms/UserSearchModal/UserSearchModal';
import { showToast } from '@redux/Features/Toast/toastSlice';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PointManageProps {
  userId?: number;
  userInfo?: any;
}

export default function PointManage({ userId, userInfo }: PointManageProps) {
  const dispatch = useAppDispatch();
  const router = useRouterWithLoader();
  const nextRouter = useRouter(); // next/navigation용
  const { confirm, alert } = useGlobalPopup();
  const { addPoint, subtractPoint } = usePointCommand();

  // 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pointAmount, setPointAmount] = useState<string>('');
  const [pointType, setPointType] = useState<string>('ADD');
  const [reason, setReason] = useState<string>('');

  // 포인트 금액 변경 핸들러 (차감 시 최대값 제한)
  const handlePointAmountChange = (value: string) => {
    const inputAmount = parseInt(value) || 0;
    const currentPoint = selectedUser?.point ?? 0;

    if (pointType === 'SUBTRACT' && inputAmount > currentPoint) {
      // 차감 시 현재 보유 포인트를 초과하면 현재 보유 포인트로 제한
      setPointAmount(currentPoint.toString());
    } else {
      setPointAmount(value);
    }
  };

  // 사용자 검색 상태
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    nickname: string;
    profileImage?: string;
    level?: string;
    point?: number;
  } | null>(
    userId && userInfo
      ? {
          id: userId,
          nickname: userInfo.nickname || '닉네임 없음',
          profileImage:
            userInfo.profileImageUrl || userInfo.profileImage || undefined,
          level: userInfo.level || userInfo.levelName || undefined,
          point: userInfo.point || userInfo.currentPoint || undefined,
        }
      : null
  );
  const [initialUserId, setInitialUserId] = useState(userId); // 최초 진입 user-id 기억

  // 포인트 타입 옵션
  const POINT_TYPE_OPTIONS = [
    { value: 'ADD', label: '포인트 지급' },
    { value: 'SUBTRACT', label: '포인트 차감' },
  ];

  // 폼 유효성 검사
  const validateForm = async (): Promise<boolean> => {
    if (!selectedUser) {
      await alert('사용자를 선택해주세요.', '입력 확인');
      return false;
    }
    if (!pointAmount.trim()) {
      await alert('포인트 금액을 입력해주세요.', '입력 확인');
      return false;
    }
    if (parseInt(pointAmount) <= 0) {
      await alert('포인트 금액은 0보다 커야 합니다.', '입력 확인');
      return false;
    }
    if (!reason.trim()) {
      await alert('사유를 입력해주세요.', '입력 확인');
      return false;
    }
    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!(await validateForm())) return;

    const amount = parseInt(pointAmount);
    const currentPoint = selectedUser?.point ?? 0;
    const finalPoint = Math.max(
      0,
      currentPoint + (pointType === 'ADD' ? amount : -amount)
    );

    const isConfirmed = await confirm(
      `${selectedUser?.nickname} 유저에게 ${amount}포인트를 ${
        pointType === 'ADD' ? '지급' : '차감'
      } 하시겠습니까?<br><br>[${
        pointType === 'ADD' ? '지급' : '회수'
      } 후 최종 포인트: <span style="color: #ff6b35; font-weight: bold;">${finalPoint}</span>]`,
      '포인트 처리 확인'
    );

    if (!isConfirmed) return;

    setIsSubmitting(true);

    try {
      let response;

      if (pointType === 'ADD') {
        response = await addPoint(selectedUser!.id, amount, reason.trim());
      } else {
        response = await subtractPoint(selectedUser!.id, amount, reason.trim());
      }

      if (response.successOrNot === 'Y') {
        dispatch(
          showToast({
            title: '포인트 관리',
            content:
              pointType === 'ADD'
                ? '포인트가 지급되었습니다.'
                : '포인트가 차감되었습니다.',
            headerTextColor: 'text-green-500',
          })
        );

        // /me로 이동
        router.replace('/me');
      } else {
        dispatch(
          showToast({
            title: '포인트 관리 실패',
            content: response.data || '포인트 처리 중 오류가 발생했습니다.',
            headerTextColor: 'text-red-500',
          })
        );
      }
    } catch (error) {
      console.error('포인트 관리 오류:', error);
      dispatch(
        showToast({
          title: '포인트 관리 실패',
          content: '포인트 관리 중 오류가 발생했습니다.',
          headerTextColor: 'text-red-500',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 핸들러
  const handleCancel = async () => {
    const isConfirmed = await confirm(
      '작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?'
    );
    if (isConfirmed) {
      router.replace('/me');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-custom outline outline-1 outline-offset-[-1px] outline-zinc-200 overflow-hidden p-4 sm:p-5">
      <div className="w-full flex flex-col gap-5 mb-8">
        <h2 className="text-center sm:text-left text-neutral-900 text-base sm:text-lg font-medium font-nexon">
          포인트 지급/회수
        </h2>
        <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-neutral-900"></div>
      </div>

      <div className="w-full flex flex-col gap-8">
        {/* 사용자 검색/선택 */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
            대상 사용자 <span className="text-primary">*</span>
          </label>
          <UserSearchInput
            value={selectedUser ? selectedUser.nickname : ''}
            onClick={() => setUserSearchOpen(true)}
            placeholder="닉네임으로 사용자 검색"
          />
        </div>

        {/* 유저 정보 카드 */}
        {selectedUser && (
          <div className="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <Image
                src={
                  selectedUser.profileImage || '/images/main/user-profile.png'
                }
                alt="프로필"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover border border-gray-300 bg-white"
              />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {selectedUser.level && (
                    <Image
                      src={`/icons/level/${selectedUser.level}.png`}
                      alt={`레벨 ${selectedUser.level}`}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="font-bold text-base text-neutral-900 font-nexon">
                    {selectedUser.nickname}
                  </span>
                  {selectedUser.level && (
                    <span className="px-2 py-0.5 rounded bg-primary text-white text-xs font-bold font-nexon">
                      Lv. {selectedUser.level}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 font-nexon">
                  보유 포인트:{' '}
                  <span className="text-primary font-bold">
                    {(selectedUser.point ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedUser(null);
                nextRouter.replace('/me/manage/point');
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="선택 해제"
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
          </div>
        )}

        {/* 포인트 타입 선택 */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
            포인트 타입 <span className="text-primary">*</span>
          </label>
          <div className="flex gap-6">
            {POINT_TYPE_OPTIONS.map(option => (
              <RadioButton
                key={option.value}
                checked={pointType === option.value}
                onChange={() => setPointType(option.value)}
                name="pointType"
                value={option.value}
              >
                {option.label}
              </RadioButton>
            ))}
          </div>
        </div>

        {/* 포인트 금액 */}
        <PointInput
          value={pointAmount}
          onChange={handlePointAmountChange}
          currentPoint={selectedUser?.point ?? 0}
          pointType={pointType as 'ADD' | 'SUBTRACT'}
        />

        {/* 사유 */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-text-tertiary text-xs sm:text-sm font-normal font-nexon">
            사유 <span className="text-primary">*</span>
          </label>
          <textarea
            placeholder="포인트 지급/차감 사유를 입력해주세요."
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg border border-border-default text-text-primary text-xs sm:text-[13px] font-normal font-nexon leading-normal focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* 구분선 */}
        <div className="w-full h-0 border border-border-default"></div>

        {/* 버튼 영역 */}
        <div className="w-full flex justify-center sm:justify-end gap-2 mt-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2 bg-text-secondary rounded-lg text-white text-sm font-bold font-nexon disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg text-white text-sm font-bold font-nexon bg-primary hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? '처리 중...' : '확인'}
          </button>
        </div>
      </div>
      {/* 사용자 검색 모달 */}
      {userSearchOpen && (
        <UserSearchModal
          onSelect={user => {
            setSelectedUser(user);
            setUserSearchOpen(false);
            // url 변경
            nextRouter.replace(`/me/manage/point?user-id=${user.id}`);
          }}
          onClose={() => setUserSearchOpen(false)}
        />
      )}
    </div>
  );
}
