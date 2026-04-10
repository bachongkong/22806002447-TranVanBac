/**
 * Bài 4.3: Async/Await
 * 
 * Luyện tập xử lý bất đồng bộ sử dụng Async/Await pattern
 */

/**
 * Mô phỏng việc lấy dữ liệu người dùng bất đồng bộ
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
function fetchUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId <= 0) {
        reject(new Error('User ID không hợp lệ'));
      } else {
        resolve({ id: userId, name: `User ${userId}` });
      }
    }, 50);
  });
}

/**
 * Viết lại fetchUserData sử dụng async/await
 * @param {number} userId 
 * @returns {Promise<Object>}
 */
async function asyncFetchUser(userId) {
  const user = await fetchUserDataPromise(userId);
  return user;
}

/**
 * Helper function để mô phỏng việc fetch 1 URL
 * @param {string} url 
 * @returns {Promise<string>}
 */
function fetchUrl(url) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Data from ${url}`);
    }, 50);
  });
}

/**
 * Fetch các URLs theo thứ tự tuần tự
 * @param {string[]} urls - Mảng các URL
 * @returns {Promise<string[]>}
 */
async function sequentialFetch(urls) {
  const results = [];
  for (const url of urls) {
    const data = await fetchUrl(url);
    results.push(data);
  }
  return results;
}

/**
 * Fetch các URLs song song
 * @param {string[]} urls - Mảng các URL
 * @returns {Promise<string[]>}
 */
async function parallelFetch(urls) {
  const promises = urls.map(url => fetchUrl(url));
  const results = await Promise.all(promises);
  return results;
}

/**
 * Hàm mô phỏng công việc ném ra lỗi sau delay
 */
function workThatFails() {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Lỗi xảy ra trong quá trình xử lý')), 50);
  });
}

/**
 * Xử lý errors với try/catch trong async function
 * @returns {Promise<Object>} Object chứa trạng thái thành công hoặc lỗi
 */
async function handleErrors() {
  try {
    await workThatFails();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  asyncFetchUser,
  sequentialFetch,
  parallelFetch,
  handleErrors,
  fetchUrl // Xuất để test nếu cần
};
