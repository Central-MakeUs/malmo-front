import { useAuth } from '@/shared/libs/auth'
import { Link, useRouter } from '@tanstack/react-router'
import { NavMain } from '@ui/admin/components/nav-main'
import { NavSecondary } from '@ui/admin/components/nav-secondary'
import { NavUser } from '@ui/admin/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@ui/common/components/sidebar'
import { TeamSwitcher } from '@ui/admin/components/team-switcher'
import * as React from 'react'
import { navData } from '../model'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await auth.logout()
    await router.invalidate()
    await router.navigate({ to: '/auth' })
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={navData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navData.navMain}
          linkRender={(item) => {
            const sidebar = useSidebar()
            return (
              <Link
                to={item.url}
                activeProps={{ className: 'font-bold' }}
                onClick={() => {
                  if (sidebar.openMobile) {
                    sidebar.toggleSidebar()
                  }
                }}
              >
                {item.icon && <item.icon />}
                {item.title}
              </Link>
            )
          }}
        />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {auth.user && (
          <NavUser
            onLogout={handleLogout}
            user={{
              name: auth.user.nickname,
              description: '관리자',
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
