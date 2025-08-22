import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function FirstPageIcon({ className, size = 36 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/first-page.svg")}
      width={size}
      height={size}
      className={className}
      alt="첫 페이지로"
    />
  );
}
