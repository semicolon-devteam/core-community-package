import type { Column } from "../column.model";
import { generateGridClasses } from "../column.model";

export default function BoardTableBody<T extends Record<string, unknown>>({
  column,
  row,
}: {
  column: Column;
  row: T;
}) {
  const gridClasses = generateGridClasses(column.gridLayout);
  
  return (
    <div
      className={`${gridClasses} h-8 sm:h-11 py-2 sm:py-2.5 justify-${column.justify} items-${column.align} flex`}
    >
      <div
        className={`whitespace-nowrap shrink basis-0  ${
          row.highlightText && column.id === 'title'
            ? "text-black"
            : (column.textColor ? column.textColor : "text-text-secondary")
        } text-xs sm:text-sm font-nexon leading-normal font-normal`}
      >
        {column.render 
          ? column.render(column, row) 
          : (row[column.id]?.toString() || "-")}
      </div>
    </div>
  );
}
