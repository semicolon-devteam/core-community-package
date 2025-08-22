import type { Column } from "@atoms/Column/column.model";
import { generateGridClasses } from "@atoms/Column/column.model";

export default function BoardTableHeader({ column }: { column: Column }) {
  const gridClasses = generateGridClasses(column.gridLayout);
  
  return (
    <div
      className={`${gridClasses} h-10 sm:h-12 px-2 py-2 sm:py-3 justify-${
        column.justify
      } items-${column.align} flex`}
    >
      <div
        className={`text-center text-text-primary text-xs sm:text-sm font-medium font-nexon leading-normal`}
      >
        {column.title}
      </div>
    </div>
  );
}
