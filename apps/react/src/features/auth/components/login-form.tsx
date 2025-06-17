import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@ui/common/components/form'
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

  return (
    <Form form={form} className={cn('flex h-fit w-full flex-col items-center justify-center', className)} {...rest}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-title-01 font-semibold">{title}</h1>
        {description && <p className="text-body-02 text-gray-02">{description}</p>}
      </div>
    </Form>
  )
}
