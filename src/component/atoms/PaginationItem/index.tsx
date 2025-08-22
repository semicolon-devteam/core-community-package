import type { PaginationItemProps } from "@atoms/PaginationItem/model";

export default function PaginationItem({
  number,
  isActive,
  onClick,
  isVisible = true,
}: PaginationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex-col justify-center items-center inline-flex cursor-pointer
        ${isActive ? "bg-primary" : ""} 
        ${!isVisible ? "hidden sm:flex" : ""}`}
      aria-label={`${number} 페이지로 이동`}
    >
      <div
        className={`text-center text-xs sm:text-sm font-medium font-nexon leading-normal
        ${isActive ? "text-white" : "text-text-secondary"}`}
      >
        {number}
      </div>
    </div>
  );
}
