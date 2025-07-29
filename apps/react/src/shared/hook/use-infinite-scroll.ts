import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export function useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseInfiniteScrollProps) {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return { ref }
}
