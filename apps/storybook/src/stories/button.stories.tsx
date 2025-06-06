import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@ui/common/components/button'

// Storybook 메타 설정
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'kakao',
        'google',
        'apple',
        'facebook',
      ],
      description: '버튼 스타일을 설정합니다.',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '버튼 크기를 설정합니다.',
    },
    asChild: {
      control: 'boolean',
      description: 'Slot을 사용하여 Button을 다른 요소로 감싸는 옵션입니다.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼을 비활성화합니다.',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

// 기본 버튼 스토리
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
    size: 'default',
  },
}

// `destructive` 버튼 스토리
export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
  },
}

// `outline` 버튼 스토리
export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

// `secondary` 버튼 스토리
export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

// `ghost` 버튼 스토리
export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

// `link` 버튼 스토리
export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
}

// `kakao` 버튼 스토리
export const Kakao: Story = {
  args: {
    className: 'bg-[#FEE500] hover:bg-[#ecd800] disabled:brightness-75 text-black',
    children: (
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 3C7.03125 3 3 6.40625 3 10.5C3 13.25 4.75 15.6875 7.40625 17L6.34375 21.0312C6.25 21.4062 6.65625 21.7188 7 21.4688L11.6875 18.4375C11.7812 18.4375 11.8906 18.4531 12 18.4531C16.9688 18.4531 21 15.0469 21 10.9531C21 6.85938 16.9688 3 12 3Z"
            fill="currentColor"
          />
        </svg>

        <span>Kakao</span>
      </div>
    ),
  },
}

// `google` 버튼 스토리
export const Google: Story = {
  args: {
    className: 'bg-[#F4F4F4] disabled:brightness-75 text-black',
    children: (
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.04 12.2614C23.04 11.4459 22.9668 10.6618 22.8291 9.90909H12V14.3575H18.1891C17.9225 15.795 17.1123 17.013 15.8943 17.8284V20.7139H19.6109C21.7855 18.7118 23.04 15.7636 23.04 12.2614Z"
            fill="#4285F4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 23.4998C15.105 23.4998 17.7082 22.47 19.6109 20.7137L15.8943 17.8282C14.8645 18.5182 13.5472 18.9259 12 18.9259C9.00474 18.9259 6.46951 16.903 5.56519 14.1848H1.72314V17.1646C3.61542 20.9228 7.50451 23.4998 12 23.4998Z"
            fill="#34A853"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.56523 14.1851C5.33523 13.4951 5.20455 12.7575 5.20455 12.0001C5.20455 11.2426 5.33523 10.5051 5.56523 9.81506V6.83533H1.72318C0.944318 8.38897 0.5 10.1444 0.5 12.0001C0.5 13.8557 0.944318 15.6111 1.72318 17.1648L5.56523 14.1851Z"
            fill="#FBBC05"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 5.07386C13.6884 5.07386 15.2043 5.65409 16.3961 6.79364L19.6945 3.49523C17.7082 1.63523 15.105 0.5 12 0.5C7.50451 0.5 3.61542 3.077 1.72314 6.83523L5.56519 9.81496C6.46951 7.09682 9.00474 5.07386 12 5.07386Z"
            fill="#EA4335"
          />
        </svg>
        <span>Google</span>
      </div>
    ),
  },
}

// `apple` 버튼 스토리
export const Apple: Story = {
  args: {
    className: 'bg-[#000000] disabled:brightness-75 text-white',
    children: (
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.0468 12.9156C16.9944 9.81438 19.5494 8.35313 19.6681 8.27813C18.2756 6.23438 16.1006 5.95313 15.3331 5.92188C13.5081 5.73438 11.7419 6.99688 10.8081 6.99688C9.85686 6.99688 8.41936 5.94688 6.88811 5.97813C4.91936 6.00938 3.08811 7.15938 2.10061 8.94688C0.0631126 12.5906 1.57561 17.9719 3.52561 20.9969C4.50686 22.4781 5.65686 24.1406 7.19436 24.0844C8.69436 24.0219 9.26311 23.1281 11.0756 23.1281C12.8694 23.1281 13.4006 24.0844 14.9631 24.0469C16.5694 24.0219 17.5756 22.5469 18.5194 21.0531C19.6506 19.3344 20.1131 17.6531 20.1319 17.5781C20.0944 17.5656 17.1056 16.4531 17.0468 12.9156Z"
            fill="currentColor"
          />
          <path
            d="M14.4006 4.08438C15.2006 3.10938 15.7506 1.77188 15.6131 0.421875C14.4631 0.46875 13.0506 1.20938 12.2194 2.15938C11.4756 3.00938 10.8194 4.39063 10.9756 5.69688C12.2569 5.79688 13.5694 5.04688 14.4006 4.08438Z"
            fill="currentColor"
          />
        </svg>
        <span>Apple</span>
      </div>
    ),
  },
}

// `facebook` 버튼 스토리
export const Facebook: Story = {
  args: {
    className: 'bg-[#1877F2] disabled:brightness-75 text-white',
    children: (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
            fill="currentColor"
          />
        </svg>
        <span>Facebook</span>
      </>
    ),
  },
}

// `icon` 사이즈 버튼 스토리
export const IconSize: Story = {
  args: {
    children: '🔍',
    size: 'icon',
  },
}

// `loading` 버튼 스토리
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
    size: 'default',
  },
}
