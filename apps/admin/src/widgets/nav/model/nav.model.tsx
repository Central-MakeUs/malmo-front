import { RegisteredRouter, ToOptions } from '@tanstack/react-router'
import { GalleryVerticalEnd, type LucideIcon, Settings, TableOfContents } from 'lucide-react'

type DataType = {
  teams: {
    name: string
    logo: LucideIcon
    plan: string
  }[]
  navMain: {
    title: string
    url: NonNullable<ToOptions<RegisteredRouter>['to']>
    icon: LucideIcon
    close?: boolean
    items?: {
      title: string
      url: NonNullable<ToOptions<RegisteredRouter>['to']>
      items?: {
        title: string
        url: NonNullable<ToOptions<RegisteredRouter>['to']>
      }[]
    }[]
  }[]
  navSecondary: {
    title: string
    url: NonNullable<ToOptions<RegisteredRouter>['to']>
    icon: LucideIcon
  }[]
}

export const navData: DataType = {
  teams: [
    {
      name: import.meta.env.VITE_PROVIDER_TITLE || 'Company',
      logo: GalleryVerticalEnd,
      plan: '관리자',
    },
  ],
  navMain: [
    {
      title: '컨텐츠',
      url: '/contents',
      icon: TableOfContents,
      items: [
        {
          title: '공지사항 관리',
          url: '/contents/notices',
          items: [
            {
              title: '공지사항 추가',
              url: '/contents/notices/create',
            },
            {
              title: '공지사항 수정',
              url: '/contents/notices/$id',
            },
          ],
        },
        {
          title: 'FAQ 관리',
          url: '/contents/faqs',
          items: [
            {
              title: 'FAQ 추가',
              url: '/contents/faqs/create',
            },
            {
              title: 'FAQ 수정',
              url: '/contents/faqs/$id',
            },
          ],
        },
      ],
    },
    {
      title: '시스템',
      url: '/system',
      icon: Settings,
      items: [
        {
          title: '운영진 관리',
          url: '/system/administrators',
        },
      ],
    },
  ],
  navSecondary: [],
}
