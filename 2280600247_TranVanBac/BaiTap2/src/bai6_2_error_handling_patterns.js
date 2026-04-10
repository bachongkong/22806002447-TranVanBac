/**
 * Bài 6.2: Error Handling Patterns
 * 
 * Các mẫu thiết kế để quản lý và xử lý lỗi hiệu quả
 */

/**
 * Wrapper function bắt và xử lý errors đồng bộ
 * @param {Function} fn 
 * @returns {Function} trả về function an toàn
 */
function tryCatch(fn) {
  return function(...args) {
    try {
      return [null, fn.apply(this, args)];
    } catch (error) {
      return [error, null];
    }
  };
}

/**
 * Parse JSON an toàn
 * @param {string} jsonString 
 * @returns {Object|null} Trả về null nếu JSON không hợp lệ
 */
function safeJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Thử lại function (trả về promise) với số lần nhất định
 * Có thể thêm exponential backoff
 * @param {Function} fn - Function trả về Promise
 * @param {number} retries - Số lần retry tối đa
 * @param {number} delay - Thời gian chờ ban đầu (ms)
 * @returns {Promise<any>}
 */
async function withRetry(fn, retries = 3, delay = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw new Error(`Đã thử lại ${retries} lần nhưng vẫn thất bại: ${error.message}`);
      }
      // Wait for delay * (2^attempt) milliseconds (exponential backoff)
      const currentDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(res => setTimeout(res, currentDelay));
    }
  }
}

/**
 * Giới hạn thời gian chạy cho một Promise
 * @param {Promise} promise 
 * @param {number} ms - millisecond timeout
 * @returns {Promise<any>}
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout sau ${ms}ms`));
    }, ms);

    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

module.exports = {
  tryCatch,
  safeJsonParse,
  withRetry,
  withTimeout
};
