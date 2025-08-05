import CheckIcon from '@/assets/icons/check.svg'

interface ResultAttitudeSectionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  color: string
  items: string[]
}

export function ResultAttitudeSection({ icon: Icon, title, color, items }: ResultAttitudeSectionProps) {
  return (
    <div className="mb-[80px]">
      <div className="flex justify-center">
        <Icon className="h-[28px] w-[28px]" style={{ color }} />
      </div>
      <div className="mt-[8px] text-center">
        <h3 className="heading2-semibold" style={{ color }}>
          {title}
        </h3>
      </div>
      <div className="mt-[12px]">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-start px-[8px] py-[12px] ${
              index % 2 === 1 ? 'bg-gray-neutral-50' : ''
            } ${index > 0 ? 'border-t border-gray-iron-100' : ''}`}
          >
            <CheckIcon className="h-[20px] w-[20px] flex-shrink-0" />
            <span className="body2-reading-regular ml-[4px] text-gray-iron-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
