import { ChevronRight } from 'lucide-react'
import { MenuItem, MenuGroup } from '../models/types'

interface MenuListProps {
  menuItems: MenuItem[]
}

export function MenuList({ menuItems }: MenuListProps) {
  return (
    <div className="mt-7">
      {menuItems.map((item, index) => {
        const prevItem = menuItems[index - 1]
        const isNewGroup = prevItem && prevItem.group !== item.group
        const needsDivider = index > 0 && prevItem?.group === item.group && item.group === MenuGroup.BASIC

        return (
          <div key={item.label}>
            {isNewGroup && <div className="h-[6px] bg-gray-neutral-50"></div>}
            {needsDivider && <hr className="mx-5 h-px border-0 bg-gray-iron-100" />}
            <div
              className="flex h-16 cursor-pointer items-center justify-between pr-6 pl-5 hover:bg-gray-50"
              onClick={item.onClick}
            >
              <span className="body1-medium text-gray-iron-950">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-gray-iron-500" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
