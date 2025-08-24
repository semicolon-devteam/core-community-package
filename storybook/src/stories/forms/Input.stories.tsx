import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input, type InputProps } from '../../components/Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Input 컴포넌트**는 사용자 텍스트 입력을 위한 기본 입력 필드입니다.

## 특징
- 다양한 입력 타입 지원
- 라벨, 에러, 도움말 텍스트 지원
- 시작/끝 아이콘 지원 (startAdornment/endAdornment)
- 3가지 size (sm, md, lg)
- 전체 너비 옵션
- 접근성 지원

## 사용법
\`\`\`tsx
import { Input } from '@team-semicolon/community-core';

<Input 
  label="이메일" 
  type="email"
  placeholder="email@example.com"
  helper="유효한 이메일 주소를 입력하세요"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: '입력 필드 라벨',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: '입력 타입',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력 필드 크기',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    error: {
      control: 'text',
      description: '에러 메시지',
    },
    helper: {
      control: 'text',
      description: '도움말 텍스트',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
    },
    required: {
      control: 'boolean',
      description: '필수 입력 여부',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<InputProps>;

// 기본 Input
export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
    size: 'md',
  },
};

// 라벨이 있는 Input
export const WithLabel: Story = {
  args: {
    label: '사용자명',
    placeholder: '사용자명을 입력하세요',
    required: true,
  },
};

// 다양한 크기
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" label="Small" placeholder="작은 크기" />
      <Input size="md" label="Medium" placeholder="보통 크기" />
      <Input size="lg" label="Large" placeholder="큰 크기" />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 크기의 Input들을 보여줍니다.',
      },
    },
  },
};

// 다양한 타입
export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" label="텍스트" placeholder="일반 텍스트" />
      <Input type="email" label="이메일" placeholder="email@example.com" />
      <Input type="password" label="비밀번호" placeholder="비밀번호 입력" />
      <Input type="number" label="숫자" placeholder="숫자만 입력" />
      <Input type="tel" label="전화번호" placeholder="010-0000-0000" />
      <Input type="url" label="웹사이트" placeholder="https://example.com" />
      <Input type="search" label="검색" placeholder="검색어 입력" />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 입력 타입의 Input들을 보여줍니다.',
      },
    },
  },
};

// 상태별 Input
export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input label="일반 상태" placeholder="일반적인 입력" />
      <Input label="에러 상태" placeholder="잘못된 입력" error="올바른 값을 입력하세요" />
      <Input label="도움말 포함" placeholder="입력값" helper="이것은 도움말 텍스트입니다" />
      <Input label="비활성화" placeholder="비활성화된 입력" disabled />
      <Input label="필수 입력" placeholder="필수로 입력해야 하는 값" required />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '다양한 상태의 Input들을 보여줍니다.',
      },
    },
  },
};

// 아이콘이 있는 Input
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input 
        label="검색" 
        placeholder="검색어 입력" 
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
      
      <Input 
        label="비밀번호" 
        type="password"
        placeholder="비밀번호 입력" 
        rightIcon={
          <button type="button" className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        }
      />
      
      <Input 
        label="이메일" 
        type="email"
        placeholder="your@email.com" 
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '아이콘이 포함된 Input들을 보여줍니다.',
      },
    },
  },
};

// 폼 예시
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
    
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.email) newErrors.email = '이메일을 입력하세요';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다';
      
      if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
      else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }
      
      if (!formData.name) newErrors.name = '이름을 입력하세요';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        alert('폼이 유효합니다!');
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4 w-80">
        <Input
          type="email"
          label="이메일"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
        
        <Input
          type="password"
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={formData.password}
          onChange={handleChange('password')}
          error={errors.password}
          helper="8자 이상의 비밀번호를 입력하세요"
          required
        />
        
        <Input
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호 다시 입력"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          required
        />
        
        <Input
          type="text"
          label="이름"
          placeholder="이름 입력"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          가입하기
        </button>
      </form>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '실제 회원가입 폼에서 사용되는 Input들의 예시를 보여줍니다.',
      },
    },
  },
};

// 인터랙티브 예시
export const Interactive: Story = {
  args: {
    label: '테스트 입력',
    placeholder: '여기에 입력해보세요',
    helper: 'Controls 탭에서 속성을 변경해보세요',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: '이 Input의 속성을 Controls 탭에서 변경해볼 수 있습니다.',
      },
    },
  },
};