import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonProps } from '../../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Button 컴포넌트**는 사용자 액션을 위한 기본 버튼입니다.

## 특징
- 5가지 variant (primary, secondary, outline, ghost, danger)
- 4가지 size (xs, sm, md, lg)
- 로딩 상태 지원
- 아이콘 및 텍스트 조합 가능
- 접근성 지원

## 사용법
\`\`\`tsx
import { Button } from '@team-semicolon/community-core';

<Button variant="primary" size="md" onClick={handleClick}>
  버튼 텍스트
</Button>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: '버튼의 스타일 variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시 여부',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ButtonProps>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: '기본 버튼',
    variant: 'primary',
    size: 'md',
  },
};

// 모든 Variants 예시
export const Variants: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 variant의 버튼들을 보여줍니다.',
      },
    },
  },
};

// 모든 Sizes 예시
export const Sizes: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2 items-center">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 버튼들을 보여줍니다.',
      },
    },
  },
};

// 로딩 상태
export const Loading: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2">
      <Button loading>로딩 중</Button>
      <Button variant="outline" loading>업로드 중</Button>
      <Button variant="secondary" loading>처리 중</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '로딩 상태의 버튼들을 보여줍니다.',
      },
    },
  },
};

// 비활성화 상태
export const Disabled: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2">
      <Button disabled>비활성화</Button>
      <Button variant="outline" disabled>비활성화</Button>
      <Button variant="danger" disabled>비활성화</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 버튼들을 보여줍니다.',
      },
    },
  },
};

// 전체 너비
export const FullWidth: Story = {
  render: () => (
    <div className="w-96 space-y-2">
      <Button fullWidth>전체 너비 버튼</Button>
      <Button variant="outline" fullWidth>전체 너비 아웃라인 버튼</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '전체 너비를 차지하는 버튼들을 보여줍니다.',
      },
    },
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  args: {
    children: '클릭해 보세요!',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '이 버튼을 클릭하면 Actions 탭에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};