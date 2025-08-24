import type { Meta, StoryObj } from '@storybook/react';
import { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard,
  type SkeletonProps 
} from '../../components/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Skeleton 컴포넌트**는 콘텐츠 로딩 중에 표시되는 플레이스홀더입니다.

## 특징
- 4가지 variant (rectangular, circular, rounded, text)
- 커스텀 크기 지원
- 애니메이션 on/off 가능
- 라이트/다크 테마 지원
- 미리 정의된 컴포넌트들 제공

## 사용법
\`\`\`tsx
import { Skeleton, SkeletonCard } from '@team-semicolon/community-core';

// 기본 사용
<Skeleton width="200px" height="20px" />

// 미리 정의된 컴포넌트
<SkeletonCard />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['rectangular', 'circular', 'rounded', 'text'],
      description: '스켈레톤의 모양',
    },
    width: {
      control: 'text',
      description: '너비 (CSS 단위)',
    },
    height: {
      control: 'text',
      description: '높이 (CSS 단위)',
    },
    animated: {
      control: 'boolean',
      description: '애니메이션 사용 여부',
    },
    light: {
      control: 'boolean',
      description: '라이트 테마 사용 여부',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SkeletonProps>;

// 기본 Skeleton
export const Default: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '20px',
  },
};

// 모든 Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Rectangular</h4>
        <Skeleton variant="rectangular" width="200px" height="20px" />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Circular</h4>
        <Skeleton variant="circular" width="40px" height="40px" />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Rounded</h4>
        <Skeleton variant="rounded" width="100px" height="32px" />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Text</h4>
        <Skeleton variant="text" width="150px" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 variant의 Skeleton들을 보여줍니다.',
      },
    },
  },
};

// 미리 정의된 컴포넌트들
export const PrebuiltComponents: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">SkeletonText</h4>
        <SkeletonText lines={3} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">SkeletonAvatar (다양한 크기)</h4>
        <div className="flex space-x-4 items-center">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">SkeletonButton (다양한 크기)</h4>
        <div className="flex space-x-4 items-center">
          <SkeletonButton variant="sm" />
          <SkeletonButton variant="md" />
          <SkeletonButton variant="lg" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '미리 정의된 Skeleton 컴포넌트들을 보여줍니다.',
      },
    },
  },
};

// SkeletonCard 예시
export const CardExample: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">SkeletonCard</h4>
        <SkeletonCard />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">여러 개의 카드</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '완성된 형태의 SkeletonCard를 보여줍니다.',
      },
    },
  },
};

// 실제 사용 예시 - 게시글 목록
export const PostListExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">게시글 목록 로딩</h3>
      
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <SkeletonAvatar size="sm" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="80px" height="14px" />
              <Skeleton variant="text" width="200px" height="18px" />
              <SkeletonText lines={2} />
              <div className="flex space-x-4 mt-3">
                <Skeleton variant="text" width="60px" height="12px" />
                <Skeleton variant="text" width="40px" height="12px" />
                <Skeleton variant="text" width="50px" height="12px" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '실제 커뮤니티 게시글 목록 로딩 시 사용되는 Skeleton 예시입니다.',
      },
    },
  },
};

// 실제 사용 예시 - 댓글 섹션
export const CommentSectionExample: Story = {
  render: () => (
    <div className="w-full max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">댓글 섹션 로딩</h3>
      
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3">
          <SkeletonAvatar size="xs" />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" width="100px" height="14px" />
            <SkeletonText lines={2} />
            <div className="flex space-x-3 mt-2">
              <Skeleton variant="text" width="30px" height="12px" />
              <Skeleton variant="text" width="30px" height="12px" />
              <Skeleton variant="text" width="40px" height="12px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '댓글 섹션 로딩 시 사용되는 Skeleton 예시입니다.',
      },
    },
  },
};

// 애니메이션 비교
export const AnimationComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">애니메이션 있음 (기본)</h4>
        <div className="space-y-2">
          <Skeleton animated width="200px" height="20px" />
          <Skeleton animated width="150px" height="20px" />
          <Skeleton animated width="180px" height="20px" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">애니메이션 없음</h4>
        <div className="space-y-2">
          <Skeleton animated={false} width="200px" height="20px" />
          <Skeleton animated={false} width="150px" height="20px" />
          <Skeleton animated={false} width="180px" height="20px" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '애니메이션이 있는 경우와 없는 경우를 비교합니다.',
      },
    },
  },
};

// 테마 비교
export const ThemeComparison: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">일반 테마 (기본)</h4>
        <div className="space-y-2">
          <Skeleton width="200px" height="20px" />
          <Skeleton width="150px" height="20px" />
          <SkeletonAvatar size="md" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">라이트 테마</h4>
        <div className="space-y-2">
          <Skeleton light width="200px" height="20px" />
          <Skeleton light width="150px" height="20px" />
          <SkeletonAvatar light size="md" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '일반 테마와 라이트 테마를 비교합니다.',
      },
    },
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  args: {
    variant: 'rectangular',
    width: '200px',
    height: '20px',
    animated: true,
    light: false,
  },
  parameters: {
    docs: {
      description: {
        story: '이 Skeleton의 속성을 Controls 탭에서 변경해볼 수 있습니다.',
      },
    },
  },
};