/**
 * Bài 3.1: Prototypes
 * 
 * Luyện tập về OOP sử dụng Prototype Pattern trong JavaScript
 */

/**
 * Constructor function cho Person
 * @param {string} name - Tên của người
 * @param {number} age - Tuổi
 */
function Person(name, age) {
  this.name = name;
  this.age = age;
}

/**
 * Trả về chuỗi giới thiệu bản thân
 * @returns {string} Lời giới thiệu
 */
Person.prototype.introduce = function() {
  return `Xin chào, tôi là ${this.name}, ${this.age} tuổi`;
};

/**
 * Tăng tuổi lên 1
 */
Person.prototype.haveBirthday = function() {
  this.age += 1;
};

/**
 * Constructor function cho Student, kế thừa từ Person
 * @param {string} name - Tên
 * @param {number} age - Tuổi
 * @param {string} school - Trường học
 */
function Student(name, age, school) {
  // Kế thừa các thuộc tính của Person
  Person.call(this, name, age);
  this.school = school;
}

// Thiết lập liên kết prototype để Student kế thừa các phương thức của Person
Student.prototype = Object.create(Person.prototype);
// Khôi phục lại constructor cho đúng
Student.prototype.constructor = Student;

/**
 * Trả về chuỗi thể hiện việc học
 * @returns {string}
 */
Student.prototype.study = function() {
  return `${this.name} đang học tại ${this.school}`;
};

module.exports = {
  Person,
  Student
};
