import { Input } from '@/shared/ui/input'

interface NicknameInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  maxLength: number
  placeholder?: string
  className?: string
}

export function NicknameInput({
  value,
  onChange,
  maxLength,
  placeholder = '닉네임을 입력해 주세요.',
  className = 'h-[60px]',
}: NicknameInputProps) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={className}
        />
        <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gray-iron-500">
          {value.length} / {maxLength}
        </div>
      </div>
      <p className="label1-regular mt-[6px] pl-1 text-gray-iron-950">특수문자, 띄어쓰기 없이 작성해주세요.</p>
    </div>
  )
}
