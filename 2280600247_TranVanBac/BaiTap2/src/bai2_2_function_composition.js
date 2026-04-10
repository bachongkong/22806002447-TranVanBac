/**
 * Bài 2.2: Function Composition
 * 
 * Các kỹ thuật thao tác và kết hợp function nâng cao
 */

/**
 * Thực thi các function từ phải sang trái
 * @param  {...Function} fns - Danh sách các functions
 * @returns {Function} Function kết quả sau khi compose
 * 
 * @example
 * const add1 = x => x + 1;
 * const multiply2 = x => x * 2;
 * const add1ThenMultiply2 = compose(multiply2, add1);
 * add1ThenMultiply2(5); // (5 + 1) * 2 = 12
 */
function compose(...fns) {
  return function(initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

/**
 * Thực thi các function từ trái sang phải
 * @param  {...Function} fns - Danh sách các functions
 * @returns {Function} Function kết quả sau khi pipe
 * 
 * @example
 * const add1 = x => x + 1;
 * const multiply2 = x => x * 2;
 * const multiply2ThenAdd1 = pipe(multiply2, add1);
 * multiply2ThenAdd1(5); // (5 * 2) + 1 = 11
 */
function pipe(...fns) {
  return function(initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
}

/**
 * Chuyển đổi function nhiều tham số thành chuỗi functions một tham số
 * @param {Function} fn - Function cần curry
 * @returns {Function} Curried function
 * 
 * @example
 * const add = (a, b, c) => a + b + c;
 * const curriedAdd = curry(add);
 * curriedAdd(1)(2)(3); // 6
 */
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

/**
 * Tạo function mới với một số tham số đã được cố định trước
 * @param {Function} fn - Function gốc
 * @param  {...any} args - Các tham số cần cố định
 * @returns {Function} Function mới đã partial applied
 * 
 * @example
 * const multiply = (a, b) => a * b;
 * const double = partial(multiply, 2);
 * double(5); // 10
 */
function partial(fn, ...args) {
  return function(...moreArgs) {
    return fn.apply(this, args.concat(moreArgs));
  };
}

module.exports = {
  compose,
  pipe,
  curry,
  partial
};
