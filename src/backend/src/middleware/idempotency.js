import { IdempotencyKey } from '../models/index.js'
import { ApiError } from '../common/index.js'

export const checkIdempotency = async (req, res, next) => {
  const key = req.headers['x-idempotency-key']
  
  if (!key) {
    return next(ApiError.badRequest('Yêu cầu truyền x-idempotency-key trên header'))
  }

  try {
    // Upsert key với trạng thái mặc định processing
    // Tránh race condition khi 2 request đập vào cùng mili-giây
    const idempotencyDoc = await IdempotencyKey.findOneAndUpdate(
      { key, userId: req.user.userId },
      { 
        $setOnInsert: { 
          requestPath: req.originalUrl,
          status: 'processing'
        } 
      },
      { upsert: true, new: false, setDefaultsOnInsert: true }
    )

    // Nếu doc đã tồn tại từ trước (new: false trả về doc cũ hoặc null)
    if (idempotencyDoc) {
      if (idempotencyDoc.status === 'processing') {
        return next(ApiError.conflict('Yêu cầu của bạn đang được xử lý, vui lòng không nhấn nhiều lần.'))
      }
      if (idempotencyDoc.status === 'completed') {
        // Trả về JSON cũ
        return res.status(idempotencyDoc.responseStatus || 200).json(idempotencyDoc.responseBody)
      }
      // Nếu là error thì cho chạy tiếp (retry)
    }

    // Capture response object (override hàm json)
    const originalJson = res.json
    res.json = function (body) {
      const responseStatus = res.statusCode
      
      // Update bất đồng bộ vào background
      IdempotencyKey.updateOne(
        { key, userId: req.user.userId },
        { 
          $set: { 
            status: responseStatus >= 400 ? 'error' : 'completed',
            responseBody: body,
            responseStatus
          } 
        }
      ).catch(err => console.error('Lỗi lưu idempotency:', err))
      
      return originalJson.call(this, body)
    }

    next()
  } catch (error) {
    next(error)
  }
}
