import Board from "@molecules/Board";
import { columns } from "@organisms/BoardTypes/MoneyBoard/moneyboard.model";
import type { ListBoardProps } from "@organisms/BoardTypes/boardtype.model";

export default function MoneyBoard({ 
  posts, 
  totalCount = 0, 
  currentPage = 1, 
  pageSize = 15,
  highlightId 
}: ListBoardProps & { highlightId?: number }) {
  // 게시글에 순서 번호 추가
  const postsWithSequence = posts.map((post, index) => ({
    ...post,
    sequenceNumber: totalCount - (currentPage - 1) * pageSize - index,
  }));

  return (
    <Board.Wrapper>
      <Board.Table.Content>
        <Board.Table.Header columns={columns} />
        <Board.Table.Body item={postsWithSequence} columns={columns} />
      </Board.Table.Content>
    </Board.Wrapper>
  );
}
