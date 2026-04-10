/**
 * Bài 5.2: Chaining Methods
 * 
 * Luyện tập kỹ thuật method chaining với Arrays
 */

/**
 * Lấy các sản phẩm Electronics còn hàng và giá > 200
 * @param {Array} products 
 * @returns {Array}
 */
function getExpensiveInStockElectronics(products) {
  return products
    .filter(p => p.category === 'Electronics' && p.inStock && p.price > 200);
}

/**
 * Lấy sản phẩm rẻ nhất của mỗi category
 * @param {Array} products 
 * @returns {Array} Mảng các sản phẩm rẻ nhất
 */
function getCheapestProductPerCategory(products) {
  const grouped = products.reduce((acc, p) => {
    if (!acc[p.category] || p.price < acc[p.category].price) {
      acc[p.category] = p;
    }
    return acc;
  }, {});
  
  return Object.values(grouped);
}

/**
 * Tính toán thống kê cho mỗi category bao gồm count, total, average
 * @param {Array} products 
 * @returns {Object} Keys là category, values là object thống kê
 */
function calculateCategoryStats(products) {
  return products.reduce((acc, p) => {
    if (!acc[p.category]) {
      acc[p.category] = { count: 0, total: 0, average: 0 };
    }
    acc[p.category].count += 1;
    acc[p.category].total += p.price;
    acc[p.category].average = acc[p.category].total / acc[p.category].count;
    return acc;
  }, {});
}

module.exports = {
  getExpensiveInStockElectronics,
  getCheapestProductPerCategory,
  calculateCategoryStats
};
