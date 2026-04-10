const { Book, Library, Member } = require('../src/bai3_2_es6_classes');

describe('Bài 3.2: ES6 Classes', () => {
  let book1, book2;
  let library;
  let member;

  beforeEach(() => {
    book1 = new Book('Clean Code', 'Robert C. Martin', '123456');
    book2 = new Book('Design Patterns', 'GoF', '654321');
    library = new Library('City Library');
    member = new Member('Alice', 'M001');
  });

  describe('Book', () => {
    test('nên khởi tạo đúng các thuộc tính', () => {
      expect(book1.title).toBe('Clean Code');
      expect(book1.author).toBe('Robert C. Martin');
      expect(book1.isbn).toBe('123456');
      expect(book1.isAvailable).toBe(true);
    });

    test('getInfo() nên trả về chuỗi thông tin chuẩn', () => {
      expect(book1.getInfo()).toBe('Clean Code by Robert C. Martin (ISBN: 123456)');
    });

    test('borrow() nên đổi isAvailable thành false', () => {
      book1.borrow();
      expect(book1.isAvailable).toBe(false);
    });

    test('borrow() ném lỗi khi mượn quyển đã bị mượn', () => {
      book1.borrow();
      expect(() => book1.borrow()).toThrow('Sách này hiện không có sẵn');
    });

    test('returnBook() nên đặt isAvailable thành true', () => {
      book1.borrow();
      book1.returnBook();
      expect(book1.isAvailable).toBe(true);
    });
  });

  describe('Library', () => {
    test('nên khởi tạo với mảng books trống', () => {
      expect(library.name).toBe('City Library');
      expect(library.books.length).toBe(0);
    });

    test('addBook() thêm sách hợp lệ vào thư viện', () => {
      library.addBook(book1);
      expect(library.books.length).toBe(1);
      expect(library.books[0]).toBe(book1);
    });

    test('addBook() ném lỗi khi thêm không phải sách', () => {
      expect(() => library.addBook({})).toThrow('Chỉ có thể thêm đối tượng Book vào thư viện');
    });

    test('removeBook() nên xóa sách theo ISBN', () => {
      library.addBook(book1);
      library.addBook(book2);
      const isRemoved = library.removeBook('123456');
      expect(isRemoved).toBe(true);
      expect(library.books.length).toBe(1);
      expect(library.books[0].isbn).toBe('654321');
      
      const notFound = library.removeBook('999999');
      expect(notFound).toBe(false);
    });

    test('findBook() nên tìm sách theo title ignore case', () => {
      library.addBook(book1);
      const found = library.findBook('clean');
      expect(found.length).toBe(1);
      expect(found[0]).toBe(book1);
    });

    test('getAvailableBooks() trả về những sách có thể mượn', () => {
      library.addBook(book1);
      library.addBook(book2);
      book1.borrow();
      const available = library.getAvailableBooks();
      expect(available.length).toBe(1);
      expect(available[0]).toBe(book2);
    });
  });

  describe('Member', () => {
    test('nên khởi tạo', () => {
      expect(member.name).toBe('Alice');
      expect(member.memberId).toBe('M001');
      expect(member.borrowedBooks.length).toBe(0);
    });

    test('borrowBook() mượn sách thành công', () => {
      member.borrowBook(book1);
      expect(member.borrowedBooks.length).toBe(1);
      expect(member.borrowedBooks[0]).toBe(book1);
      expect(book1.isAvailable).toBe(false);
    });

    test('borrowBook() nên ném lỗi nếu sách không có sẵn', () => {
      book1.borrow(); // Mượn bởi ai đó khác
      expect(() => member.borrowBook(book1)).toThrow('Sách này hiện không có sẵn');
    });

    test('returnBook() trả sách thành công', () => {
      member.borrowBook(book1);
      member.returnBook(book1);
      expect(member.borrowedBooks.length).toBe(0);
      expect(book1.isAvailable).toBe(true);
    });

    test('returnBook() ném lỗi nếu member không mượn sách đó', () => {
      expect(() => member.returnBook(book1)).toThrow('Người dùng không mượn sách này');
    });
  });
});
