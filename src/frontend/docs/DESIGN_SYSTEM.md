# SmartHire Design System

Tài liệu Thiết kế Hệ thống (Design System) của nền tảng tuyển dụng SmartHire. Hệ thống này định nghĩa toàn bộ ngôn ngữ thị giác, thành phần UI, và các nguyên tắc thiết kế được áp dụng trên toàn bộ Frontend (dành cho các roles: Candidate, HR, và Admin).

---

## 1. Triết lý Thiết kế (Design Philosophy)

SmartHire kết hợp hai xu hướng thiết kế mạnh mẽ đem lại một giao diện hiện đại (Modern), tin cậy (Trustworthy), nhưng không kém phần mềm mại và thu hút:

*   **Flat Design (Thiết kế phẳng):** Áp dụng cho cấu trúc bố cục gốc, không gian trống (whitespace), typography sắc nét và hệ thống lưới rõ ràng. Giúp giao diện dễ đọc, hiệu suất tải nhanh và trực quan với hệ thống dữ liệu lớn của HR/Admin.
*   **Glassmorphism (Hiệu ứng kính mờ):** Làm mềm thiết kế với các mảng nổi (Floating panels), Navbar/Header xuyên thấu có độ blur cao. Đem lại hiệu ứng chiều sâu (Depth), cảm giác "Premium SaaS" mà không làm rối thông tin.

---

## 2. Nền tảng (Foundations)

### 2.1. Màu sắc (Color Palette)

Hệ thống màu sắc được mở rộng cấu hình tại `tailwind.config` dựa vào bộ Material You Tonal Palettes, tối ưu cho tỷ lệ tương phản WCAG.

#### Primary (Màu chính)
Màu nhận diện thương hiệu, biểu trưng cho sự chuyên nghiệp và sức mạnh công nghệ.
*   **Primary:** `#143de7` — Dùng cho nút chính (Primary buttons), links quan trọng.
*   **Primary Container:** `#3b5bff` — Nền phụ trợ mảng màu xanh.
*   **Primary Gradient:** `linear-gradient(135deg, #3B5BFF 0%, #8B5CF6 100%)` — Gradient nhận diện cho Header text và các Background khối đặc biệt.

#### Secondary & Tertiary (Màu phụ & Nhấn)
*   **Secondary:** `#6b38d4` (Tím) — Đại diện cho cụm tính năng HR (Groups, Interview).
*   **Tertiary:** `#725000` (Vàng Đồng) — Đại diện cho cụm tính năng Admin (Analytics, Stats).

#### Background & Surfaces (Bề mặt & Nền)
*   **Background (Nền website):** `#f7f9fb` — Xám trắng thanh lịch, tránh chói mắt hơn pure white (`#ffffff`).
*   **Surface:** Cấu trúc tầng bậc: 
    *   `surface-container-lowest`: `#ffffff` (Card tĩnh, Input)
    *   `surface-container-low`: `#f2f4f6` (Bản điều khiển, Sidebar)
    *   `surface-container-high`: `#e6e8ea` (Divider, Border nhẹ)
*   **Text / Typography:** 
    *   `on-surface`: `#191c1e` (Dark Grey cho tiêu đề, nội dung chính)
    *   `on-surface-variant`: `#444656` (Màu cho đoạn văn bản phụ, ghi chú)

### 2.2. Nghệ thuật Typography

Sử dụng Google Fonts kết hợp giữa tính hiện đại mang hơi hướng cá tính và tính dễ đọc của văn bản làm việc.

*   **Font Headline (Tiêu đề):** `Plus Jakarta Sans`
    *   *Usage:* Tiêu đề trang (H1, H2, H3), logo text, highlight số liệu.
    *   *Weights:* ExtraBold (800), Bold (700). Tăng tính Impact cực cao.
    *   *Tracking (Letter-spacing):* Thường đi kèm `tracking-tight`.
*   **Font Body & Label (Văn bản):** `Inter`
    *   *Usage:* Đoạn văn, thẻ UI, input form, dữ liệu bảng thống kê.
    *   *Weights:* Regular (400), Medium (500), SemiBold (600).

---

## 3. Kiến trúc Shapes & Effects

