/**
 * Bài 4.1: Callbacks
 * 
 * Luyện tập xử lý bất đồng bộ sử dụng Callback pattern
 */

/**
 * Gửi lời chào sau một khoảng thời gian delay
 * @param {string} name - Tên người nhận
 * @param {number} delay - Thời gian chờ (milliseconds)
 * @param {Function} callback - Hàm callback được gọi khi hoàn thành
 */
function delayedGreeting(name, delay, callback) {
  setTimeout(() => {
    callback(`Xin chào, ${name}!`);
  }, delay);
}

/**
 * Mô phỏng việc đọc file bất đồng bộ
 * @param {string} filename - Tên file cần đọc
 * @param {Function} callback - Hàm callback nhận error và data
 */
function readFileSimulation(filename, callback) {
  setTimeout(() => {
    if (filename === 'error.txt') {
      callback(new Error('File không tồn tại'), null);
    } else {
      callback(null, `Nội dung của file ${filename}`);
    }
  }, 100);
}

/**
 * Mô phỏng Callback Hell với 3 thao tác bất đồng bộ liên tiếp
 * @param {Function} finalCallback - Hàm callback gọi sau khi hoàn thành 3 bước
 */
function callbackHell(finalCallback) {
  setTimeout(() => {
    const step1 = 'Bước 1 hoàn thành';
    setTimeout(() => {
      const step2 = `${step1}, Bước 2 hoàn thành`;
      setTimeout(() => {
        const step3 = `${step2}, Bước 3 hoàn thành`;
        finalCallback(step3);
      }, 50);
    }, 50);
  }, 50);
}

module.exports = {
  delayedGreeting,
  readFileSimulation,
  callbackHell
};
