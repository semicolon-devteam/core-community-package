import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function NextPageIcon({ className, size = 36 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/next-page.svg")}
      width={size}
      height={size}
      className={className}
      alt="다음 페이지로"
    />
  );
}
