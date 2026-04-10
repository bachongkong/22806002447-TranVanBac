import { parentPort } from 'worker_threads'
import pdfParse from 'pdf-parse'

// Lắng nghe message từ main thread, nhận buffer của file PDF
parentPort?.on('message', async (data) => {
  try {
    if (!data.buffer) {
      throw new Error('No file buffer provided to worker')
    }

    // pdf-parse xử lý buffer thành text
    const parsedData = await pdfParse(Buffer.from(data.buffer))
    
    // Gửi lại kết quả text cho main thread
    parentPort.postMessage({ success: true, text: parsedData.text })
  } catch (error) {
    // Có lỗi trong quá trình OCR/Parse
    parentPort?.postMessage({ success: false, error: error.message })
  }
})
