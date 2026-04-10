const { createBankAccount } = require('../src/bai1_2_private_variables');

describe('Bài 1.2: createBankAccount', () => {
  let account;

  beforeEach(() => {
    account = createBankAccount(100); // Khởi tạo tài khoản với 100
  });

  test('getBalance nên trả về số dư chính xác', () => {
    expect(account.getBalance()).toBe(100);
  });

  test('deposit nên tăng số dư khi gửi tiền hợp lệ', () => {
    const result = account.deposit(50);
    expect(result.balance).toBe(150);
    expect(account.getBalance()).toBe(150);
  });

  test('deposit nên ném lỗi nếu số tiền không dương', () => {
    expect(() => account.deposit(0)).toThrow('Số tiền gửi phải là một số dương hợp lệ.');
    expect(() => account.deposit(-10)).toThrow('Số tiền gửi phải là một số dương hợp lệ.');
  });

  test('withdraw nên giảm số dư khi rút tiền hợp lệ', () => {
    const result = account.withdraw(40);
    expect(result.balance).toBe(60);
    expect(account.getBalance()).toBe(60);
  });

  test('withdraw nên ném lỗi nếu rút nhiều hơn số dư', () => {
    expect(() => account.withdraw(200)).toThrow('Số dư không đủ để rút tiền.');
  });

  test('withdraw nên ném lỗi nếu số tiền rút không dương', () => {
    expect(() => account.withdraw(0)).toThrow('Số tiền rút phải là một số dương hợp lệ.');
    expect(() => account.withdraw(-50)).toThrow('Số tiền rút phải là một số dương hợp lệ.');
  });

  test('getTransactionHistory nên ghi nhận đúng lịch sử', () => {
    account.deposit(200);
    account.withdraw(50);
    
    const history = account.getTransactionHistory();
    expect(history.length).toBe(3); // 1 initial deposit + 1 deposit + 1 withdraw
    
    expect(history[0].type).toBe('deposit');
    expect(history[0].amount).toBe(100);
    
    expect(history[1].type).toBe('deposit');
    expect(history[1].amount).toBe(200);
    
    expect(history[2].type).toBe('withdraw');
    expect(history[2].amount).toBe(50);
  });
});
