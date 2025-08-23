import LinkWithLoader from "@common/LinkWithLoader";
import type { Notice } from '../../../types/post';
import { timeAgo } from "@util/dateUtil";
import { normalizeImageSrc } from "@util/imageUtil";
import Image from "next/image";


interface NoticeCardProps {
  notice?: Notice;
  className?: string;
  onPrevClick?: () => void;
  onNextClick?: () => void;
}

export default function NoticeCard({
  notice,
  className,
  onPrevClick,
  onNextClick,
}: NoticeCardProps) {

  return (

    <div
      className={`flex h-12 items-center justify-between bg-white px-5 rounded-2xl shadow-custom border border-border-default overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-2 font-nexon text-sm text-text-tertiary">
          {notice?.isNew && (
            <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-medium text-primary border border-primary rounded">
              NEW
            </span>
          )}
          <LinkWithLoader href={`/post/${notice?.id}`} className="truncate">
            {notice?.title || "사이트 공지사항 제목 노출 영역입니다."}
          </LinkWithLoader>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-nexon text-xs text-text-secondary">
          {timeAgo(notice?.createdAt || "")}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={onPrevClick}
            className="flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="이전 공지"
          >
            <Image
              src={normalizeImageSrc("/icons/chevron-up.svg")}
              alt=""
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
          <button
            type="button"
            onClick={onNextClick}
            className="flex items-c enter justify-center text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="다음 공지"
          >
            <Image
              src={normalizeImageSrc("/icons/chevron-down.svg")}
              alt=""
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