### 3.1. Hình khối (Border Radius)
Sử dụng các góc bo tròn lớn mang đậm tính "Friendly, Modern SaaS" thay vì thiết kế góc cạnh cổ điển.
*   **Mặc định (Cards/Modals):** `1rem` (16px) — Tailwind `rounded-2xl` / `rounded-lg` tuýp project.
*   **Buttons:** Hình viên thuốc (Pill shape) — Tailwind `rounded-full` (`9999px`).

### 3.2. Hiệu ứng Kính (Glassmorphism Utilities)
Class CSS tùy chỉnh để áp dụng phong cách Glass. Thường dùng trên Fixed Headers, Floating Cards và Notifications.

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3); /* Viền mỏng làm nổi kính */
}
```

### 3.3. Các Hiệu ứng & Chuyển động (Animations/Transitions)

Những cử chỉ siêu nhỏ (Micro-interactions) làm giao diện trở nên sống động.

*   **Spring Hover (`.spring-hover`):** 
    Hiệu ứng nhún đàn hồi táo bạo khi người dùng hover qua Card hay Button.
    *CSS:* `transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1); hover:scale(1.05)`
*   **Trôi nổi (`.floating`):**
    Hiệu ứng nhấp nhô tuần hoàn dành riêng cho hình khối decor, badge thông báo nổi.
    *Keyframes:* Lên xuống 15px trong khoảng chu kỳ 6s (`ease-in-out`).

---

## 4. Components chính (Core Components)

### 4.1. Buttons
*   **Primary Button:** `bg-primary text-white rounded-full font-bold px-10 py-4 spring-hover shadow-xl shadow-primary/20`.
*   **Outline Button:** Trắng xuyên thấu hoặc trong suốt với `border-[1.5px] border-outline-variant bg-transparent hover:bg-primary-fixed/20`.

### 4.2. Layout Container & Dashboard
*   **Header cố định:** Được phủ `liquid-glass` (`bg-white/70 backdrop-blur-xl`) nhằm giữ cấu trúc Flat bên dưới trượt qua thấy bóng mờ.
*   **Dashboard Panels:** Chứa dữ liệu (Workspace) giữ background bệt `bg-surface-container-lowest` (`#ffffff`) để dễ hiển thị Data Grid / Chart phẳng, kết hợp với các Icon lớn hình thù hữu cơ làm yếu tố phá cách.
*   **Thẻ Job/Hồ sơ (Card):** Border mỏng siêu tinh tế `border border-primary/5` (Flat), tích hợp `spring-hover` kèm hiệu ứng `hover:shadow-lg` nhằm làm nổi layer.

### 4.3. Đồ họa phụ trợ (Decorators)
*   **Memphis Patterns (`.memphis-pattern`):** Nền họa tiết chấm bi tròn màu sắc chủ đạo kết nối các section, xóa mờ ranh giới của Flat design cứng nhắc bằng nghệ thuật Neo-Memphis hiện đại.
*   **Gradient Orbs:** Các khối vòng sáng ẩn dưỡi text/hình (`w-48 h-48 bg-primary-fixed opacity-30 rounded-lg blur-3xl`) tạo môi trường Glowy nhẹ.

---

## 5. Nguyên tắc Thực thi (Best Practices)

1.  **Dùng hệ thống biến CSS/Tailwind Config:** KHÔNG hardcode màu HEX vào HTML hay file `.css` cục bộ. Luôn gọi màu như `bg-surface`, `text-on-surface`, `text-primary`.
2.  **Đừng lạm dụng Glassmorphism:** Tính năng này "nặng" về mặt layout và render của GPU trình duyệt. Chỉ dùng `.liquid-glass` cho Navbar, Floating Badges, Tooltips hoặc Modals cao cấp. Không dùng làm nền cho Component dày đặc văn bản.
3.  **Flat Text First:** Typography trên nền màu cần độ tương phản cực tốt. Dùng `text-on-surface-variant` cho caption/sub-title để giảm chói mắt.
4.  **Tương tác "Đàn hồi":** Dùng `.spring-hover` trên UI tĩnh nhưng cần hạn chế tối đa trên các UI mang tính list/từng dòng để tránh gây lóa mắt/ giật màn hình (e.g. tránh xài spring trên các List Row nội dung chi chít của bảng biểu Admin).

--- 

*Tài liệu được sinh ra phục vụ mục đích Development quy chuẩn đồng nhất. Các Dev tham chiếu các class `tailwind` trực tiếp tại đây.*
