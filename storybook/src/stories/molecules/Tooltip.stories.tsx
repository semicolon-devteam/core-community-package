import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import Tooltip from '../../../../lib/components/molecules/Tooltip';
import type { TooltipProps } from '../../../../lib/components/molecules/Tooltip/tooltip.model';
import { Button } from '../../../../lib/components/atoms/Button';

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
툴팁 컴포넌트는 사용자에게 추가 정보를 제공하는 UI 요소입니다.
hover, click, focus 등 다양한 트리거 방식을 지원하며, 자동으로 뷰포트 경계를 감지하여 위치를 조정합니다.

### 주요 기능
- 🎯 4가지 위치 (top, bottom, left, right)
- 🎨 7가지 variant 스타일
- 📏 3가지 크기 (sm, md, lg)
- 🖱️ 3가지 트리거 방식 (hover, click, focus)
- 📐 뷰포트 경계 자동 감지
- ⚡ 부드러운 애니메이션
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: '툴팁에 표시될 내용',
    },
    position: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: '툴팁 표시 위치',
      defaultValue: 'top',
    },
    variant: {
      control: 'select',
      options: ['default', 'dark', 'light', 'primary', 'success', 'warning', 'error'],
      description: '툴팁 스타일 variant',
      defaultValue: 'default',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '툴팁 크기',
      defaultValue: 'md',
    },
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus'],
      description: '툴팁 트리거 방식',
      defaultValue: 'hover',
    },
    delay: {
      control: { type: 'range', min: 0, max: 2000, step: 100 },
      description: '툴팁 표시 지연 시간 (ms)',
      defaultValue: 500,
    },
    maxWidth: {
      control: { type: 'range', min: 100, max: 500, step: 50 },
      description: '툴팁 최대 너비',
      defaultValue: 200,
    },
    showArrow: {
      control: 'boolean',
      description: '화살표 표시 여부',
      defaultValue: true,
    },
    animationDuration: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: '애니메이션 지속 시간 (ms)',
      defaultValue: 200,
    },
    disabled: {
      control: 'boolean',
      description: '툴팁 비활성화',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 사용 예시
export const Default: Story = {
  args: {
    content: '이것은 툴팁입니다',
    children: <Button variant="primary">마우스를 올려보세요</Button>,
  },
};

// 위치별 예시
export const Positions: Story = {
  render: () => (
    <div className="flex gap-8 p-20">
      <Tooltip content="위쪽 툴팁" position="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="아래쪽 툴팁" position="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="왼쪽 툴팁" position="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip content="오른쪽 툴팁" position="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '툴팁이 표시되는 4가지 위치를 보여주는 예시입니다.',
      },
    },
  },
};

// Variant 스타일별 예시
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 p-8">
      <Tooltip content="기본 스타일" variant="default">
        <Button variant="ghost">Default</Button>
      </Tooltip>
      <Tooltip content="다크 스타일" variant="dark">
        <Button variant="ghost">Dark</Button>
      </Tooltip>
      <Tooltip content="라이트 스타일" variant="light">
        <Button variant="ghost">Light</Button>
      </Tooltip>
      <Tooltip content="프라이머리 스타일" variant="primary">
        <Button variant="ghost">Primary</Button>
      </Tooltip>
      <Tooltip content="성공 스타일" variant="success">
        <Button variant="ghost">Success</Button>
      </Tooltip>
      <Tooltip content="경고 스타일" variant="warning">
        <Button variant="ghost">Warning</Button>
      </Tooltip>
      <Tooltip content="에러 스타일" variant="error">
        <Button variant="ghost">Error</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 variant 스타일을 보여주는 예시입니다.',
      },
    },
  },
};

// 크기별 예시
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip content="작은 툴팁" size="sm">
        <Button variant="outline">Small</Button>
      </Tooltip>
      <Tooltip content="중간 크기 툴팁" size="md">
        <Button variant="outline">Medium</Button>
      </Tooltip>
      <Tooltip content="큰 툴팁입니다. 더 많은 내용을 담을 수 있습니다." size="lg">
        <Button variant="outline">Large</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '3가지 크기의 툴팁을 보여주는 예시입니다.',
      },
    },
  },
};

// 트리거 방식별 예시
export const Triggers: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip content="마우스를 올리면 표시됩니다" trigger="hover">
        <Button variant="outline">Hover</Button>
      </Tooltip>
      <Tooltip content="클릭하면 표시됩니다" trigger="click">
        <Button variant="outline">Click</Button>
      </Tooltip>
      <Tooltip content="포커스하면 표시됩니다" trigger="focus">
        <Button variant="outline">Focus (Tab)</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 트리거 방식을 보여주는 예시입니다. Click 트리거는 다시 클릭하거나 외부를 클릭하면 닫힙니다.',
      },
    },
  },
};

