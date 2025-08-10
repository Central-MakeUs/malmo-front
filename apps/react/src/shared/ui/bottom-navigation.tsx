import { Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/shared/lib/cn'
// 기본 아이콘들
import HomeIcon from '@/assets/icons/nav/home.svg'
import ChatHistoryIcon from '@/assets/icons/nav/chat-history.svg'
import MoodJournalIcon from '@/assets/icons/nav/mood-journal.svg'
import UserIcon from '@/assets/icons/nav/user.svg'
// 액티브 아이콘들
import HomeActiveIcon from '@/assets/icons/nav/home-active.svg'
import ChatHistoryActiveIcon from '@/assets/icons/nav/chat-history-active.svg'
import MoodJournalActiveIcon from '@/assets/icons/nav/mood-journal-active.svg'
import UserActiveIcon from '@/assets/icons/nav/user-active.svg'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  path: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
    path: '/',
  },
  {
    id: 'history',
    label: '대화 기록',
    icon: ChatHistoryIcon,
    activeIcon: ChatHistoryActiveIcon,
    path: '/history',
  },
  {
    id: 'question',
    label: '마음도감',
    icon: MoodJournalIcon,
    activeIcon: MoodJournalActiveIcon,
    path: '/question',
  },
  {
    id: 'my-page',
    label: '마이페이지',
    icon: UserIcon,
    activeIcon: UserActiveIcon,
    path: '/my-page',
  },
]

export function BottomNavigation() {
  const routerState = useRouterState()
  const currentPathname = routerState.location.pathname

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPathname === '/'
    }
    return currentPathname === path || currentPathname.startsWith(`${path}/`)
  }

  return (
    <nav className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-[600px] border-t border-gray-200 bg-white">
      <div className="flex h-[60px]">
        {navigationItems.map((item) => {
          const active = isActive(item.path)
          const Icon = active ? item.activeIcon : item.icon

          return (
            <Link key={item.id} to={item.path} className="flex flex-1 flex-col items-center justify-center gap-1">
              <Icon className="h-6 w-6" />
              <span className={cn('text-[11px] font-medium', active ? 'text-gray-iron-950' : 'text-gray-iron-400')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
