import ApiError from '../common/ApiError.js'
import { env } from '../config/index.js'

/**
 * Global error handler middleware
 * Phải đặt SAU tất cả routes
 */
const errorHandler = (err, req, res, next) => {
  let error = err

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    error = ApiError.badRequest('Validation failed', messages)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ')
    error = ApiError.conflict(`Duplicate value for: ${field}`)
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token')
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired')
  }

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal server error'

  const response = {
    success: false,
    message,
    ...(error.errors?.length && { errors: error.errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  }

  console.error(`[ERROR] [${statusCode}] ${message}`)
  if (env.NODE_ENV === 'development') console.error(err.stack)

  res.status(statusCode).json(response)
}

export default errorHandler
