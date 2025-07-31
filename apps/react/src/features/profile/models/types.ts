export enum MenuGroup {
  BASIC = 'basic',
  TERMS = 'terms',
}

export interface MenuItem {
  label: string
  group: MenuGroup
  onClick: () => void
}
