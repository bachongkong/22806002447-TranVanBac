const Calculator = require('../src/bai8_1_module_pattern');

describe('Bài 8.1: Module Pattern', () => {
  beforeEach(() => {
    Calculator.clearHistory();
  });

  describe('Phép tính cơ bản', () => {
    test('cộng đúng', () => {
      expect(Calculator.add(10, 5)).toBe(15);
    });

    test('trừ đúng', () => {
      expect(Calculator.subtract(10, 5)).toBe(5);
    });

    test('nhân đúng', () => {
      expect(Calculator.multiply(10, 5)).toBe(50);
    });

    test('chia đúng', () => {
      expect(Calculator.divide(10, 5)).toBe(2);
    });
  });

  describe('Validation và Error', () => {
    test('ném lỗi nếu không phải là số', () => {
      expect(() => Calculator.add('10', 5)).toThrow('Giá trị cung cấp không phải là số hợp lệ: 10');
      expect(() => Calculator.subtract(10, NaN)).toThrow('Giá trị cung cấp không phải là số hợp lệ: NaN');
    });

    test('ném lỗi chia cho 0', () => {
      expect(() => Calculator.divide(10, 0)).toThrow('Không thể chia cho 0');
    });
  });

  describe('Lịch sử', () => {
    test('lưu đúng các phép tính', () => {
      Calculator.add(2, 3);
      Calculator.multiply(4, 5);

      const history = Calculator.getHistory();
      expect(history.length).toBe(2);
      expect(history[0].operation).toBe('add');
      expect(history[0].result).toBe(5);
      expect(history[1].operation).toBe('multiply');
      expect(history[1].result).toBe(20);
    });

    test('xoá toàn bộ lịch sử', () => {
      Calculator.add(2, 3);
      Calculator.clearHistory();
      expect(Calculator.getHistory().length).toBe(0);
    });

    test('không bị rò rỉ private functions', () => {
      expect(Calculator._validate).toBeUndefined();
      expect(Calculator._record).toBeUndefined();
    });
  });
});
