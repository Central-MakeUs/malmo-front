import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@ui/common/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/common/components/card'
import { Checkbox } from '@ui/common/components/checkbox'
import { Form, FormItem } from '@ui/common/components/form'
import { Input } from '@ui/common/components/input'
import React, { useTransition } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '../lib/utils'

interface LoginFormProps<T extends FieldValues> extends Omit<React.ComponentProps<'div'>, 'onSubmit'> {
  title?: string
  schema: z.ZodSchema<T, any, any>
  onSubmit: (data: T) => void | Promise<void>
}

export function LoginForm<T extends FieldValues>(props: LoginFormProps<T>) {
  const { className, title = '로그인', schema, onSubmit, ...rest } = props
  const [loading, startTransition] = useTransition()

  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  })

  function handleSubmit(values: T) {
    startTransition(async () => {
      await onSubmit(values)
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...rest}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <FormItem name="name" label="ID" defaultValue="">
                <Input autoComplete="username" />
              </FormItem>

              <FormItem name="password" label="비밀번호" defaultValue="">
                <Input autoComplete="current-password" type="password" />
              </FormItem>

              <div className="flex items-center space-x-2">
                <FormItem name="remember">
                  <Checkbox>로그인 정보 저장</Checkbox>
                </FormItem>
              </div>

              <Button type="submit" className="w-full" loading={loading} disabled={!form.formState.isValid}>
                Login
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
