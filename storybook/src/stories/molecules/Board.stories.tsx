import type { Meta, StoryObj } from '@storybook/react';

// 직접 소스에서 import (개발 환경용)
import Board from '../../../../lib/components/molecules/Board';
import BoardContainer from '../../../../lib/components/molecules/Board/Container';
import BoardHeader from '../../../../lib/components/molecules/Board/Header';
import BoardPagination from '../../../../lib/components/molecules/Board/Pagination';
import BoardTable from '../../../../lib/components/molecules/Board/Table';
import BoardWrapper from '../../../../lib/components/molecules/Board/Wrapper';
import type { 
  BoardCategory,
  BoardPostItem 
} from '../../../../lib/components/molecules/Board/types';

const meta = {
  title: 'Molecules/Board',
  component: Board.Wrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
게시판 UI를 위한 완전한 컴포넌트 시스템입니다.

## 특징
- **조합 가능한 구조**: 각 컴포넌트를 독립적으로 사용 가능
- **반응형 디자인**: 모바일부터 데스크탑까지 지원
- **TypeScript 지원**: 완전한 타입 안전성
- **접근성 준수**: WCAG 가이드라인 준수

## 컴포넌트 구성
- \`Board.Wrapper\`: 전체 게시판을 감싸는 컨테이너
- \`Board.Container\`: 메인 콘텐츠 컨테이너  
- \`Board.Header\`: 게시판 헤더 (제목, 카테고리)
- \`Board.Table\`: 테이블 구조 (Header, Body, Content)
- \`Board.Pagination\`: 페이지네이션

## 사용법
\`\`\`tsx
<Board.Wrapper>
  <Board.Container>
    <Board.Header 
      boardName="자유게시판"
      category={categories}
      totalCount={150}
    />
    <Board.Table.Content>
      <Board.Table.Header columns={columns} />
      <Board.Table.Body data={posts} />
    </Board.Table.Content>
    <Board.Pagination 
      currentPage={1}
      totalPages={10}
      onPageChange={handlePageChange}
    />
  </Board.Container>
</Board.Wrapper>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: '게시판 내용을 포함하는 자식 컴포넌트',
    },
  },
} satisfies Meta<typeof Board.Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sampleCategories: BoardCategory[] = [
  { id: 1, name: '공지사항', isActive: true },
  { id: 2, name: '자유게시판', isActive: true },
  { id: 3, name: 'QnA', isActive: true },
  { id: 4, name: '건의사항', isActive: true },
];

const samplePosts: BoardPostItem[] = [
  {
    id: 1,
    title: '🎉 커뮤니티 플랫폼 정식 오픈!',
    author: '관리자',
    authorId: 'admin',
    createdAt: '2024-01-15T10:30:00Z',
    viewCount: 1024,
    likeCount: 45,
    commentCount: 12,
    isPinned: true,
    isNotice: true,
    status: 'published',
    category: sampleCategories[0],
  },
  {
    id: 2,
    title: 'React 18의 새로운 기능들에 대해 알아보자',
    author: '개발자김씨',
    authorId: 'dev_kim',
    createdAt: '2024-01-14T15:45:00Z',
    viewCount: 256,
    likeCount: 18,
    commentCount: 8,
    status: 'published',
    category: sampleCategories[1],
  },
  {
    id: 3,
    title: 'TypeScript 관련 질문이 있습니다',
    author: '초보개발자',
    authorId: 'newbie_dev',
    createdAt: '2024-01-14T09:20:00Z',
    viewCount: 89,
    likeCount: 5,
    commentCount: 3,
    status: 'published',
    category: sampleCategories[2],
  },
  {
    id: 4,
    title: '게시판 UI 개선 제안',
    author: 'UX디자이너',
    authorId: 'ux_designer',
    createdAt: '2024-01-13T18:10:00Z',
    viewCount: 145,
    likeCount: 12,
    commentCount: 6,
    status: 'published',
    category: sampleCategories[3],
  },
];

const tableColumns = [
  { key: 'title', label: '제목', width: '40%' },
  { key: 'author', label: '작성자', width: '15%' },
  { key: 'createdAt', label: '작성일', width: '15%' },
  { key: 'viewCount', label: '조회수', width: '10%', align: 'center' as const },
  { key: 'commentCount', label: '댓글', width: '10%', align: 'center' as const },
  { key: 'likeCount', label: '좋아요', width: '10%', align: 'center' as const },
];

// 완전한 게시판 구조
export const Complete: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <Board.Wrapper>
        <Board.Container>
          <Board.Header
            boardName="자유게시판"
            category={sampleCategories}
            totalCount={150}
            totalPages={15}
          />
          
          <Board.Table.Content>
            <Board.Table.Header columns={tableColumns} />
            <Board.Table.Body data={samplePosts} />
          </Board.Table.Content>
          
          <Board.Pagination
            currentPage={1}
            totalPages={15}
            onPageChange={(page) => console.log('페이지 변경:', page)}
          />
        </Board.Container>
      </Board.Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '완전한 게시판 구조를 보여주는 예시입니다. 모든 Board 컴포넌트가 조합되어 있습니다.',
      },
    },
  },
};

// 검색 결과가 있는 게시판
export const WithSearchResults: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <Board.Wrapper>
        <Board.Container>
          <Board.Header
            boardName="전체 게시판"
            category={sampleCategories}
            totalCount={45}
            totalPages={5}
            isGlobalSearch={true}
            searchText="React"
          />
          
          <Board.Table.Content>
            <Board.Table.Header columns={tableColumns} />
            <Board.Table.Body data={samplePosts.slice(0, 2)} />
          </Board.Table.Content>
          
          <Board.Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={(page) => console.log('페이지 변경:', page)}
          />
        </Board.Container>
      </Board.Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '전역 검색 결과를 보여주는 게시판입니다. 검색어와 결과 수가 표시됩니다.',
      },
    },
  },
};

// Header만 사용
export const HeaderOnly: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <BoardHeader
        boardName="공지사항"
        category={sampleCategories}
        totalCount={25}
        totalPages={3}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Board Header 컴포넌트만 독립적으로 사용하는 예시입니다.',
      },
    },
  },
};

// Pagination만 사용
export const PaginationOnly: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <BoardPagination
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log('페이지 변경:', page)}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Board Pagination 컴포넌트만 독립적으로 사용하는 예시입니다.',
      },
    },
  },
};

// 빈 상태 (게시물 없음)
export const EmptyState: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <Board.Wrapper>
        <Board.Container>
          <Board.Header
            boardName="새 게시판"
            category={sampleCategories}
            totalCount={0}
            totalPages={0}
          />
          
          <Board.Table.Content>
            <Board.Table.Header columns={tableColumns} />
            <div className="w-full py-16 text-center text-gray-500">
              <div className="text-lg font-medium">게시물이 없습니다</div>
              <div className="text-sm mt-2">첫 번째 게시물을 작성해보세요!</div>
            </div>
          </Board.Table.Content>
          
          <Board.Pagination
            currentPage={1}
            totalPages={0}
            onPageChange={(page) => console.log('페이지 변경:', page)}
          />
        </Board.Container>
      </Board.Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '게시물이 없는 빈 상태의 게시판을 보여주는 예시입니다.',
      },
    },
  },
};

// 커스텀 스타일링
export const CustomStyling: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <Board.Wrapper className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200">
        <Board.Container className="space-y-6">
          <Board.Header
            boardName="🎨 디자인 게시판"
            category={sampleCategories}
            totalCount={89}
            totalPages={9}
          />
          
          <Board.Table.Content className="bg-white rounded-lg shadow-sm">
            <Board.Table.Header columns={tableColumns} />
            <Board.Table.Body data={samplePosts.slice(0, 3)} />
          </Board.Table.Content>
          
          <Board.Pagination
            currentPage={2}
            totalPages={9}
            onPageChange={(page) => console.log('페이지 변경:', page)}
            className="bg-white p-4 rounded-lg shadow-sm"
          />
        </Board.Container>
      </Board.Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'className prop을 사용하여 커스텀 스타일링을 적용한 게시판 예시입니다.',
      },
    },
  },
};

// 모바일 반응형
export const MobileView: Story = {
  render: () => (
    <div className="w-80">
      <Board.Wrapper>
        <Board.Container>
          <Board.Header
            boardName="모바일 게시판"
            category={sampleCategories.slice(0, 3)}
            totalCount={42}
            totalPages={5}
          />
          
          <Board.Table.Content>
            <Board.Table.Header columns={tableColumns.slice(0, 3)} />
            <Board.Table.Body data={samplePosts.slice(0, 2)} />
          </Board.Table.Content>
          
          <Board.Pagination
            currentPage={1}
            totalPages={5}
            onPageChange={(page) => console.log('페이지 변경:', page)}
          />
        </Board.Container>
      </Board.Wrapper>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모바일 화면 크기에서의 게시판 표시를 보여주는 예시입니다.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 다양한 페이지네이션 상태
export const PaginationVariations: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">첫 페이지</h3>
        <BoardPagination
          currentPage={1}
          totalPages={10}
          onPageChange={(page) => console.log('페이지 변경:', page)}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">중간 페이지</h3>
        <BoardPagination
          currentPage={5}
          totalPages={10}
          onPageChange={(page) => console.log('페이지 변경:', page)}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">마지막 페이지</h3>
        <BoardPagination
          currentPage={10}
          totalPages={10}
          onPageChange={(page) => console.log('페이지 변경:', page)}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">페이지가 적을 때</h3>
        <BoardPagination
          currentPage={2}
          totalPages={3}
          onPageChange={(page) => console.log('페이지 변경:', page)}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 상황에서의 페이지네이션 동작을 보여주는 예시입니다.',
      },
    },
  },
};