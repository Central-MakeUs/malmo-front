import { cleanEmptyKeys } from '@data/utils/object'
import { getRouteApi, RegisteredRouter, RouteIds, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export function usePageFilters<T extends RouteIds<RegisteredRouter['routeTree']>>(
  routeId: T,
  excludeQueryKeys = ['modalAction', 'id']
) {
  const routeApi = getRouteApi<T>(routeId)
  const navigate = useNavigate()
  const router = useRouterState()
  const routerFilters = routeApi.useSearch()

  const [pageFilters, setPageFilters] = useState(routerFilters)

  useEffect(() => {
    setPageFilters(routerFilters)
  }, [routerFilters])

  const getQuery = () => {
    const newSearch = { ...pageFilters }
    excludeQueryKeys.forEach((key) => {
      delete newSearch[key]
    })
    return newSearch
  }

  const setFilters = (filters: Partial<typeof routerFilters>) => {
    setPageFilters((prev) => ({ ...prev, ...filters }))
  }

  const resetFilters = () => navigate({ to: router.location.pathname, search: {} })

  const navigatePage = async (partialFilters: Partial<typeof routerFilters>) => {
    await navigate({
      to: router.location.pathname,
      search: (prev) => {
        return cleanEmptyKeys({ ...prev, ...partialFilters })
      },
    })
  }

  const navigateReset = async () => {
    await navigate({ to: router.location.pathname, search: {} })
  }

  const pagination = useMemo(() => {
    return {
      pageIndex: pageFilters['page'] - 1 || 0,
      pageSize: pageFilters['pageSize'] || 20,
    }
  }, [pageFilters])

  const sorting = useMemo(() => {
    const sort = pageFilters['sort']
    if (!sort) return []
    return [
      {
        id: pageFilters['sort'],
        desc: pageFilters['order'] === 'DESC',
      },
    ]
  }, [pageFilters])

  return {
    filters: pageFilters,
    getQuery,
    navigate: navigatePage,
    navigateReset,
    setFilters,
    resetFilters,
    pagination,
    sorting,
  }
}
