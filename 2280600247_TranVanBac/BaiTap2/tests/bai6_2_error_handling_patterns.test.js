const { tryCatch, safeJsonParse, withRetry, withTimeout } = require('../src/bai6_2_error_handling_patterns');

describe('Bài 6.2: Error Handling Patterns', () => {
  describe('tryCatch', () => {
    test('trả về [null, result] nếu thành công', () => {
      const safeParse = tryCatch(JSON.parse);
      const [err, data] = safeParse('{"test": 1}');
      expect(err).toBeNull();
      expect(data).toEqual({ test: 1 });
    });

    test('trả về [error, null] nếu thất bại', () => {
      const safeParse = tryCatch(JSON.parse);
      const [err, data] = safeParse('invalid json');
      expect(err).toBeInstanceOf(Error);
      expect(data).toBeNull();
    });
  });

  describe('safeJsonParse', () => {
    test('parse chính xác object chuẩn', () => {
      expect(safeJsonParse('{"a": 1}')).toEqual({ a: 1 });
    });

    test('trả về null nếu error', () => {
      expect(safeJsonParse('{a:1}')).toBeNull(); // Missing quotes
    });
  });

  describe('withRetry', () => {
    test('sẽ trả về nếu promise thành công ngay từ đầu', async () => {
      const fn = jest.fn().mockResolvedValue('ok');
      const result = await withRetry(fn, 3, 10);
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('sẽ thử lại nếu thất bại và thành công sau vài lần', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success!');

      const result = await withRetry(fn, 3, 10);
      expect(result).toBe('success!');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    test('sẽ ném lỗi nếu tất cả lần thử đều thất bại', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('network down'));
      await expect(withRetry(fn, 2, 10)).rejects.toThrow('Đã thử lại 2 lần nhưng vẫn thất bại: network down');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('withTimeout', () => {
    test('trả về kết quả nếu promise tự resolve sớm', async () => {
      const p = new Promise(res => setTimeout(() => res('done'), 10));
      const result = await withTimeout(p, 50);
      expect(result).toBe('done');
    });

    test('ném lỗi nếu promise tốn nhiều thời gian hơn timeout', async () => {
      const p = new Promise(res => setTimeout(() => res('done'), 50));
      await expect(withTimeout(p, 10)).rejects.toThrow('Timeout sau 10ms');
    });
  });
});
