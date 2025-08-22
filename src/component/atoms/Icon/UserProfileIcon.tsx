import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

interface UserProfileIconProps extends IconProps {
  profileImage?: string;
}

export default function UserProfileIcon({
  className,
  size = 48,
  profileImage = "/icons/user-profile.svg",
}: UserProfileIconProps) {
  return (
    <div className="relative w-8 aspect-square border border-gray-200 rounded-full overflow-hidden mr-1">
      <Image
                      src={normalizeImageSrc(profileImage || "/icons/user-profile.svg")}
        fill
        className={`object-cover ${className || ""}`}
        alt="프로필 이미지"
      />
    </div>
  );
}
