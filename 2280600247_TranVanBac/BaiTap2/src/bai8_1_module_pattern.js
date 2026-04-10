/**
 * Bài 8.1: Module Pattern
 * 
 * Luyện tập đóng gói code sử dụng Module Pattern
 */

const Calculator = (function() {
  // Private variables
  let history = [];

  // Private method
  function _validate(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error(`Giá trị cung cấp không phải là số hợp lệ: ${num}`);
    }
  }

  function _record(operation, a, b, result) {
    history.push({
      operation,
      a,
      b,
      result,
      timestamp: new Date()
    });
  }

  // Public API
  return {
    add(a, b) {
      _validate(a);
      _validate(b);
      const result = a + b;
      _record('add', a, b, result);
      return result;
    },

    subtract(a, b) {
      _validate(a);
      _validate(b);
      const result = a - b;
      _record('subtract', a, b, result);
      return result;
    },

    multiply(a, b) {
      _validate(a);
      _validate(b);
      const result = a * b;
      _record('multiply', a, b, result);
      return result;
    },

    divide(a, b) {
      _validate(a);
      _validate(b);
      if (b === 0) {
        throw new Error('Không thể chia cho 0');
      }
      const result = a / b;
      _record('divide', a, b, result);
      return result;
    },

    getHistory() {
      // Trả về bản sao để tránh bị chỉnh sửa từ bên ngoài
      return [...history];
    },

    clearHistory() {
      history = [];
    }
  };
})();

module.exports = Calculator;
