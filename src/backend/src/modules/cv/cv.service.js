import { Worker } from 'worker_threads'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiError } from '../../common/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cvService = {
  /**
   * Gọi Worker Thread để parse CV tránh blocking Event Loop
   * @param {Buffer} fileBuffer
   * @param {string} mimeType
   * @returns {Promise<string>} parsedText
   */
  parseCVText: (fileBuffer, mimeType) => {
    return new Promise((resolve, reject) => {
      // Tạm thời BE-CV-01 định dạng tập trung PDF qua pdf-parse
      // Bạn có thể mở rộng logic switch mimeType (Word, Image) ở Worker sau
      if (mimeType !== 'application/pdf') {
        return reject(ApiError.badRequest('Hệ thống hiện tại chỉ hỗ trợ trích xuất văn bản từ file PDF.'))
      }

      const workerPath = path.resolve(__dirname, '../../workers/ocr.worker.js')
      
      const worker = new Worker(workerPath)

      worker.on('message', (message) => {
        if (message.success) {
          resolve(message.text)
        } else {
          reject(ApiError.internal(`OCR Parsing failed: ${message.error}`))
        }
        // Terminate worker sau khi hoàn thành
        worker.terminate()
      })

      worker.on('error', (err) => {
        reject(ApiError.internal(`OCR Worker encountered an error: ${err.message}`))
        worker.terminate()
      })

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(ApiError.internal(`Worker stopped with exit code ${code}`))
        }
      })

      // Gửi buffer sang worker
      worker.postMessage({ buffer: fileBuffer })
    })
  }

  // TODO: Add other CV methods (create, update, read, delete) later
}

export default cvService
