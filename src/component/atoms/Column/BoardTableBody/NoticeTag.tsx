import type { Column } from '@atoms/Column/column.model';
import { generateGridClasses } from '@atoms/Column/column.model';

export default function NoticeTag({
  column,
  row,
}: {
  column: Column;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}) {
  const noticeType = row.metadata?.notice_type;
  const gridClasses = generateGridClasses(column.gridLayout);

  const getNoticeTypeText = (type: string | undefined) => {
    switch (type) {
      case 'event':
        return '이벤트';
      case 'notice':
        return '공지';
      default:
        return '공지';
    }
  };

  const getNoticeTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'event':
        return 'text-blue-600 border-blue-600 font-semibold w-14 text-nowrap text-center';
      case 'notice':
        return 'text-primary border-primary font-semibold w-14 text-nowrap text-center';
      default:
        return 'text-primary border-primary font-semibold w-14 text-nowrap text-center';
    }
  };

  return (
    <div
      className={`${gridClasses} h-10 sm:h-11 py-2 sm:py-2.5 justify-${column.justify} items-${column.align} flex relative overflow-hidden`}
    >
      <div className="flex items-center justify-center w-full">
        <span
          className={`px-2 py-1 rounded text-xs font-medium border ${getNoticeTypeColor(
            noticeType
          )}`}
        >
          {getNoticeTypeText(noticeType)}
        </span>
      </div>
    </div>
  );
}
