import { useState } from 'react'
import { useDocumentTitle, useDebounce } from '@shared/hooks'
import { useInfiniteJobs } from '@features/jobs/hooks/useInfiniteJobs'
import JobSearchBar from '@features/jobs/components/JobSearchBar/JobSearchBar'
import JobFilterPanel from '@features/jobs/components/JobFilterPanel/JobFilterPanel'
import JobVirtualizedList from '@features/jobs/components/JobVirtualizedList/JobVirtualizedList'
import './JobListPage.css'

export default function JobListPage() {
  useDocumentTitle('Việc làm')

  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState({})
  const debouncedKeyword = useDebounce(keyword, 500)

  // Merge keyword (debounced) vào filters
  const activeFilters = {
    ...filters,
    keyword: debouncedKeyword || undefined,
  }

  const {
    jobs,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobs(activeFilters)

  return (
    <div className="job-list-page fade-in">
      <div className="job-list-page__header">
        <h1 className="job-list-page__title">
          <span className="job-list-page__title-icon">💼</span>
          Khám phá việc làm
        </h1>
        <p className="job-list-page__subtitle">
          Tìm kiếm cơ hội nghề nghiệp phù hợp với bạn
        </p>
      </div>

      <div className="job-list-page__controls">
        <JobSearchBar value={keyword} onChange={setKeyword} />
        <JobFilterPanel filters={filters} onChange={setFilters} />
      </div>

      <div className="job-list-page__results">
        <JobVirtualizedList
          jobs={jobs}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isLoading={isLoading}
          isLoadingMore={isFetchingNextPage}
        />
      </div>
    </div>
  )
}
