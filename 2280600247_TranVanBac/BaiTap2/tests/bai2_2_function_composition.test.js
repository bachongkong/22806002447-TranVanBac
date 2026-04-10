const { compose, pipe, curry, partial } = require('../src/bai2_2_function_composition');

describe('Bài 2.2: Function Composition', () => {
  const add1 = (x) => x + 1;
  const multiply2 = (x) => x * 2;
  const square = (x) => x * x;

  describe('compose', () => {
    test('sẽ thực thi các hàm từ phải qua trái', () => {
      // multiply2(add1(5)) -> 5 + 1 = 6 -> 6 * 2 = 12
      const addThenMultiply = compose(multiply2, add1);
      expect(addThenMultiply(5)).toBe(12);

      // square(multiply2(3)) -> 3 * 2 = 6 -> 6 * 6 = 36
      const multiplyThenSquare = compose(square, multiply2);
      expect(multiplyThenSquare(3)).toBe(36);
    });
  });

  describe('pipe', () => {
    test('sẽ thực thi các hàm từ trái sang phải', () => {
      // pipe(add1, multiply2) = multiply2(add1(5)) -> (5 + 1) * 2 = 12
      const addThenMultiply = pipe(add1, multiply2);
      expect(addThenMultiply(5)).toBe(12);

      // pipe(multiply2, square) = square(multiply2(3)) -> (3 * 2) = 6 -> 6^2 = 36
      const multiplyThenSquare = pipe(multiply2, square);
      expect(multiplyThenSquare(3)).toBe(36);
    });
  });

  describe('curry', () => {
    test('sẽ chuyển function nhiều tham số thành curried function', () => {
      const p = (a, b, c) => `${a}-${b}-${c}`;
      const curriedP = curry(p);
      
      expect(curriedP(1)(2)(3)).toBe('1-2-3');
      expect(curriedP(1, 2)(3)).toBe('1-2-3');
      expect(curriedP(1)(2, 3)).toBe('1-2-3');
      expect(curriedP(1, 2, 3)).toBe('1-2-3');
    });

    test('sẽ hoạt động với function có nhiều tham số tính toán', () => {
      const sum = (a, b, c, d) => a + b + c + d;
      const curriedSum = curry(sum);

      expect(curriedSum(1)(2)(3)(4)).toBe(10);
      expect(curriedSum(1, 2)(3, 4)).toBe(10);
    });
  });

  describe('partial', () => {
    test('sẽ pre-fill một số tham số', () => {
      const greet = (greeting, name) => `${greeting}, ${name}!`;
      const sayHello = partial(greet, 'Hello');
      
      expect(sayHello('World')).toBe('Hello, World!');
    });

    test('sẽ tạo ra function mới đúng tham số', () => {
      const add3 = (a, b, c) => a + b + c;
      const partialAdd = partial(add3, 10, 20);
      
      expect(partialAdd(30)).toBe(60);
    });
  });
});
