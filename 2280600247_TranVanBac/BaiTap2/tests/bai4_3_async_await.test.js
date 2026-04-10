const { asyncFetchUser, sequentialFetch, parallelFetch, handleErrors } = require('../src/bai4_3_async_await');

describe('Bài 4.3: Async/Await', () => {
  describe('asyncFetchUser', () => {
    test('sẽ lấy được dữ liệu với ID hợp lệ', async () => {
      const user = await asyncFetchUser(1);
      expect(user).toEqual({ id: 1, name: 'User 1' });
    });

    test('sẽ ném lỗi khi truyền ID không hợp lệ', async () => {
      await expect(asyncFetchUser(-1)).rejects.toThrow('User ID không hợp lệ');
    });
  });

  describe('sequentialFetch', () => {
    test('sẽ tìm nạp các đối tượng theo thứ tự', async () => {
      const urls = ['url1', 'url2', 'url3'];
      const start = Date.now();
      const results = await sequentialFetch(urls);
      const timeElapsed = Date.now() - start;
      
      expect(results).toEqual(['Data from url1', 'Data from url2', 'Data from url3']);
      // Vì mỗi urls mất 50ms, tổng thời gian >= 150ms
      expect(timeElapsed).toBeGreaterThanOrEqual(140);
    });
  });

  describe('parallelFetch', () => {
    test('sẽ tìm nạp các đối tượng song song', async () => {
      const urls = ['url1', 'url2', 'url3'];
      const start = Date.now();
      const results = await parallelFetch(urls);
      const timeElapsed = Date.now() - start;
      
      expect(results).toEqual(['Data from url1', 'Data from url2', 'Data from url3']);
      // Chạy song song nên tổng thời gian khoảng 50ms (chắc chắn nhỏ hơn 100ms)
      expect(timeElapsed).toBeLessThan(100);
    });
  });

  describe('handleErrors', () => {
    test('sẽ xử lý lỗi thông qua try/catch và trả về kết quả an toàn', async () => {
      const result = await handleErrors();
      expect(result).toEqual({ success: false, error: 'Lỗi xảy ra trong quá trình xử lý' });
    });
  });
});
