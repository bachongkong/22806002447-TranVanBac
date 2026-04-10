/**
 * Bài 5.1: Data Transformation
 * 
 * Luyện tập sử dụng Array methods để transform data
 */

/**
 * Lấy danh sách tên tất cả sản phẩm
 * @param {Array} products 
 * @returns {string[]}
 */
function getProductNames(products) {
  return products.map(p => p.name);
}

/**
 * Lấy các sản phẩm còn hàng (inStock: true)
 * @param {Array} products 
 * @returns {Array}
 */
function getInStockProducts(products) {
  return products.filter(p => p.inStock);
}

/**
 * Tính tổng giá trị của tất cả sản phẩm (cả còn hàng và hết hàng)
 * @param {Array} products 
 * @returns {number}
 */
function getTotalValue(products) {
  return products.reduce((total, p) => total + p.price, 0);
}

/**
 * Nhóm các sản phẩm theo category
 * @param {Array} products 
 * @returns {Object} keys là category, values là mảng các products
 */
function groupByCategory(products) {
  return products.reduce((groups, p) => {
    const category = p.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(p);
    return groups;
  }, {});
}

/**
 * Sắp xếp sản phẩm theo giá
 * @param {Array} products 
 * @param {string} [order='asc'] - 'asc' (tăng dần) hoặc 'desc' (giảm dần)
 * @returns {Array} Mảng mới đã được sắp xếp
 */
function sortByPrice(products, order = 'asc') {
  return [...products].sort((a, b) => {
    if (order === 'asc') {
      return a.price - b.price;
    }
    return b.price - a.price;
  });
}

/**
 * Áp dụng giảm giá cho tất cả sản phẩm
 * @param {Array} products 
 * @param {number} percent - Mức giảm giá (0-100)
 * @returns {Array} Mảng các sản phẩm mới với giá đã giảm
 */
function applyDiscount(products, percent) {
  if (percent < 0 || percent > 100) {
    throw new Error('Phần trăm giảm giá không hợp lệ');
  }
  return products.map(p => ({
    ...p,
    price: p.price * (1 - percent / 100)
  }));
}

module.exports = {
  getProductNames,
  getInStockProducts,
  getTotalValue,
  groupByCategory,
  sortByPrice,
  applyDiscount
};
