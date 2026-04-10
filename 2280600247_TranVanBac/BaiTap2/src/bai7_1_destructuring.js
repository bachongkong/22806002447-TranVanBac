/**
 * Bài 7.1: Destructuring
 * 
 * Luyện tập kỹ thuật bóc tách (destructuring)
 */

/**
 * Destructure thông tin từ object user lồng nhau
 * @param {Object} user 
 * @returns {Object} Chứa tên, thành phố và email (email mặc định nếu không có)
 */
function extractUserInfo(user) {
  const { 
    name, 
    address: { city } = { city: 'Unknown' }, 
    contacts: { email = 'no-email@example.com' } = {}
  } = user || {};
  
  return { name, city, email };
}

/**
 * Hoán đổi giá trị
 * @param {*} a 
 * @param {*} b 
 * @returns {Array} mảng chứa [b, a]
 */
function swapValues(a, b) {
  [a, b] = [b, a];
  return [a, b];
}

/**
 * Lấy phần tử đầu và phần còn lại
 * @param {Array} array 
 * @returns {Object} { first, rest }
 */
function getFirstAndRest(array) {
  if (!Array.isArray(array)) return { first: undefined, rest: [] };
  const [first, ...rest] = array;
  return { first, rest };
}

/**
 * Merge nhiều objects
 * @param  {...Object} objects 
 * @returns {Object}
 */
function mergeObjects(...objects) {
  return Object.assign({}, ...objects);
}

/**
 * Xóa thuộc tính và trả về object mới
 * @param {Object} obj 
 * @param {string} prop 
 * @returns {Object}
 */
function removeProperty(obj, prop) {
  if (!obj) return {};
  const { [prop]: removed, ...rest } = obj;
  return rest;
}

module.exports = {
  extractUserInfo,
  swapValues,
  getFirstAndRest,
  mergeObjects,
  removeProperty
};
