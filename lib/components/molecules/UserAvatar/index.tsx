import ProfileChanger from "@organisms/ProfileChanger";
import { optimizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

import { useState } from "react";

interface UserAvatarProps {
  profileImage?: string;
  size?: number;
  className?: string;
  isChangeButton?: boolean;
  onClick?: () => void;
}

export default function UserAvatar({
  profileImage = "/icons/user-profile.svg",
  size = 60,
  className = "",
  isChangeButton = false,
  onClick,
}: UserAvatarProps) {
  const [showProfileChange, setShowProfileChange] = useState(false);

  const handleClick = () => {
    if (isChangeButton) {
      setShowProfileChange(true);
    }
    onClick?.();
  };

  return (
    <>
      <div className={`relative ${isChangeButton ? 'cursor-pointer group' : ''} ${className}`} onClick={handleClick}>
        <div 
          className="bg-[#f8f8fb] rounded-full border border-border-default flex items-center justify-center overflow-hidden"
          style={{ width: size, height: size }}
        >
          <Image
            src={optimizeImageSrc(profileImage || "/icons/user-profile.svg", 'md')}
            alt="프로필 이미지"
            width={60}
            height={60}
            className="object-cover rounded-full"
          />
        </div>
        {/* 편집 아이콘 */}
        {isChangeButton && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white group-hover:bg-gray-300 rounded-full border border-border-default flex items-center justify-center shadow-sm transition-colors duration-200">
            <svg 
              className="w-3 h-3 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* 프로필 변경 모달 */}
      {isChangeButton && showProfileChange && (
        <div className="fixed top-0 left-0 w-full h-full z-20 flex justify-center items-center">
          <ProfileChanger
            setShowProfileChange={setShowProfileChange}
            originalProfileImage={profileImage || "/icons/user-profile.svg"}
          />
          <div 
            className="fixed w-full h-full bg-gray-600 opacity-30 -z-10"
            onClick={() => setShowProfileChange(false)}
          />
        </div>
      )}
    </>
  );
} 