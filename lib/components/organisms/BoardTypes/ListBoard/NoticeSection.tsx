import type { Column } from '@atoms/Column/column.model';
import type { ListPost } from '../../../../types/post';
import Board from '@molecules/Board';
import { timeAgo } from '@util/dateUtil';

interface NoticeSectionProps {
  notices: ListPost[];
  columns: Column[];
}

export default function NoticeSection({ notices, columns }: NoticeSectionProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  // Notice 데이터를 기존 Board.Table.Body에서 사용할 수 있도록 변환
  const noticesWithTableData = notices.map((notice) => ({
    ...notice,
    created_at: timeAgo(notice.created_at || ''),
    isNew: new Date(notice.created_at || '') > new Date(Date.now() - 24 * 60 * 60 * 1000),
    isNotice: true, // 공지사항임을 표시
  }));

  return <Board.Table.Body item={noticesWithTableData} columns={columns} />;
}