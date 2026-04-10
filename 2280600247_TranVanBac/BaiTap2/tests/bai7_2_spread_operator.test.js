const { 
  cloneDeep, 
  mergeArraysUnique, 
  updateNestedObject, 
  arrayOperations 
} = require('../src/bai7_2_spread_operator');

describe('Bài 7.2: Spread Operator', () => {
  describe('cloneDeep', () => {
    test('tạo ra bản sao sâu không refer đến object cũ', () => {
      const obj = { a: 1, b: { c: 2, d: [3, 4] } };
      const cloned = cloneDeep(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
      expect(cloned.b.d).not.toBe(obj.b.d);
    });
  });

  describe('mergeArraysUnique', () => {
    test('gom mảng và loại bỏ phần tử trùng', () => {
      expect(mergeArraysUnique([1, 2], [2, 3, 4], [4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('updateNestedObject', () => {
    test('cập nhật thuộc tính lồng nhau immutably', () => {
      const state = { user: { profile: { name: 'Alice' } }, active: true };
      const newState = updateNestedObject(state, ['user', 'profile', 'name'], 'Bob');
      
      expect(newState.user.profile.name).toBe('Bob');
      expect(newState.active).toBe(true);
      // Object cũ không thay đổi
      expect(state.user.profile.name).toBe('Alice');
      // Thử xem nó có giữ tham chiếu đúng mực thay vì copy thừa
      expect(newState).not.toBe(state);
    });
  });

  describe('arrayOperations', () => {
    it('push immutably', () => {
      const arr = [1, 2];
      expect(arrayOperations.push(arr, 3)).toEqual([1, 2, 3]);
      expect(arr.length).toBe(2);
    });

    it('pop immutably', () => {
      const arr = [1, 2, 3];
      expect(arrayOperations.pop(arr)).toEqual([1, 2]);
      expect(arr.length).toBe(3);
    });

    it('shift immutably', () => {
      const arr = [1, 2, 3];
      expect(arrayOperations.shift(arr)).toEqual([2, 3]);
      expect(arr.length).toBe(3);
    });

    it('unshift immutably', () => {
      const arr = [2, 3];
      expect(arrayOperations.unshift(arr, 1)).toEqual([1, 2, 3]);
      expect(arr.length).toBe(2);
    });
  });
});
