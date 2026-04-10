/**
 * Wrap async route handlers để tự động catch errors vào errorHandler
 *
 * Usage:
 *   router.get('/', asyncHandler(controller.getAll))
 *
 * Thay vì phải try/catch trong mỗi controller
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export default asyncHandler
