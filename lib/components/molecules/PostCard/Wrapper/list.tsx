export default function ListWrapper({
  children,
  colSpan,
  styleString,
}: {
  children: React.ReactNode;
  colSpan: number;
  styleString?: string;
}) {
  return (
    <div
      className={`col-span-${colSpan} h-40 flex flex-col justify-start items-start gap-2 overflow-hidden overflow-x-auto ${styleString}`}
    >
      {children}
    </div>
  );
}
