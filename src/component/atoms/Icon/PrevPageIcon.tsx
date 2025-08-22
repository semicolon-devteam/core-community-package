import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function PrevPageIcon({ className, size = 36 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/prev-page.svg")}
      width={size}
      height={size}
      className={className}
      alt="이전 페이지로"
    />
  );
}
