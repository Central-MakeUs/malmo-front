import { ScreenContent } from './content'
import { useScreenLayoutContext } from './context'
import { ScreenHeader } from './header'
import { ScreenRoot } from './root'

export const Screen = Object.assign(ScreenRoot, { Header: ScreenHeader, Content: ScreenContent })

export const useScreenLayout = useScreenLayoutContext
