import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function BoardSearchIcon({ className, size = 24 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/search-icon.svg")}
      width={size}
      height={size}
      className={className}
      alt="검색"
    />
  );
}
