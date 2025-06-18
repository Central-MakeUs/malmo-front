import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/common/components/button'
import { Card, CardHeader, CardTitle, CardContent } from '@ui/common/components/card'
import { Checkbox } from '@ui/common/components/checkbox'
import { Form, FormItem } from '@ui/common/components/form'
import { Input } from '@ui/common/components/input'
import { cn } from '@ui/common/lib/utils'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'

interface LoginFormProps<T extends FieldValues> extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  title?: string
  description?: string
  schema: z.ZodSchema<T, any, any>
  onSubmit: (data: T) => void | Promise<void>
}

export function LoginForm<T extends FieldValues>(props: LoginFormProps<T>) {
  const { className, title = '로그인', description, schema, onSubmit, ...rest } = props

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const [activeTab, setActiveTab] = useState('일반회원')
  const [loading, setLoading] = useState(false)

  return (
    <div className={cn('mx-auto flex w-full flex-col gap-8', className)} {...rest}>
      <Card className="mx-auto w-full max-w-md rounded-xl border border-gray-100 shadow-lg">
        <CardHeader className="pt-8 text-center">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <Form form={form} onSubmit={onSubmit}>
            <div className="grid gap-6">
              <FormItem name="accountId" label="ID" defaultValue="">
                <Input autoComplete="username" placeholder="아이디를 입력해주세요" className="border-gray-06" />
              </FormItem>
              <FormItem name="password" label={'비밀번호'} defaultValue="">
                <Input
                  autoComplete="current-password"
                  type="password"
                  className="border-gray-06"
                  placeholder="비밀번호를 입력해주세요"
                />
              </FormItem>
              <div className="mt-2 mb-4 flex items-center space-x-2">
                <FormItem name="remember">
                  <Checkbox>로그인 정보 기억하기</Checkbox>
                </FormItem>
              </div>
              <Button
                type="submit"
                className="text-md py-2.5"
                loading={loading}
                disabled={!form.formState.isValid || loading}
              >
                로그인
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
