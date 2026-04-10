const { 
  getProductNames, 
  getInStockProducts, 
  getTotalValue, 
  groupByCategory, 
  sortByPrice, 
  applyDiscount 
} = require('../src/bai5_1_data_transformation');

describe('Bài 5.1: Data Transformation', () => {
  const products = [
    { id: 1, name: 'Laptop', price: 1000, category: 'Electronics', inStock: true },
    { id: 2, name: 'Phone', price: 500, category: 'Electronics', inStock: false },
    { id: 3, name: 'Shirt', price: 50, category: 'Clothing', inStock: true },
    { id: 4, name: 'Shoes', price: 80, category: 'Clothing', inStock: true }
  ];

  test('getProductNames trả về danh sách tên sản phẩm', () => {
    expect(getProductNames(products)).toEqual(['Laptop', 'Phone', 'Shirt', 'Shoes']);
  });

  test('getInStockProducts lấy mảng chỉ gồm những sản phẩm còn hàng', () => {
    const inStock = getInStockProducts(products);
    expect(inStock.length).toBe(3);
    expect(inStock.some(p => p.name === 'Phone')).toBe(false);
  });

  test('getTotalValue tính tổng giá hợp lệ', () => {
    expect(getTotalValue(products)).toBe(1630);
  });

  test('groupByCategory nhóm theo category hợp lệ', () => {
    const grouped = groupByCategory(products);
    expect(Object.keys(grouped)).toEqual(['Electronics', 'Clothing']);
    expect(grouped['Electronics'].length).toBe(2);
    expect(grouped['Clothing'].length).toBe(2);
  });

  test('sortByPrice sắp xếp theo giá đúng order', () => {
    const ascList = sortByPrice(products, 'asc');
    expect(ascList[0].price).toBe(50);
    expect(ascList[ascList.length - 1].price).toBe(1000);

    const descList = sortByPrice(products, 'desc');
    expect(descList[0].price).toBe(1000);
    expect(descList[descList.length - 1].price).toBe(50);
  });

  test('applyDiscount giảm giá theo đúng phần trăm', () => {
    const discounted = applyDiscount(products, 10); // 10%
    expect(discounted[0].price).toBe(900); // 1000 * 0.9
    expect(discounted[1].price).toBe(450); // 500 * 0.9
    
    // Gốc không bị đổi
    expect(products[0].price).toBe(1000);
  });

  test('applyDiscount reject khi phần trăm không hợp lệ', () => {
    expect(() => applyDiscount(products, -10)).toThrow('Phần trăm giảm giá không hợp lệ');
    expect(() => applyDiscount(products, 150)).toThrow('Phần trăm giảm giá không hợp lệ');
  });
});
