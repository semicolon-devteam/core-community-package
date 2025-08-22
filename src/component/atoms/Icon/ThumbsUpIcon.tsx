import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

interface ThumbsUpIconProps extends Omit<IconProps, "color"> {
  color?: "default" | "primary";
}

export default function ThumbsUpIcon({ className, color = "default", size = 16 }: ThumbsUpIconProps) {
  return (
    <Image
      src={normalizeImageSrc(`/icons/thumbs-up${color === "default" ? "" : `-${color}`}.svg`)}
      width={size}
      height={size}
      className={className}
      alt="ThumbsUpIcon"
    />
  );
}
