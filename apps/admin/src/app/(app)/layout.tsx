import { AppSidebar } from '@/widgets/nav/ui'
import { AppBreadcrumb } from '@/widgets/nav/ui/app-breadcrumb'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@ui/common/components/sidebar'
import { ThemeSelector } from '@ui/admin/components/theme-selector'
import { useTheme } from '@ui/common/contexts/theme.context'
import { Separator } from '@ui/common/components/separator'
import { ThemeToggle } from '@ui/common/components/theme-toggle'

export const Route = createFileRoute('/(app)')({
  component: AppLayout,
})

function AppLayout() {
  const { activeTheme, setActiveTheme, toggleTheme } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumb />
          </div>
          <ThemeSelector className="ml-auto cursor-pointer" activeTheme={activeTheme} onChange={setActiveTheme} />
          <ThemeToggle className="mr-4 cursor-pointer" onClick={toggleTheme} />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
