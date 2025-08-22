import BoardTableBody from "@atoms/Column/BoardTableBody";
import type { Column } from "@atoms/Column/column.model";

export default function BoardTableList({
  item,
  columns,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any[];
  columns: Column[];
}) {
  
  const gridClasses = 'w-full bg-white border-b border-border-default grid grid-cols-12 gap-0 overflow-hidden'
  return item.map((e: any, i: number) => (
    <div
      key={`${e.id}-${i}`}
      className={
        gridClasses +
        (e.isHighlight ? " !bg-[#FFEDD5]" : "")
      }
      style={e.isHighlight ? { backgroundColor: '#FFEDD5' } : {}}
    >
      {columns.map((column, index) => {
        const Component = column.render ? column.render : BoardTableBody;
        return (
          <Component
            key={`${column.id}-${index}`}
            column={column}
            row={{ ...e, highlightText: e.isHighlight }}
          />
        );
      })}
    </div>
  ));
}
