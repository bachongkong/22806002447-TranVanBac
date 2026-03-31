/**
 * Chuẩn hóa response format cho toàn bộ API
 */
class ApiResponse {
  static success(res, { statusCode = 200, message = 'Success', data = null, meta = null }) {
    const response = {
      success: true,
      message,
      data,
    }
    if (meta) response.meta = meta
    return res.status(statusCode).json(response)
  }

  static created(res, { message = 'Created successfully', data = null }) {
    return ApiResponse.success(res, { statusCode: 201, message, data })
  }

  static paginated(res, { data, page, limit, total }) {
    return ApiResponse.success(res, {
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  }
}

export default ApiResponse
