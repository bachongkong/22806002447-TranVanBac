import { useState } from 'react'
import { metroService } from '../services/metro.service'
import Input from '../components/Input'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function ManualInspection() {
  const [ticketCode, setTicketCode] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!ticketCode.trim()) {
      setError('Please enter ticket code')
      return
    }

    if (!reason.trim()) {
      setError('Please enter reason for inspection')
      return
    }

    setLoading(true)
    try {
      const response = await metroService.manualInspection(ticketCode.trim(), reason.trim())
      setResult(response)

      // Add to history
      setHistory(prev => [{
        code: ticketCode.trim(),
        reason: reason.trim(),
        status: response.status,
        timestamp: new Date().toLocaleString()
      }, ...prev].slice(0, 10))
    } catch (err) {
      setError(err.response?.data?.message || 'Inspection failed')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_SUPERVISOR_REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Manual Inspection</h1>
        <p className="text-gray-600 mt-1">Create manual inspection records</p>
      </div>

      {/* Inspection Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ticket Code"
            placeholder="Enter ticket code (e.g., TKT001)"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Inspection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for manual inspection..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            variant="primary"
            className="w-full md:w-auto"
          >
            Create Inspection Record
          </Button>
        </form>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} className="mt-4" />
        )}

        {/* Result */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg border ${getStatusColor(result.status)}`}>
            <div className="flex items-center gap-2">
              {result.status === 'PENDING_SUPERVISOR_REVIEW' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <p className="font-semibold">
                  {result.status === 'PENDING_SUPERVISOR_REVIEW' && 'PENDING - Awaiting Supervisor Review'}
                  {result.status === 'APPROVED' && 'APPROVED'}
                  {result.status === 'REJECTED' && 'REJECTED'}
                </p>
                {result.inspectionId && (
                  <p className="text-sm mt-1">Inspection ID: {result.inspectionId}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inspections</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">{item.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.reason}</td>
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
