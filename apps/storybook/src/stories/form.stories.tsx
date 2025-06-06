import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta } from '@storybook/react'
import { Button } from '@ui/common/components/button'
import { Form, FormItem } from '@ui/common/components/form'
import { Input } from '@ui/common/components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const meta = {
  title: 'Input/Form',
  component: Form,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '폼을 구성하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      action: 'text',
      description: '폼 제출 시 호출되는 함수입니다.',
    },
    className: {
      control: 'text',
      description: '폼에 적용할 추가 CSS 클래스입니다.',
    },
    children: {
      control: 'boolean',
      description: '폼 내부에 포함될 자식 컴포넌트입니다.',
    },
  },
} satisfies Meta<typeof Form>

export default meta

// 회원가입 폼 스키마
const signUpSchema = z
  .object({
    email: z.string().email('올바른 이메일을 입력해주세요'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof signUpSchema>

export const SignUpForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    alert(JSON.stringify(values))
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-[400px] space-y-6">
      <FormItem name="email" label="이메일" required>
        <Input type="email" placeholder="example@email.com" />
      </FormItem>

      <FormItem name="password" label="비밀번호" description="8자 이상 입력해주세요" required>
        <Input type="password" placeholder="비밀번호 입력" />
      </FormItem>

      <FormItem name="confirmPassword" label="비밀번호 확인" required>
        <Input type="password" placeholder="비밀번호 재입력" />
      </FormItem>

      <Button type="submit" className="w-full">
        회원가입
      </Button>
    </Form>
  )
}
SignUpForm.parameters = {
  docs: {
    description: {
      story: '새로운 사용자 등록을 위한 회원가입 폼입니다. 이메일 중복 확인과 비밀번호 일치 여부를 검증합니다.',
    },
  },
}

// 로그인 폼 스키마
const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
  rememberId: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberId: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    alert(JSON.stringify(values))
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-[400px] space-y-6">
      <FormItem name="email" label="이메일" required>
        <Input type="email" placeholder="example@email.com" />
      </FormItem>

      <FormItem name="password" label="비밀번호" required>
        <Input type="password" placeholder="비밀번호 입력" />
      </FormItem>

      <Button type="submit" className="w-full">
        로그인
      </Button>
    </Form>
  )
}
LoginForm.parameters = {
  docs: {
    description: {
      story: '기존 사용자 인증을 위한 로그인 폼입니다.',
    },
  },
}

// 프로필 수정 폼 스키마
const profileSchema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다'),
  bio: z.string().max(150, '자기소개는 150자를 초과할 수 없습니다').optional(),
  phone: z
    .string()
    .regex(/^01[0-9]{8,9}$/, '올바른 전화번호를 입력해주세요')
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const ProfileForm = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: '',
      bio: '',
      phone: '',
    },
  })

  const onSubmit = async (values: ProfileFormValues) => {
    alert(JSON.stringify(values))
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-[400px] space-y-6">
      <FormItem name="nickname" label="닉네임" required>
        <Input placeholder="닉네임을 입력해주세요" />
      </FormItem>

      <FormItem name="bio" label="자기소개" description="선택사항입니다">
        <Input placeholder="자기소개를 입력해주세요" />
      </FormItem>

      <FormItem name="phone" label="전화번호" description="선택사항입니다">
        <Input placeholder="'-' 없이 입력해주세요" />
      </FormItem>

      <Button type="submit" className="w-full">
        저장하기
      </Button>
    </Form>
  )
}
ProfileForm.parameters = {
  docs: {
    description: {
      story: '사용자 프로필 수정을 위한 폼입니다.',
    },
  },
}

// 비밀번호 변경 폼 스키마
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z.string().min(8, '새 비밀번호는 8자 이상이어야 합니다'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '새 비밀번호가 일치하지 않습니다',
    path: ['confirmNewPassword'],
  })

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>

export const PasswordChangeForm = () => {
  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (values: PasswordChangeFormValues) => {
    alert(JSON.stringify(values))
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-[400px] space-y-6">
      <FormItem name="currentPassword" label="현재 비밀번호" required>
        <Input type="password" placeholder="현재 비밀번호 입력" />
      </FormItem>

      <FormItem name="newPassword" label="새 비밀번호" description="8자 이상 입력해주세요" required>
        <Input type="password" placeholder="새 비밀번호 입력" />
      </FormItem>

      <FormItem name="confirmNewPassword" label="새 비밀번호 확인" required>
        <Input type="password" placeholder="새 비밀번호 재입력" />
      </FormItem>

      <Button type="submit" className="w-full">
        비밀번호 변경
      </Button>
    </Form>
  )
}
PasswordChangeForm.parameters = {
  docs: {
    description: {
      story: '사용자 비밀번호 변경을 위한 폼입니다.',
    },
  },
}
