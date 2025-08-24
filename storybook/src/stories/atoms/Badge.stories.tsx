import type { Meta, StoryObj } from '@storybook/react';
import { Badge, type BadgeProps } from '../../components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Badge 컴포넌트**는 상태, 카테고리, 레벨 등을 나타내는 작은 라벨입니다.

## 특징
- 5가지 variant (default, success, warning, error, info)
- 3가지 size (sm, md, lg)
- dot 표시 지원
- 사용자 정의 색상 지원
- 접근성 지원

## 사용법
\`\`\`tsx
import { Badge } from '@team-semicolon/community-core';

<Badge variant="success" size="md">
  활성화
</Badge>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
      description: '배지의 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '배지의 크기',
    },
    dot: {
      control: 'boolean',
      description: 'dot 표시 여부',
    },
    children: {
      control: 'text',
      description: '배지 텍스트',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BadgeProps>;

// 기본 배지
export const Default: Story = {
  args: {
    children: '기본',
    variant: 'default',
    size: 'md',
  },
};

// 모든 Variants 예시
export const Variants: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2">
      <Badge variant="default">기본</Badge>
      <Badge variant="success">성공</Badge>
      <Badge variant="warning">경고</Badge>
      <Badge variant="error">에러</Badge>
      <Badge variant="info">정보</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 variant의 배지들을 보여줍니다.',
      },
    },
  },
};

// 모든 Sizes 예시
export const Sizes: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2 items-center">
      <Badge size="sm">작음</Badge>
      <Badge size="md">보통</Badge>
      <Badge size="lg">큼</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 배지들을 보여줍니다.',
      },
    },
  },
};

// Dot 표시
export const WithDot: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2">
      <Badge dot variant="success">온라인</Badge>
      <Badge dot variant="warning">대기중</Badge>
      <Badge dot variant="error">오프라인</Badge>
      <Badge dot variant="info">알림</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'dot이 포함된 배지들을 보여줍니다.',
      },
    },
  },
};

// 실제 사용 예시
export const UseCases: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">사용자 상태</h4>
        <div className="space-x-2 flex flex-wrap gap-1">
          <Badge variant="success" dot>온라인</Badge>
          <Badge variant="warning" dot>자리비움</Badge>
          <Badge variant="error" dot>오프라인</Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">사용자 레벨</h4>
        <div className="space-x-2 flex flex-wrap gap-1">
          <Badge variant="info" size="sm">Lv.1</Badge>
          <Badge variant="default" size="sm">Lv.15</Badge>
          <Badge variant="warning" size="sm">Lv.50</Badge>
          <Badge variant="error" size="sm">Lv.99</Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">카테고리</h4>
        <div className="space-x-2 flex flex-wrap gap-1">
          <Badge variant="default">자유게시판</Badge>
          <Badge variant="info">질문</Badge>
          <Badge variant="success">완료</Badge>
          <Badge variant="warning">진행중</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '실제 커뮤니티에서 사용될 수 있는 배지들의 예시를 보여줍니다.',
      },
    },
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  args: {
    children: '클릭 가능',
    variant: 'info',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '이 배지의 속성을 Controls 탭에서 변경해볼 수 있습니다.',
      },
    },
  },
};