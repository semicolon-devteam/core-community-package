import type { Meta, StoryObj } from '@storybook/react';
import { Input, type InputProps } from '../../components/Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: '라벨 텍스트',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: '입력 필드의 상태',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '입력 필드의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
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

export const Default: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력하세요',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input label="기본" placeholder="기본 입력 필드" />
      <Input label="성공" placeholder="성공 상태" variant="success" />
      <Input label="경고" placeholder="경고 상태" variant="warning" />
      <Input label="오류" placeholder="오류 상태" variant="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input size="sm" placeholder="Small 크기" />
      <Input size="md" placeholder="Medium 크기" />
      <Input size="lg" placeholder="Large 크기" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력하세요',
    type: 'password',
    error: '비밀번호는 8자 이상이어야 합니다',
  },
};