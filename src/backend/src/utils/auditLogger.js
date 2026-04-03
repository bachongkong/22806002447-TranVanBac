import { AuditLog } from '../models/index.js'

/**
 * Ghi audit log bất đồng bộ, không block response.
 * @param {Object} opts
 * @param {string} opts.action   - Tên hành động (e.g. BLOCK_USER, BAN_JOB)
 * @param {Object} opts.req      - Express request (để lấy user, ip, userAgent)
 * @param {string} [opts.resourceType] - Tên collection bị tác động (User, Job...)
 * @param {string} [opts.resourceId]   - ObjectId của resource bị tác động
 * @param {Object} [opts.details]      - Thông tin bổ sung (trạng thái cũ, lý do...)
 * @param {string} [opts.status]       - 'success' | 'failure'
 */
export const writeAuditLog = (opts) => {
  const { action, req, resourceType = '', resourceId = null, details = {}, status = 'success' } = opts

  // Fire-and-forget — không await để không block response
  AuditLog.create({
    userId: req.user?._id || req.user?.id || null,
    action,
    resourceType,
    resourceId: resourceId || null,
    details,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
    userAgent: req.headers['user-agent'] || '',
    status,
  }).catch(err => console.error('[AuditLog] Failed to write:', err.message))
}
