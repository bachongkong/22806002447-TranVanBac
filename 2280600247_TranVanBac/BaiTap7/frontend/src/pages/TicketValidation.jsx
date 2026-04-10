import { useState } from 'react'
import { metroService } from '../services/metro.service'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function TicketValidation() {
  const [ticketCode, setTicketCode] = useState('')
  const [stationCode, setStationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const handleValidate = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!ticketCode.trim()) {
      setError('Please enter ticket code')
      return
    }

    if (!stationCode.trim()) {
      setError('Please enter station code')
      return
    }

    setLoading(true)
    try {
      const response = await metroService.validateTicket(ticketCode.trim(), stationCode.trim())
      setResult(response)

      // Add to history
      setHistory(prev => [{
        code: ticketCode.trim(),
        station: stationCode.trim(),
        status: response.status,
        timestamp: new Date().toLocaleString()
      }, ...prev].slice(0, 10))
    } catch (err) {
      setError(err.response?.data?.message || 'Validation failed')
      setResult({ status: 'FAILED', message: err.response?.data?.message || 'Validation failed' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ALLOW_ENTRY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'DENY_ENTRY':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Validate Ticket</h1>
        <p className="text-gray-600 mt-1">Validate tickets at the gate</p>
      </div>

      {/* Validation Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleValidate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Ticket Code"
              placeholder="Enter ticket code (e.g., TKT001)"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              required
            />
            <Input
              label="Station Code"
              placeholder="Enter station code (e.g., ST01)"
              value={stationCode}
              onChange={(e) => setStationCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full md:w-auto"
          >
            Validate Ticket
          </Button>
        </form>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mt-4" />
        )}

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-center gap-2">
              {result.status === 'ALLOW_ENTRY' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {result.status === 'DENY_ENTRY' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {result.status === 'EXPIRED' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className="font-semibold">
                  {result.status === 'ALLOW_ENTRY' && 'ALLOWED - Valid Ticket'}
                  {result.status === 'DENY_ENTRY' && 'DENIED - Invalid Ticket'}
                  {result.status === 'EXPIRED' && 'EXPIRED - Ticket Expired'}
                  {result.status === 'FAILED' && 'FAILED'}
                </p>
                {result.message && (
                  <p className="text-sm mt-1">{result.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Validations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Station</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{item.station}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
