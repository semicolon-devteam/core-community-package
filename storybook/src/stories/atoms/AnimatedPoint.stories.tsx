import type { Meta, StoryObj } from '@storybook/react';
import AnimatedPoint from '../../../../lib/components/atoms/AnimatedPoint';
import type { AnimatedPointProps } from '../../../../lib/components/atoms/AnimatedPoint';

const meta = {
  title: 'Atoms/AnimatedPoint',
  component: AnimatedPoint,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
숫자를 부드럽게 애니메이션하며 표시하는 컴포넌트입니다.
포인트, 코인, 통계 수치 등을 시각적으로 매력적으로 표현할 때 사용합니다.

### 주요 기능
- 🔢 숫자 카운팅 애니메이션
- 💰 천 단위 구분자 자동 처리
- 🎨 커스터마이징 가능한 스타일
- ⚡ 부드러운 트랜지션 효과
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: '표시할 숫자 값',
    },
    suffix: {
      control: 'text',
      description: '접미사 (예: P, 원, 개)',
      defaultValue: 'P',
    },
    prefix: {
      control: 'text',
      description: '접두사 (예: $, ₩)',
    },
    useThousandSeparator: {
      control: 'boolean',
      description: '천 단위 구분자 사용 여부',
      defaultValue: true,
    },
    duration: {
      control: { type: 'range', min: 100, max: 3000, step: 100 },
      description: '애니메이션 지속 시간 (ms)',
      defaultValue: 800,
    },
    color: {
      control: 'color',
      description: '텍스트 색상',
    },
    fontSize: {
      control: 'text',
      description: '폰트 크기',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof AnimatedPoint>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 사용 예시
export const Default: Story = {
  args: {
    value: 1234567,
    suffix: 'P',
  },
};

// 포인트 표시
export const Points: Story = {
  args: {
    value: 9876543,
    suffix: 'P',
    color: '#f37021',
    fontSize: '24px',
  },
  parameters: {
    docs: {
      description: {
        story: '포인트를 표시하는 예시입니다.',
      },
    },
  },
};

// 통화 표시
export const Currency: Story = {
  args: {
    value: 49900,
    prefix: '₩',
    suffix: '',
    useThousandSeparator: true,
  },
  parameters: {
    docs: {
      description: {
        story: '통화를 표시하는 예시입니다.',
      },
    },
  },
};

// 달러 표시
export const Dollar: Story = {
  args: {
    value: 1234.56,
    prefix: '$',
    suffix: '',
    useThousandSeparator: true,
  },
};

// 백분율 표시
export const Percentage: Story = {
  args: {
    value: 98.7,
    suffix: '%',
    useThousandSeparator: false,
    color: '#10b981',
    fontSize: '20px',
  },
};

// 천 단위 구분자 없음
export const WithoutSeparator: Story = {
  args: {
    value: 1234567890,
    suffix: '',
    useThousandSeparator: false,
  },
  parameters: {
    docs: {
      description: {
        story: '천 단위 구분자 없이 표시하는 예시입니다.',
      },
    },
  },
};

// 빠른 애니메이션
export const FastAnimation: Story = {
  args: {
    value: 999999,
    suffix: 'P',
    duration: 300,
  },
  parameters: {
    docs: {
      description: {
        story: '빠른 애니메이션 (300ms)',
      },
    },
  },
};

// 느린 애니메이션
export const SlowAnimation: Story = {
  args: {
    value: 123456,
    suffix: 'P',
    duration: 2000,
  },
  parameters: {
    docs: {
      description: {
        story: '느린 애니메이션 (2000ms)',
      },
    },
  },
};

// 다양한 스타일
export const CustomStyle: Story = {
  args: {
    value: 555555,
    suffix: 'P',
    color: '#8b5cf6',
    fontSize: '32px',
    className: 'font-bold',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 스타일을 적용한 예시입니다.',
      },
    },
  },
};

// 실시간 업데이트 시뮬레이션
export const LiveUpdate: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(args.value);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setValue((prev) => prev + Math.floor(Math.random() * 100) - 50);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return <AnimatedPoint {...args} value={value} />;
  },
  args: {
    value: 10000,
    suffix: 'P',
    color: '#f37021',
    fontSize: '28px',
  },
  parameters: {
    docs: {
      description: {
        story: '2초마다 값이 변경되는 실시간 업데이트 예시입니다.',
      },
    },
  },
};

// 여러 개 동시 표시
export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">포인트:</span>
        <AnimatedPoint value={1234567} suffix="P" color="#f37021" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">보유 코인:</span>
        <AnimatedPoint value={999} suffix="개" color="#fbbf24" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">달성률:</span>
        <AnimatedPoint value={87.5} suffix="%" color="#10b981" useThousandSeparator={false} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">총 매출:</span>
        <AnimatedPoint value={9876543} prefix="₩" suffix="" color="#3b82f6" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '여러 개의 AnimatedPoint를 함께 사용하는 예시입니다.',
      },
    },
  },
};

// React 필요
import React from 'react';