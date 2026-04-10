/**
 * Bài 3.2: ES6 Classes
 * 
 * Quản lý hệ thống thư viện sử dụng ES6 Classes
 */

class Book {
  /**
   * Khởi tạo sách
   * @param {string} title 
   * @param {string} author 
   * @param {string} isbn 
   */
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.isAvailable = true;
  }

  getInfo() {
    return `${this.title} by ${this.author} (ISBN: ${this.isbn})`;
  }

  borrow() {
    if (!this.isAvailable) {
      throw new Error('Sách này hiện không có sẵn');
    }
    this.isAvailable = false;
  }

  returnBook() {
    this.isAvailable = true;
  }
}

class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
  }

  addBook(book) {
    if (!(book instanceof Book)) {
      throw new Error('Chỉ có thể thêm đối tượng Book vào thư viện');
    }
    this.books.push(book);
  }

  removeBook(isbn) {
    const index = this.books.findIndex(b => b.isbn === isbn);
    if (index !== -1) {
      this.books.splice(index, 1);
      return true;
    }
    return false;
  }

  findBook(title) {
    return this.books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  }

  getAvailableBooks() {
    return this.books.filter(b => b.isAvailable);
  }
}

class Member {
  constructor(name, memberId) {
    this.name = name;
    this.memberId = memberId;
    this.borrowedBooks = [];
  }

  borrowBook(book) {
    if (!(book instanceof Book)) {
      throw new Error('Đầu vào không hợp lệ');
    }
    book.borrow(); // Sẽ ném lỗi nếu không có sẵn
    this.borrowedBooks.push(book);
  }

  returnBook(book) {
    const index = this.borrowedBooks.findIndex(b => b.isbn === book.isbn);
    if (index === -1) {
      throw new Error('Người dùng không mượn sách này');
    }
    book.returnBook();
    this.borrowedBooks.splice(index, 1);
  }

  getBorrowedBooks() {
    return [...this.borrowedBooks];
  }
}

module.exports = {
  Book,
  Library,
  Member
};
