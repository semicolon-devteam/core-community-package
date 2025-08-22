import type { IconProps } from "@atoms/Icon/model/icon.model";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";

export default function CommentIcon({ className, size = 16 }: IconProps) {
  return (
    <Image
      src={normalizeImageSrc("/icons/comment.svg")}
      width={size}
      height={size}
      className={className}
      alt="CommentIcon"
    />
  );
}
