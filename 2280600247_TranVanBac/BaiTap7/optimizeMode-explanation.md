# Giải thích vì sao `optimizeMode` nhanh hơn

---

## 1) `optimizeMode` đang làm gì?

Trong màn hình lab có 2 nhánh render:

- `optimizeMode = false` (nhánh chưa tối ưu)
- `optimizeMode = true` (nhánh đã tối ưu)

Điểm khác biệt chính nằm ở 3 kỹ thuật:

1. Dùng `useDeferredValue(query)` để giảm tranh chấp ưu tiên khi gõ.
2. Dùng `useMemo(...)` để tránh chạy lại `heavyFilterAndSort` không cần thiết.
3. Dùng `React.memo(UserRow)` để tránh re-render dư thừa ở từng dòng bảng.

---

## 2) Vì sao nhánh chưa tối ưu chậm hơn?

Ở nhánh chưa tối ưu:

- Mỗi lần component render lại sẽ gọi:
  - `heavyFilterAndSort(users, query, onlyActive, sortBy)`
- Hàm này có vòng lặp nặng trong lúc filter (`for ... i < 80`) cho mỗi user.
- Sau đó map trực tiếp `<tr>` inline, nên khi cha render lại thì nhiều row cũng render lại.

Hệ quả:

- Gõ Search liên tục -> re-render liên tục.
- Mỗi re-render lại chạy tính toán nặng.
- Commit duration tăng, cảm giác gõ bị khựng.

---

## 3) Vì sao `optimizeMode` nhanh hơn?

## A. `useDeferredValue` ưu tiên input mượt

- Input vẫn update theo `query` ngay.
- Danh sách lớn dùng `deferredQuery` (ưu tiên thấp hơn) để tính toán.
- Khi gõ nhanh, React ưu tiên giữ UI nhập liệu phản hồi trước, rồi mới cập nhật list.

Ý nghĩa thực tế:

- Caret ít giật hơn khi nhập nhanh.
- Cảm giác “mượt” tăng rõ dù list vẫn lớn.

> Lưu ý: `useDeferredValue` không tự giảm số request mạng. Nó tối ưu nhịp render UI.

## B. `useMemo` giảm số lần tính toán nặng

- `optimizedRows` chỉ tính lại khi dependency đổi:
  - `users`, `deferredQuery`, `onlyActive`, `sortBy`, `maxRows`
- Nếu dependency chưa đổi, React dùng lại kết quả cũ.

Ý nghĩa thực tế:

- Tránh lặp lại `heavyFilterAndSort` ở các render không liên quan.
- Avg/Max commit duration giảm trong nhiều commit.

## C. `React.memo(UserRow)` giảm re-render của từng dòng

- `UserRow` được bọc `memo`, nên khi prop `user` không đổi reference thì row đó không cần render lại.
- So với nhánh inline `<tr>`, nhánh này giảm số lượng row phải render trong mỗi commit.

Ý nghĩa thực tế:

- Flamegraph bớt “nóng” ở phần danh sách.
- Tab Ranked cho thấy thời gian phân bổ vào row giảm.

---

## 4) Tại sao đôi lúc bạn vẫn thấy commit thấp ở lần load đầu?

Vì React Profiler đo thời gian render/commit, không đo thời gian chờ API.

- Lần đầu load thường có 1-2 commit ngắn (set loading, set users).
- Nghẽn thật thường lộ ra khi thao tác liên tiếp:
  - gõ Search nhanh
  - đổi Sort nhiều lần
  - bật/tắt filter

Do đó, để thấy khác biệt optimize rõ nhất, hãy đo theo kịch bản tương tác chứ không chỉ nhìn commit load đầu.

---

## 5) Cách kiểm chứng `optimizeMode` nhanh hơn

1. Đặt:
  - `Dataset Size = 8000`
  - `Render Rows = 2000`
2. Record Profiler với `optimizeMode = OFF`
3. Gõ nhanh 12-15 ký tự + đổi sort 3 lần + toggle active 2 lần
4. Record lại y hệt với `optimizeMode = ON`
5. So sánh:
  - Avg commit duration
  - Max commit duration
  - Component nóng nhất (Ranked/Flamegraph)

Nếu cần ép chênh lệch rõ hơn:

- Tăng lên `Dataset Size = 12000`, `Render Rows = 3000-4000` (nếu backend cho phép thì nâng trần).
- Hoặc bật CPU slowdown 4x trong Chrome DevTools.

---

## 6) Tóm tắt

`optimizeMode` nhanh hơn vì nó giảm cả **tần suất** lẫn **chi phí** của render: trì hoãn update list nặng (`useDeferredValue`), cache kết quả tính toán (`useMemo`), và cắt bớt re-render hàng loạt ở row (`React.memo`).