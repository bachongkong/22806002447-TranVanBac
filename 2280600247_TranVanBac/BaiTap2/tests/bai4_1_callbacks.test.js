const { delayedGreeting, readFileSimulation, callbackHell } = require('../src/bai4_1_callbacks');

describe('Bài 4.1: Callbacks', () => {
  test('delayedGreeting nên gọi callback với lời chào đúng sau khoảng thời gian', (done) => {
    delayedGreeting('Alice', 10, (message) => {
      expect(message).toBe('Xin chào, Alice!');
      done();
    });
  });

  test('readFileSimulation nên trả về lỗi nếu file là error.txt', (done) => {
    readFileSimulation('error.txt', (err, data) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('File không tồn tại');
      expect(data).toBeNull();
      done();
    });
  });

  test('readFileSimulation nên trả về dữ liệu nếu file hợp lệ', (done) => {
    readFileSimulation('test.txt', (err, data) => {
      expect(err).toBeNull();
      expect(data).toBe('Nội dung của file test.txt');
      done();
    });
  });

  test('callbackHell nên thực hiện 3 bước liên tiếp', (done) => {
    callbackHell((result) => {
      expect(result).toBe('Bước 1 hoàn thành, Bước 2 hoàn thành, Bước 3 hoàn thành');
      done();
    });
  });
});
