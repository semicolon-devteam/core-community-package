import type { Column } from "@atoms/Column/column.model";
import { generateGridClasses } from "@atoms/Column/column.model";

export default function SequenceNumber({
  column,
  row,
  totalCount,
  currentPage,
  pageSize = 10,
}: {
  column: Column;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  totalCount: number;
  currentPage: number;
  pageSize?: number;
}) {
  // 현재 페이지에서의 인덱스를 기반으로 전체 순서 계산
  const sequenceNumber = totalCount - (currentPage - 1) * pageSize - row.index;
  const gridClasses = generateGridClasses(column.gridLayout);

  return (
    <div
      className={`${gridClasses} h-10 sm:h-11 py-2 sm:py-2.5 justify-${
        column.justify
      } items-${column.align} flex relative overflow-hidden`}
    >
      <div className="flex items-center justify-center w-full">
        <span className="text-text-tertiary text-xs sm:text-sm font-medium font-nexon leading-normal">
          {sequenceNumber}
        </span>
      </div>
    </div>
  );
} 