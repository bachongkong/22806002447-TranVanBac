const { 
  getExpensiveInStockElectronics, 
  getCheapestProductPerCategory, 
  calculateCategoryStats 
} = require('../src/bai5_2_chaining_methods');

describe('Bài 5.2: Chaining Methods', () => {
  const products = [
    { id: 1, name: 'Expensive Laptop', price: 1500, category: 'Electronics', inStock: true },
    { id: 2, name: 'Cheap Laptop', price: 150, category: 'Electronics', inStock: true },
    { id: 3, name: 'Phone', price: 800, category: 'Electronics', inStock: false },
    { id: 4, name: 'T-Shirt', price: 20, category: 'Clothing', inStock: true },
    { id: 5, name: 'Jacket', price: 100, category: 'Clothing', inStock: true }
  ];

  test('getExpensiveInStockElectronics lấy sản phẩm điện tử còn hàng giá > 200', () => {
    const result = getExpensiveInStockElectronics(products);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Expensive Laptop');
  });

  test('getCheapestProductPerCategory lấy được sản phẩm rẻ nhất ở mỗi loại', () => {
    const result = getCheapestProductPerCategory(products);
    expect(result.length).toBe(2);
    
    const electronics = result.find(p => p.category === 'Electronics');
    expect(electronics.name).toBe('Cheap Laptop');

    const clothing = result.find(p => p.category === 'Clothing');
    expect(clothing.name).toBe('T-Shirt');
  });

  test('calculateCategoryStats tính đúng các chỉ số thống kê', () => {
    const stats = calculateCategoryStats(products);

    expect(stats['Electronics'].count).toBe(3);
    // 1500 + 150 + 800 = 2450
    expect(stats['Electronics'].total).toBe(2450);
    expect(stats['Electronics'].average).toBeCloseTo(816.67, 1);

    expect(stats['Clothing'].count).toBe(2);
    // 20 + 100 = 120
    expect(stats['Clothing'].total).toBe(120);
    expect(stats['Clothing'].average).toBe(60);
  });
});
