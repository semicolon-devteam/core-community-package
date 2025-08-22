import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function LastPageIcon({ className, size = 36 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/last-page.svg")}
      width={size}
      height={size}
      className={className}
      alt="마지막 페이지로"
    />
  );
}
