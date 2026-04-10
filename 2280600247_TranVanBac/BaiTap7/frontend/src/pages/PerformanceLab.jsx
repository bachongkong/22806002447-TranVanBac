import { memo, useCallback, useDeferredValue, useMemo, useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Alert from '../components/Alert'
import { performanceService } from '../services/performance.service'

function heavyFilterAndSort(users, query, onlyActive, sortBy) {
  const lowered = query.trim().toLowerCase()
  const filtered = users.filter((user) => {
    if (onlyActive && !user.isActive) return false

    const hit =
      user.name.toLowerCase().includes(lowered) ||
      user.email.toLowerCase().includes(lowered) ||
      user.role.toLowerCase().includes(lowered)

    if (!hit) return false

    // Intentionally expensive for profiling exercise.
    let score = 0
    for (let i = 0; i < 80; i += 1) {
      score += (user.monthlyTrips * (i + 1)) % 17
    }
    return score >= 0
  })

  if (sortBy === 'trips') {
    return [...filtered].sort((a, b) => b.monthlyTrips - a.monthlyTrips)
  }

  if (sortBy === 'violations') {
    return [...filtered].sort((a, b) => b.violationCount - a.violationCount)
  }

  return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
}

const UserRow = memo(function UserRow({ user }) {
  return (
    <tr>
      <td className="px-3 py-2 font-medium text-gray-800">{user.name}</td>
      <td className="px-3 py-2 text-gray-600">{user.email}</td>
      <td className="px-3 py-2 text-gray-700">{user.role}</td>
      <td className="px-3 py-2 text-gray-700">{user.stationCode}</td>
      <td className="px-3 py-2 text-gray-700">{user.monthlyTrips}</td>
      <td className="px-3 py-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {user.isActive ? 'active' : 'inactive'}
        </span>
      </td>
    </tr>
  )
})

export default function PerformanceLab() {
  const [users, setUsers] = useState([])
  const [size, setSize] = useState(1500)
  const [delayMs, setDelayMs] = useState(0)
  const [query, setQuery] = useState('')
  const [onlyActive, setOnlyActive] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [maxRows, setMaxRows] = useState(300)
  const [optimizeMode, setOptimizeMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const deferredQuery = useDeferredValue(query)

  const loadDataset = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await performanceService.getUsersDataset({
        size: Number(size),
        delayMs: Number(delayMs)
      })
      setUsers(response.users || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load performance dataset')
    } finally {
      setLoading(false)
    }
  }, [size, delayMs])

  const optimizedRows = useMemo(() => {
    return heavyFilterAndSort(users, deferredQuery, onlyActive, sortBy).slice(0, Number(maxRows))
  }, [users, deferredQuery, onlyActive, sortBy, maxRows])

  const nonOptimizedRows = heavyFilterAndSort(users, query, onlyActive, sortBy).slice(
    0,
    Number(maxRows)
  )

  const rows = optimizeMode ? optimizedRows : nonOptimizedRows

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">React 19 Performance Lab</h1>
        <p className="mt-1 text-gray-600">
          Debug with React DevTools Profiler. Toggle mode to compare non-optimized vs optimized
          rendering.
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input
            label="Dataset Size"
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <Input
            label="Network Delay (ms)"
            type="number"
            value={delayMs}
            onChange={(e) => setDelayMs(e.target.value)}
          />
          <Input
            label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="name, email, role..."
          />
          <Input
            label="Render Rows"
            type="number"
            value={maxRows}
            onChange={(e) => setMaxRows(e.target.value)}
          />
          <div className="flex items-end">
            <Button className="w-full" onClick={loadDataset} loading={loading}>
              Load Dataset
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Only active users
          </label>

          <label className="text-sm text-gray-700">
            Sort by
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="trips">Monthly Trips</option>
              <option value="violations">Violation Count</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={optimizeMode}
              onChange={(e) => setOptimizeMode(e.target.checked)}
            />
            Optimize mode
          </label>

          <div className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-600">
            <p>Total users: {users.length}</p>
            <p>Rendered rows: {rows.length}</p>
          </div>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Station
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Trips
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((user) =>
              optimizeMode ? (
                <UserRow key={user.id} user={user} />
              ) : (
                <tr key={user.id}>
                  <td className="px-3 py-2 font-medium text-gray-800">{user.name}</td>
                  <td className="px-3 py-2 text-gray-600">{user.email}</td>
                  <td className="px-3 py-2 text-gray-700">{user.role}</td>
                  <td className="px-3 py-2 text-gray-700">{user.stationCode}</td>
                  <td className="px-3 py-2 text-gray-700">{user.monthlyTrips}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
