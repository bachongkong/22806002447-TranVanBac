# SmartHire Design System (Frontend Tailwind)

> **Cập nhật:** Hệ thống hiện tại đã chuyển sang sử dụng **TailwindCSS v4** và **Framer-Motion** để thống nhất với bản thiết kế gốc từ `smarthire-app`. Vui lòng KHÔNG tự viết CSS chay unless cần thiết, hãy sử dụng Utility classes.

---
### 🎯 Nguyên Tắc Chung

1. **Mỗi animation phải có mục đích** — Dẫn dắt mắt người dùng hoặc truyền tải thông tin
2. **Subtle > Flashy** — Premium = tinh tế, không phô trương
3. **Performance first** — Ưu tiên `transform` và `opacity` (GPU-accelerated)
4. **Consistent timing** — Sử dụng chuỗi easing chuẩn thiết kế
5. **Thiết kế sáng tạo** - Các màn hình phải WOW và chuẩn UX 2026

---

## 1. Color Tokens (Tailwind)

Hệ thống đã map sẵn các biến màu vào Tailwind. Bạn chỉ cần gõ class theo tiền tố, VD: `text-primary`, `bg-card`, `border-border`.

| Token CSS | Tên Màu Tailwind | Usage |
|:---|:---|:---|
| `--background` | `bg-background` | Nền của cả trang web |
| `--foreground` | `text-foreground` | Chữ chính trên nền trang web |
| `--primary` | `bg-primary`, `text-primary` | Màu đen nhám hoặc phần tử nổi bật nhất |
| `--accent` | `bg-accent`, `text-accent` | Nhấn màu xanh lá (Green #22C55E) |
| `--muted-foreground` | `text-muted-foreground` | Phụ đề, text nhạt màu |
| `--card` | `bg-card` | Nền của thẻ Component (Trắng/Đen tùy mode) |
| `--border` | `border-border` | Màu viền chung mờ |

**Accent Đặc biệt:**
Hệ thống chuộng Gradient Green to Yellow, sử dụng utility class:
`bg-gradient-to-r from-green-500 to-emerald-500`

---

## 2. Shared Components Khuyên Dùng

Chúng ta sẽ xây dựng các Component tái sử dụng trong `src/shared/components/`. Khi code UI mới, hãy Import các component này ra thay vì tự code lại bằng thẻ HTML:

- `<Button />`: Mặc định có bo góc `rounded-lg`, hiệu ứng hover nảy và gradient.
- `<ParticleBackground />`: Đặt ở sau cùng Z-index để tạo các hạt mờ chuyển động.
- `<ThemeToggle />`: Nút thay đổi Light/Dark mode.

---

## 3. Dark / Light Mode

Chúng ta dùng **Class-based Dark Mode** của Tailwind.
- The root `<body />` sẽ được gắn class `.dark` khi hiển thị chế độ tối.
- Khi code, hãy code chế độ sáng trước, sau đó chèn thêm prefix `dark:` cho bản tối.

Ví dụ:
```jsx
<div className="bg-white text-black dark:bg-[#1C252E] dark:text-white border border-[rgba(145,158,171,0.12)]">
   Card nội dung
</div>
```

---

## 4. Typography
- **Heading (H1-H6):** Dùng font `Barlow` (đã config tự động trong index.css). Cần nhấn mạnh hãy dùng class `font-bold tracking-tight`.
- **Body Text:** Font mặc định là `Inter`. Dùng `text-base` hoặc `text-lg` cho đoạn văn.

## 5. Shadow & Glassmorphism

Với các bảng điều khiển hoặc Modal tạo bóng mờ cao cấp, thay vì viết CSS chay, hãy sử dụng tổ hợp classes:
```jsx
<div className="backdrop-blur-xl bg-white/70 dark:bg-black/50 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg"> ... </div>
```
Hoặc dùng Class CSS đã tạo sẵn trong `index.css`:
`<div className="card glass"></div>`
