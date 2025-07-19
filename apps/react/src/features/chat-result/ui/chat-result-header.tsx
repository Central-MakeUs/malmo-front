import result from '@/assets/images/result.png'

interface ChatResultHeaderProps {
  title: string
  description: string
  imageSrc?: string
}

export function ChatResultHeader({ title, description, imageSrc = result }: ChatResultHeaderProps) {
  return (
    <div className="flex justify-between px-5">
      <div>
        <h1 className="heading2-bold mb-1">{title}</h1>
        <p className="body4-regular text-gray-iron-600" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <img src={imageSrc} className="image h-[112px] w-[132px]" />
    </div>
  )
}
