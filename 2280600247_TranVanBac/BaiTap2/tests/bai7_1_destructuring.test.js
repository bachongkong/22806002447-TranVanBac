const { 
  extractUserInfo, 
  swapValues, 
  getFirstAndRest, 
  mergeObjects, 
  removeProperty 
} = require('../src/bai7_1_destructuring');

describe('Bài 7.1: Destructuring', () => {
  describe('extractUserInfo', () => {
    test('lấy thông tin đầy đủ', () => {
      const user = { name: 'Alice', address: { city: 'Hanoi' }, contacts: { email: 'alice@abc.com' } };
      expect(extractUserInfo(user)).toEqual({ name: 'Alice', city: 'Hanoi', email: 'alice@abc.com' });
    });

    test('lấy thông tin với giá trị mặc định nếu thiếu', () => {
      const user = { name: 'Bob' };
      expect(extractUserInfo(user)).toEqual({ name: 'Bob', city: 'Unknown', email: 'no-email@example.com' });
    });
  });

  describe('swapValues', () => {
    test('hoán đổi 2 giá trị', () => {
      expect(swapValues(1, 2)).toEqual([2, 1]);
    });
  });

  describe('getFirstAndRest', () => {
    test('lấy phần tử đầu và phần còn lại', () => {
      expect(getFirstAndRest([1, 2, 3])).toEqual({ first: 1, rest: [2, 3] });
    });

    test('với mảng 1 phần tử', () => {
      expect(getFirstAndRest([1])).toEqual({ first: 1, rest: [] });
    });
  });

  describe('mergeObjects', () => {
    test('gom các object lại', () => {
      expect(mergeObjects({a: 1}, {b: 2}, {a: 3, c: 4})).toEqual({a: 3, b: 2, c: 4});
    });
  });

  describe('removeProperty', () => {
    test('xóa thuộc tính khỏi object không làm thay đổi object ban đầu', () => {
      const p = { a: 1, b: 2, c: 3 };
      const res = removeProperty(p, 'b');
      expect(res).toEqual({ a: 1, c: 3 });
      expect(p).toEqual({ a: 1, b: 2, c: 3 }); // original form intact
    });
  });
});
