const { 
  ValidationError, 
  NetworkError, 
  AuthenticationError, 
  validateUser, 
  handleError 
} = require('../src/bai6_1_custom_errors');

describe('Bài 6.1: Custom Errors', () => {
  describe('Custom Error Classes', () => {
    test('nên kế thừa từ Error và có message, name tương ứng', () => {
      const vErr = new ValidationError('Bad Input');
      expect(vErr).toBeInstanceOf(Error);
      expect(vErr.name).toBe('ValidationError');
      expect(vErr.message).toBe('Bad Input');

      const nErr = new NetworkError('Timeout');
      expect(nErr.name).toBe('NetworkError');

      const aErr = new AuthenticationError('Token Expired');
      expect(aErr.name).toBe('AuthenticationError');
    });
  });

  describe('validateUser', () => {
    test('nên qua validation với user hợp lệ', () => {
      expect(() => validateUser({ name: 'Alice', age: 20 })).not.toThrow();
    });

    test('ném ValidationError nếu thiếu object', () => {
      expect(() => validateUser(null)).toThrow(ValidationError);
      expect(() => validateUser(null)).toThrow('User object is required');
    });

    test('ném ValidationError nếu sai name hoặc age', () => {
      expect(() => validateUser({ age: 20 })).toThrow(ValidationError);
      expect(() => validateUser({ name: 'A', age: -5 })).toThrow('Age must be a valid positive number');
    });

    test('ném AuthenticationError nếu là admin mà thiếu token', () => {
      expect(() => validateUser({ name: 'Admin', age: 30, role: 'admin' })).toThrow(AuthenticationError);
    });
  });

  describe('handleError', () => {
    test('xử lý đúng ValidationError', () => {
      expect(handleError(new ValidationError('Msg'))).toBe('400 Bad Request: Msg');
    });

    test('xử lý đúng AuthenticationError', () => {
      expect(handleError(new AuthenticationError('Invalid Token'))).toBe('401 Unauthorized: Invalid Token');
    });

    test('xử lý đúng NetworkError', () => {
      expect(handleError(new NetworkError('Down'))).toBe('503 Service Unavailable: Down');
    });

    test('xử lý lỗi chung', () => {
      expect(handleError(new Error('Unknown'))).toBe('500 Internal Server Error');
    });
  });
});
