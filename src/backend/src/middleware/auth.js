import jwt from 'jsonwebtoken'
import { env } from '../config/index.js'
import ApiError from '../common/ApiError.js'

/**
 * Verify JWT access token từ Authorization header
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Access token is required'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET)
    req.user = decoded // { userId, role, email }
    next()
  } catch (error) {
    next(error) // sẽ được handle bởi errorHandler (JWT errors)
  }
}

/**
 * Kiểm tra role (dùng sau authenticate)
 * Usage: authorize(ROLES.HR, ROLES.ADMIN)
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized())
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'))
    }
    next()
  }
}
