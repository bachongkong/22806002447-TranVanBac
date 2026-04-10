const { Person, Student } = require('../src/bai3_1_prototypes');

describe('Bài 3.1: Prototypes', () => {
  describe('Person Constructor', () => {
    test('nên tạo đối tượng Person với name và age đúng', () => {
      const person = new Person('Alice', 25);
      expect(person.name).toBe('Alice');
      expect(person.age).toBe(25);
    });

    test('introduce() nên trả về lời giới thiệu chuẩn', () => {
      const person = new Person('Bob', 30);
      expect(person.introduce()).toBe('Xin chào, tôi là Bob, 30 tuổi');
    });

    test('haveBirthday() nên tăng tuổi lên 1', () => {
      const person = new Person('Charlie', 20);
      person.haveBirthday();
      expect(person.age).toBe(21);
    });

    test('Các method nên nằm trên prototype thay vì riêng mỗi object', () => {
      const p1 = new Person('A', 1);
      const p2 = new Person('B', 2);
      expect(p1.introduce).toBe(p2.introduce); // Cùng tham chiếu
      expect(p1.hasOwnProperty('introduce')).toBe(false);
    });
  });

  describe('Student Constructor kế thừa từ Person', () => {
    test('nên kế thừa thuộc tính name và age đồng thời có thêm school', () => {
      const student = new Student('David', 18, 'Đại học Bách Khoa');
      expect(student.name).toBe('David');
      expect(student.age).toBe(18);
      expect(student.school).toBe('Đại học Bách Khoa');
    });

    test('nên gọi được hàm introduce() kế thừa từ Person', () => {
      const student = new Student('Emma', 19, 'NEU');
      expect(student.introduce()).toBe('Xin chào, tôi là Emma, 19 tuổi');
    });

    test('nên gọi được hàm haveBirthday() kế thừa từ Person', () => {
      const student = new Student('Frank', 20, 'VNU');
      student.haveBirthday();
      expect(student.age).toBe(21);
    });

    test('study() nên trả về thông tin tên và trường', () => {
      const student = new Student('Grace', 22, 'RMIT');
      expect(student.study()).toBe('Grace đang học tại RMIT');
    });

    test('Student.prototype phải là một instance tạo từ Person.prototype', () => {
      const student = new Student('Henry', 21, 'FPT');
      expect(student instanceof Student).toBe(true);
      expect(student instanceof Person).toBe(true);
    });
  });
});
