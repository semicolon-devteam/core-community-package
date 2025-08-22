import Board from '@molecules/Board';
import SearchPostItem from '@molecules/Board/SearchBoardItem';

import type { SearchBoardProps } from '@organisms/BoardTypes/boardtype.model';

export default function SearchBoard({ posts }: SearchBoardProps) {
  return (
    <Board.Wrapper>
      <Board.Table.Content>
        <div className="w-full max-w-225 h-263 flex-col justify-start items-start gap-2 inline-flex">
          {posts.map(post => (
            <SearchPostItem key={post.id} Post={post} />
          ))}
        </div>
      </Board.Table.Content>
    </Board.Wrapper>
  );
}
