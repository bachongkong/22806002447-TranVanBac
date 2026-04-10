/**
 * Bài 7.2: Spread Operator
 * 
 * Luyện tập thao tác immutable với Spread Operator
 */

/**
 * Deep clone sử dụng cách thông dụng đơn giản
 * @param {Object} obj 
 * @returns {Object} bản sao sâu của object
 */
function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cloneDeep(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = cloneDeep(obj[key]);
    }
  }
  return cloned;
}

/**
 * Gộp nhiều mảng và loại bỏ phần tử trùng lặp
 * @param  {...Array} arrays 
 * @returns {Array} Mảng không có phần tử trùng
 */
function mergeArraysUnique(...arrays) {
  // Trải tất cả mảng thành 1 mảng lớn, sau đó dùng Set loại bỏ trùng lặp,
  // và cuối cùng dùng spread operator để tạo lại mảng mới
  return [...new Set([].concat(...arrays))];
}

/**
 * Cập nhật thuộc tính lồng nhau tuần tự theo đường dẫn immutably
 * (Đây là dạng khó của spread nên sử dụng đệ quy cho bài tập này)
 * @param {Object} obj 
 * @param {Array<string>} path - Mảng chứa các key lồng nhau
 * @param {*} value - Giá trị mới
 * @returns {Object} Object mới đã được cập nhật
 */
function updateNestedObject(obj, path, value) {
  if (path.length === 0) return value;
  
  const [currentKey, ...restPath] = path;
  
  return {
    ...obj,
    [currentKey]: updateNestedObject(obj[currentKey] || {}, restPath, value)
  };
}

/**
 * Các hàm mô phỏng thao tác mảng immutably sử dụng spread
 */
const arrayOperations = {
  push: (arr, value) => [...arr, value],
  pop: (arr) => arr.slice(0, -1),
  shift: (arr) => arr.slice(1),
  unshift: (arr, value) => [value, ...arr]
};

module.exports = {
  cloneDeep,
  mergeArraysUnique,
  updateNestedObject,
  arrayOperations
};