// 긴 내용 예시
export const LongContent: Story = {
  args: {
    content: '이것은 매우 긴 툴팁 내용입니다. 툴팁은 maxWidth 속성에 따라 자동으로 줄바꿈되며, 내용이 길어도 읽기 쉽게 표시됩니다.',
    maxWidth: 300,
    children: <Button variant="primary">긴 내용 툴팁</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: '긴 내용을 담은 툴팁 예시입니다. maxWidth로 최대 너비를 조절할 수 있습니다.',
      },
    },
  },
};

// 지연 시간 예시
export const Delays: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <Tooltip content="즉시 표시" delay={0}>
        <Button variant="outline">No Delay</Button>
      </Tooltip>
      <Tooltip content="0.5초 후 표시" delay={500}>
        <Button variant="outline">0.5s Delay</Button>
      </Tooltip>
      <Tooltip content="1초 후 표시" delay={1000}>
        <Button variant="outline">1s Delay</Button>
      </Tooltip>
      <Tooltip content="2초 후 표시" delay={2000}>
        <Button variant="outline">2s Delay</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '툴팁 표시 지연 시간을 다르게 설정한 예시입니다.',
      },
    },
  },
};

// 화살표 없는 툴팁
export const WithoutArrow: Story = {
  args: {
    content: '화살표가 없는 툴팁',
    showArrow: false,
    children: <Button variant="secondary">화살표 없음</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: '화살표를 표시하지 않는 툴팁 예시입니다.',
      },
    },
  },
};

// 비활성화된 툴팁
export const Disabled: Story = {
  args: {
    content: '이 툴팁은 표시되지 않습니다',
    disabled: true,
    children: <Button variant="ghost">비활성화된 툴팁</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 툴팁은 트리거해도 표시되지 않습니다.',
      },
    },
  },
};

// React Node 내용
export const ReactNodeContent: Story = {
  args: {
    content: (
      <div>
        <strong>리액트 컴포넌트</strong>
        <p className="text-sm mt-1">HTML 요소나 컴포넌트를 툴팁 내용으로 사용할 수 있습니다.</p>
      </div>
    ),
    maxWidth: 250,
    size: 'lg',
    children: <Button variant="primary">리치 컨텐츠</Button>,
  },
  parameters: {
    docs: {
      description: {
        story: '문자열뿐만 아니라 React 컴포넌트도 툴팁 내용으로 사용할 수 있습니다.',
      },
    },
  },
};

// 다양한 요소에 적용
export const VariousElements: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-8">
      <Tooltip content="버튼 툴팁">
        <Button>버튼</Button>
      </Tooltip>
      
      <Tooltip content="텍스트 툴팁">
        <span className="text-blue-600 underline cursor-help">텍스트에 툴팁</span>
      </Tooltip>
      
      <Tooltip content="아이콘 툴팁">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full cursor-help">
          ?
        </span>
      </Tooltip>
      
      <Tooltip content="이미지 툴팁">
        <img 
          src="https://via.placeholder.com/100" 
          alt="placeholder" 
          className="w-24 h-24 rounded cursor-help"
        />
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '버튼, 텍스트, 아이콘, 이미지 등 다양한 요소에 툴팁을 적용한 예시입니다.',
      },
    },
  },
};

// 인터랙티브 데모
export const Interactive: Story = {
  render: () => {
    const [clickCount, setClickCount] = useState(0);
    
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <Tooltip 
          content={`클릭 횟수: ${clickCount}`}
          trigger="hover"
          delay={0}
        >
          <Button 
            variant="primary"
            onClick={() => setClickCount(prev => prev + 1)}
          >
            클릭해보세요 (현재: {clickCount})
          </Button>
        </Tooltip>
        
        <p className="text-sm text-gray-600">
          버튼을 클릭하면 툴팁 내용이 업데이트됩니다.
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '동적으로 변경되는 툴팁 내용을 보여주는 인터랙티브 예시입니다.',
      },
    },
  },
};

