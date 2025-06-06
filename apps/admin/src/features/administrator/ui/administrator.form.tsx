// import administratorService, { Administrator } from '@/shared/services/administrator.service'
// import * as Regex from '@data/utils/regex'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Form, FormItem } from '@ui/common/components/form'
// import { Input } from '@ui/common/components/input'
// import { RadioGroup, RadioGroupItem } from '@ui/common/components/radio-group'
// import { ToggleGroup } from '@ui/common/components/toggle-group'
// import { useAlertDialog } from '@ui/common/hooks/alert-dialog.hook'
// import * as React from 'react'
// import { useEffect, useTransition } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'

// const getSchema = (type: 'create' | 'update') => {
//   return z.object({
//     name: z
//       .string({ required_error: '아이디를 입력해주세요.' })
//       .trim()
//       .regex(Regex.userName, { message: '올바른 아아디 형식이 아닙니다.' }),
//     nickname: z.string({ required_error: '이름을 입력해주세요.' }).trim(),
//     password:
//       type === 'create'
//         ? z
//             .string({ required_error: '비밀번호를 입력해주세요.' })
//             .trim()
//             .regex(Regex.password, { message: '올바른 비밀번호 형식이 아닙니다.' })
//         : z.string().optional(),
//     role: z.enum(['master', 'manager'], { required_error: '역할을 선택해주세요.' }),
//     enabled: z.boolean({ required_error: '역할을 선택해주세요.' }),
//   })
// }

// type FormValues = z.infer<ReturnType<typeof getSchema>>

// interface FormProps {
//   formId: string
//   onFinish: (id: number) => void
//   onLoading?: (loading: boolean) => void
//   record?: Partial<Administrator>
// }

// export function AdministratorForm({ formId, record, onLoading, onFinish }: FormProps) {
//   const type = record?.id ? 'update' : 'create'
//   const alertDialog = useAlertDialog()
//   const [loading, startTransition] = useTransition()

//   useEffect(() => {
//     onLoading?.(loading)
//   }, [loading])

//   const form = useForm<FormValues>({
//     resolver: zodResolver(getSchema(type)),
//     mode: 'onSubmit',
//     defaultValues: {
//       ...record,
//     },
//   })

//   async function handleSubmit(values: FormValues) {
//     startTransition(async () => {
//       const { password, ...rest } = values
//       try {
//         if (record?.id) {
//           await administratorService.update(record.id, { ...values, password })
//           onFinish(record.id)
//         } else {
//           const ret = await administratorService.create({ ...rest, password: password! })
//           onFinish(ret.id)
//         }
//       } catch (e: any) {
//         if (e.status === 409) {
//           alertDialog.open({
//             title: '아이디 중복',
//             description: '이미 존재하는 아이디입니다.',
//           })
//         }
//       }
//     })
//   }

//   return (
//     <Form id={formId} form={form} className="flex flex-col gap-3" onSubmit={handleSubmit}>
//       {type === 'update' && (
//         <FormItem name="id" hidden>
//           <Input disabled />
//         </FormItem>
//       )}
//       <FormItem name="name" label="아이디" required>
//         <Input type="text" maxLength={20} />
//       </FormItem>

//       <FormItem name="nickname" label="이름" required>
//         <Input type="text" maxLength={20} />
//       </FormItem>

//       <FormItem name="password" label="비밀번호" required={type === 'create'}>
//         <Input autoComplete="off" type="password" maxLength={40} />
//       </FormItem>

//       <FormItem name="role" label="역할" required>
//         <RadioGroup className="flex flex-row">
//           <RadioGroupItem value="master">최고관리자</RadioGroupItem>
//           <RadioGroupItem value="manager">매니저</RadioGroupItem>
//         </RadioGroup>
//       </FormItem>

//       <FormItem name="enabled" label="사용여부" required>
//         <ToggleGroup
//           type="single"
//           variant="outline"
//           options={[
//             { label: '사용', value: true },
//             { label: '미사용', value: false },
//           ]}
//         />
//       </FormItem>
//     </Form>
//   )
// }
