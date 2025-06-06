'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { CircleX } from 'lucide-react'
import * as React from 'react'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form'
import { cn } from '../lib/utils'
import { Label } from './label'

interface FormProps<T extends FieldValues> {
  id?: string
  form: UseFormReturn<T>
  className?: string
  onSubmit?: (values: T) => void | Promise<void>
}

const Form = <T extends FieldValues>({
  id,
  className,
  form,
  onSubmit,
  children,
}: React.PropsWithChildren<FormProps<T>>) => {
  const handleSubmit: SubmitHandler<T> = (data) => {
    onSubmit?.(data)
  }
  return (
    <FormProvider<T> {...form}>
      <form
        id={id}
        className={cn('flex flex-col gap-6 text-left', className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

export const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

function FormControllerItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn('grid gap-3', className)} {...props} />
    </FormItemContext.Provider>
  )
}

const FormItem = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  className,
  label,
  description,
  children,
  labelColSpan = 4,
  itemColSpan = 16,
  labelClassName,
  descriptionClassName,
  messageClassName,
  required,
  hidden,
  ...props
}: React.PropsWithChildren<
  Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
    label?: string | React.ReactNode
    description?: string
    labelClassName?: string
    descriptionClassName?: string
    messageClassName?: string
    className?: string
    required?: boolean
    labelColSpan?: number
    itemColSpan?: number
    hidden?: boolean
  }
>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller
        {...props}
        render={(options) => {
          const { field, fieldState } = options
          const { error } = fieldState
          const slotProps = { ...field, 'data-error': error ? true : undefined }
          let formRequired = required
          if (props.rules?.required) {
            if (typeof props.rules.required === 'boolean') {
              formRequired = props.rules.required
            } else if (typeof props.rules.required === 'string') {
              formRequired = true
            } else {
              formRequired = props.rules.required.value
            }
          }
          return (
            <FormControllerItem className={className} hidden={hidden}>
              <FormLabel required={formRequired} className={labelClassName}>
                {label}
              </FormLabel>
              <Slot {...slotProps}>{children}</Slot>
              {description && <FormDescription className={descriptionClassName}>{description}</FormDescription>}
              <FormMessage className={messageClassName} />
            </FormControllerItem>
          )
        }}
      />
    </FormFieldContext.Provider>
  )
}

function FormLabel({
  className,
  children,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean
}) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      className={cn('gap-[2px] data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    >
      {required && <span className="text-destructive">*</span>}
      {children}
    </Label>
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('flex items-center text-sm text-destructive', className)}
      {...props}
    >
      <CircleX className="mr-1 inline size-4" />
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormControllerItem,
  FormDescription,
  FormMessage,
  FormField,
}
