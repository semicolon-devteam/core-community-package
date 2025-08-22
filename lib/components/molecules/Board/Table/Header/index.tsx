import BoardTableHeader from "@atoms/Column/BoardTableHeader";
import type { Column } from "@atoms/Column/column.model";
import { useAppSelector } from "@hooks/common";
import { selectUIState } from "@redux/Features/UI/uiSlice";

export default function TableHeader({ columns }: { columns: Column[] }) {
  const { isMobile } = useAppSelector(selectUIState);
  
  // 모바일 여부에 따라 grid 설정 분기 (row는 자동으로 결정)
  const gridClasses = isMobile 
    ? "w-full bg-white border-b border-border-default grid grid-cols-12 gap-1"
    : "w-full bg-white border-b border-border-default grid grid-cols-12 gap-2";

  return (
    <div className={gridClasses}>
      {columns.map((column, index) => (
        <BoardTableHeader key={`${column.id}-${index}`} column={column} />
      ))}
    </div>
  );
}
