import type { Column } from "@atoms/Column/column.model";

const ICON_MAP = {
  calendar: "/icons/calendar.svg",
  comment: "/icons/comment.svg",
  like: "/icons/like.svg",
  view: "/icons/view.svg",
};

export default function IconText({
    column,
    row,
}: {
    column: Column;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    row: any;
}) {
  return (
    <div>
      {/* <Image src={ICON_MAP[icon]} alt="icon" width={24} height={24} />
      <span>{text}</span> */}
    </div>
  );
}