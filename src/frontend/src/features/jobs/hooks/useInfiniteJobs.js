import { useInfiniteQuery } from '@tanstack/react-query'
import { jobService } from '@features/jobs'

/**
 * Hook infinite scroll cho danh sách jobs (cursor-based pagination)
 * Sử dụng TanStack useInfiniteQuery + backend cursor pagination
 */
export function useInfiniteJobs(filters = {}) {
  const query = useInfiniteQuery({
    queryKey: ['jobs', 'search', filters],
    queryFn: async ({ pageParam }) => {
      const params = {
        ...filters,
        limit: 20,
      }
      if (pageParam) {
        params.cursor = pageParam
      }
      const res = await jobService.search(params)
      return res.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.hasNextPage ? lastPage.meta.nextCursor : undefined
    },
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 2, // 2 phút
  })

  // Flatten tất cả pages thành 1 mảng jobs
  const jobs = query.data?.pages?.flatMap((page) => page.data) ?? []

  return {
    jobs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    refetch: query.refetch,
  }
}
