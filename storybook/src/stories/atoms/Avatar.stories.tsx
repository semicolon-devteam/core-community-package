import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, type AvatarProps } from '../../components/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    src: {
      control: 'text',
      description: '프로필 이미지 URL',
    },
    name: {
      control: 'text',
      description: '사용자 이름 (이니셜 생성용)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '아바타의 크기',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square', 'rounded'],
      description: '아바타의 모양',
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'away', 'busy'],
      description: '온라인 상태',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<AvatarProps>;

// 기본 아바타
export const Default: Story = {
  args: {
    name: '김철수',
    size: 'md',
  },
};

// 이미지가 있는 아바타
export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    name: '김철수',
    size: 'md',
  },
};

// 모든 Sizes 예시
export const Sizes: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2 items-center">
      <Avatar name="김철수" size="xs" />
      <Avatar name="김철수" size="sm" />
      <Avatar name="김철수" size="md" />
      <Avatar name="김철수" size="lg" />
      <Avatar name="김철수" size="xl" />
    </div>
  ),
};

// 상태 표시
export const WithStatus: Story = {
  render: () => (
    <div className="space-x-4 flex flex-wrap gap-2 items-center">
      <Avatar name="김철수" size="lg" status="online" />
      <Avatar name="김철수" size="lg" status="away" />
      <Avatar name="김철수" size="lg" status="busy" />
      <Avatar name="김철수" size="lg" status="offline" />
    </div>
  ),
};