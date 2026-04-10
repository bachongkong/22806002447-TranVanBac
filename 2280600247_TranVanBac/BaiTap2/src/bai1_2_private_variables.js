/**
 * Bài 1.2: Private Variables
 * 
 * Sử dụng closure tạo tài khoản ngân hàng với các properties private
 */

/**
 * Tạo một tài khoản ngân hàng với số dư và lịch sử giao dịch được bảo vệ
 * @param {number} [initialBalance=0] - Số dư khởi tạo
 * @returns {Object} Các phương thức thao tác với tài khoản
 */
function createBankAccount(initialBalance = 0) {
  // Private variables
  let balance = initialBalance;
  let history = [];

  // Record initial deposit if any
  if (initialBalance > 0) {
    history.push({ type: 'deposit', amount: initialBalance, date: new Date() });
  }

  return {
    /**
     * Gửi tiền vào tài khoản
     * @param {number} amount - Số tiền gửi (phải lớn hơn 0)
     * @returns {Object} Thông báo và số dư hiện tại, hoặc báo lỗi nếu amount không hợp lệ
     */
    deposit(amount) {
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Số tiền gửi phải là một số dương hợp lệ.');
      }
      balance += amount;
      history.push({ type: 'deposit', amount, date: new Date() });
      return { message: 'Gửi tiền thành công', balance };
    },

    /**
     * Rút tiền từ tài khoản
     * @param {number} amount - Số tiền muốn rút
     * @returns {Object} Thông báo và số dư hiện tại, hoặc báo lỗi nếu rút không hợp lệ
     */
    withdraw(amount) {
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Số tiền rút phải là một số dương hợp lệ.');
      }
      if (amount > balance) {
        throw new Error('Số dư không đủ để rút tiền.');
      }
      balance -= amount;
      history.push({ type: 'withdraw', amount, date: new Date() });
      return { message: 'Rút tiền thành công', balance };
    },

    /**
     * Xem số dư hiện tại
     * @returns {number} Số dư khả dụng
     */
    getBalance() {
      return balance;
    },

    /**
     * Lấy lịch sử giao dịch
     * @returns {Array} Mảng chứa các object đại diện cho lịch sử giao dịch
     */
    getTransactionHistory() {
      // Trả về bản copy để ngăn việc chỉnh sửa mảng từ bên ngoài
      return [...history];
    }
  };
}

module.exports = {
  createBankAccount
};