// 항상 표시되는 툴팁
export const AlwaysVisible: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">항상 표시되는 툴팁</h3>
        <p className="text-sm text-gray-600">
          forceVisible prop을 사용하면 사용자 상호작용 없이도 툴팁이 항상 표시됩니다.
        </p>
      </div>
      
      <div className="flex gap-8">
        <Tooltip 
          content="이 툴팁은 항상 표시됩니다" 
          forceVisible={true}
          position="top"
          variant="primary"
        >
          <Button variant="primary">상단 툴팁</Button>
        </Tooltip>
        
        <Tooltip 
          content="유용한 정보를 계속 보여줍니다" 
          forceVisible={true}
          position="bottom"
          variant="success"
        >
          <Button variant="primary">하단 툴팁</Button>
        </Tooltip>
        
        <Tooltip 
          content="중요한 안내사항" 
          forceVisible={true}
          position="right"
          variant="warning"
          size="lg"
        >
          <Button variant="secondary">오른쪽 툴팁</Button>
        </Tooltip>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">사용 사례:</h4>
        <ul className="text-sm space-y-1">
          <li>• 튜토리얼이나 온보딩 플로우</li>
          <li>• 중요한 정보를 강조해야 할 때</li>
          <li>• 폼 필드의 도움말 텍스트</li>
          <li>• 신기능 소개 팝업</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `forceVisible prop을 사용하면 툴팁이 사용자 상호작용 없이도 항상 표시됩니다.
        
이 기능은 다음과 같은 경우에 유용합니다:
- **튜토리얼**: 사용자에게 UI 요소를 설명할 때
- **온보딩**: 신규 사용자에게 기능을 안내할 때
- **경고**: 중요한 정보를 지속적으로 표시해야 할 때
- **가이드**: 단계별 프로세스를 안내할 때

### 사용법
\`\`\`tsx
<Tooltip 
  content="항상 표시되는 툴팁" 
  forceVisible={true}
  position="top"
>
  <Button>버튼</Button>
</Tooltip>
\`\`\``,
      },
    },
  },
};

// 혼합 사용 예시 (일부는 항상 표시, 일부는 호버)
export const MixedVisibility: Story = {
  render: () => {
    const [showGuide, setShowGuide] = useState(true);
    
    return (
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">툴팁 혼합 사용</h3>
          <p className="text-sm text-gray-600 mb-4">
            일부 툴팁은 항상 표시되고, 일부는 호버 시에만 표시됩니다.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
          >
            가이드 {showGuide ? '숨기기' : '보이기'}
          </Button>
        </div>
        
        <div className="flex gap-6">
          <Tooltip 
            content="👋 여기서 시작하세요!" 
            forceVisible={showGuide}
            position="top"
            variant="primary"
            size="lg"
          >
            <Button variant="primary">1단계: 시작</Button>
          </Tooltip>
          
          <Tooltip 
            content="추가 옵션을 보려면 마우스를 올려보세요" 
            position="top"
            variant="default"
          >
            <Button variant="outline">2단계: 설정</Button>
          </Tooltip>
          
          <Tooltip 
            content="✅ 완료하려면 클릭하세요!" 
            forceVisible={showGuide}
            position="top"
            variant="success"
            size="lg"
          >
            <Button variant="primary">3단계: 완료</Button>
          </Tooltip>
        </div>
        
        <div className="mt-8 p-4 border rounded bg-blue-50">
          <p className="text-sm">
            💡 <strong>팁:</strong> forceVisible prop을 상태와 연결하여 
            동적으로 툴팁 표시를 제어할 수 있습니다.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `툴팁을 혼합하여 사용하는 예시입니다. 
        
일부 툴팁은 항상 표시되어 가이드 역할을 하고, 
일부는 사용자 상호작용 시에만 표시되어 추가 정보를 제공합니다.

### 동적 제어
\`\`\`tsx
const [showGuide, setShowGuide] = useState(true);

<Tooltip 
  content="가이드 텍스트" 
  forceVisible={showGuide}  // 상태로 제어
>
  <Button>버튼</Button>
</Tooltip>
\`\`\``,
      },
    },
  },
};

// 뷰포트 경계 감지 데모
export const ViewportBoundary: Story = {
  render: () => (
    <div className="relative w-full h-96 border-2 border-dashed border-gray-300 overflow-hidden">
      <div className="absolute top-2 left-2">
        <Tooltip content="자동으로 위치가 조정됩니다" position="top">
          <Button size="sm">Top-Left</Button>
        </Tooltip>
      </div>
      
      <div className="absolute top-2 right-2">
        <Tooltip content="자동으로 위치가 조정됩니다" position="top">
          <Button size="sm">Top-Right</Button>
        </Tooltip>
      </div>
      
      <div className="absolute bottom-2 left-2">
        <Tooltip content="자동으로 위치가 조정됩니다" position="bottom">
          <Button size="sm">Bottom-Left</Button>
        </Tooltip>
      </div>
      
      <div className="absolute bottom-2 right-2">
        <Tooltip content="자동으로 위치가 조정됩니다" position="bottom">
          <Button size="sm">Bottom-Right</Button>
        </Tooltip>
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Tooltip content="중앙 툴팁" position="top">
          <Button>Center</Button>
        </Tooltip>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '뷰포트 경계에 가까운 위치에서도 툴팁이 자동으로 위치를 조정하여 잘리지 않고 표시됩니다.',
      },
    },
  },
};