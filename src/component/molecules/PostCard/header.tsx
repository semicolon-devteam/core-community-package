"use client";

import LinkWithLoader from "@common/LinkWithLoader";

export default function PostCardHeader({
  title,
  align = "center",
  isSelected,
  onClick,
  isClickable = false,
  link,
}: {
  title: string;
  align?: "center" | "start" | "end";
  isSelected?: boolean;
  onClick?: () => void;
  isClickable?: boolean;
  link?: string;
}) {

  return (
    <div
      onClick={onClick}
      className={`${
        isClickable ? "cursor-pointer" : ""
      } grow shrink basis-0 p-3 border-b-2 ${
        isSelected ? `border-b-text-primary` : "border-b-transparent"
      } flex justify-${align} items-${align}`}
    >
      <div
        className={`text-center ${isSelected ? "text-text-primary" : "text-text-secondary"} text-base font-medium  leading-normal`}
      >
        {link ? (
          <LinkWithLoader 
            href={link} 
            className="group flex items-center gap-1"
          >
            {title}
            <span className="opacity-0 transition-all duration-300 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </span>
          </LinkWithLoader>
        ) : (
          title
        )}
      </div>
    </div>
  );
}
