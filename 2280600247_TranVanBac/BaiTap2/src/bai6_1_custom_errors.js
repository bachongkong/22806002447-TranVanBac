/**
 * Bài 6.1: Custom Errors
 * 
 * Tạo và sử dụng các custom error class for cụ thể hóa lỗi
 */

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Hàm kiểm tra thông tin user
 * @param {Object} user 
 */
function validateUser(user) {
  if (!user) {
    throw new ValidationError('User object is required');
  }
  
  if (!user.name || user.name.trim() === '') {
    throw new ValidationError('Name is required');
  }

  if (!user.age || typeof user.age !== 'number' || user.age < 0) {
    throw new ValidationError('Age must be a valid positive number');
  }
  
  if (user.role === 'admin' && !user.token) {
    throw new AuthenticationError('Admin must have an access token');
  }
}

/**
 * Xử lý lỗi tập trung
 * @param {Error} error 
 * @returns {string} Mức độ hoặc cách xử lý tương ứng
 */
function handleError(error) {
  if (error instanceof ValidationError) {
    return '400 Bad Request: ' + error.message;
  }
  if (error instanceof AuthenticationError) {
    return '401 Unauthorized: ' + error.message;
  }
  if (error instanceof NetworkError) {
    return '503 Service Unavailable: ' + error.message;
  }
  
  return '500 Internal Server Error';
}

module.exports = {
  ValidationError,
  NetworkError,
  AuthenticationError,
  validateUser,
  handleError
};
