import { ReactNode } from 'react'

interface TitleSectionProps {
  title: ReactNode
  description?: string
}

export function TitleSection({ title, description }: TitleSectionProps) {
  return (
    <>
      <div className="mt-10 px-5">
        <h1 className="title2-bold text-gray-iron-950">{title}</h1>
        {description && <p className="body3-medium mt-3 text-gray-iron-500">{description}</p>}
      </div>
    </>
  )
}
