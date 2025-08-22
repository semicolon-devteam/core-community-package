import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function EyeIcon({ className, size = 16 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/eye.svg")}
      width={size}
      height={size}
      className={className}
      alt="EyeIcon"
    />
  );
}
