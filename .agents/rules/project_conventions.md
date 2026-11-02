# Project Conventions & Architecture Guidelines

Quy chuẩn và thiết lập dự án Costume Rental (Frontend + Backend).

## 1. Ngôn ngữ & Giao tiếp (Language & Messages)
- **Giao tiếp và giải thích:** 100% Tiếng Việt.
- **Chú thích trong code (Comments):** Viết bằng Tiếng Việt.
- **Thông báo phản hồi API & Lỗi:** Luôn viết bằng Tiếng Việt (ví dụ: `Tên danh mục không được để trống`, `Tạo trang phục thành công`).
- **Giao diện & Thông báo người dùng (UI / Alert / Confirm):** Tiếng Việt chuẩn.

## 2. Kiến trúc BackEnd (Node.js & Express)
- **Module System:** CommonJS (`require` và `module.exports`).
- **Port:** Mặc định `process.env.PORT || 5000`.
- **Database:** MongoDB qua Mongoose (`^9.x`).
- **Mô hình Dữ liệu (Models):**
  - Luôn hỗ trợ soft delete với trường `deleted: { type: Boolean, default: false }`.
  - Mọi câu truy vấn tìm kiếm dữ liệu mặc định phải lọc `{ deleted: false }`.
  - Hỗ trợ timestamps: `{ timestamps: true }`.
  - Tự động sinh slug bằng `mongoose-slug-updater` qua plugin (`slug: 'name'` hoặc `slug: 'title'`, `unique: true`).
- **Upload File:**
  - Dùng `multer` với `multer.memoryStorage()`.
  - Xử lý upload lên Cloudinary qua `streamifier` tại `BackEnd/helpers/uploadToCloudinary.js`.
  - Middleware upload ảnh đơn / đa ảnh tại `BackEnd/middlewares/admin/uploadCloud.middleware.js` (`uploadSingle`, `uploadFields`).
- **Cấu trúc Thư mục:**
  - `BackEnd/config/`: `database.js` (kết nối DB), `config.js` (`systemConfig.prefixAdmin = "admin"`).
  - `BackEnd/controllers/admin/`: Các controller theo từng thực thể (`category.controller.js`, `costume.controller.js`).
  - `BackEnd/models/admin/`: Schema mongoose (`category.model.js`, `costume.model.js`, `size.model.js`).
  - `BackEnd/routes/admin/`: Định tuyến Express với tiền tố `/${PATH_ADMIN}/...` gom tại `index.route.js`.
  - `BackEnd/helpers/`: Các hàm tái sử dụng như dựng cây phân cấp (`createTree.js`: `createTree`, `createSelectTree`), upload Cloudinary.
- **Chuẩn phản hồi API (Response Format):**
  - Thành công: `{ success: true, message?: string, data?: any }`
  - Thất bại: `{ success: false, message: string }`

## 3. Kiến trúc FrontEnd (Next.js App Router)
- **Framework:** Next.js (App Router, version 16), React 19.
- **Ngôn ngữ file trang Admin:** JavaScript / JSX (`.jsx`) cho các trang Admin (`page.jsx`, `layout.jsx`, components).
- **Client Side:** Đặt `'use client';` ở đầu file cho các trang quản trị dùng state, hooks, fetch API.
- **Gọi API:** Sử dụng `axios` gọi đến BackEnd (`http://localhost:5000/admin/...`).
- **Quản lý CSS & Styling:**
  - Sử dụng CSS riêng biệt theo từng tính năng đặt tại `FrontEnd/app/css/admin/...`:
    - Khung giao diện Admin: `@/app/css/admin/admin.css`
    - Quản lý danh mục: `@/app/css/admin/categories/style.css`, `create.css`, `detail.css`
    - Quản lý trang phục: `@/app/css/admin/costumes/style.css`, `create.css`, `detail.css`
  - Import trực tiếp file CSS tương ứng vào đầu mỗi trang.
- **Xử lý Danh mục dạng Cây:**
  - Bảng danh mục hiển thị phân cấp cha - con thụt lề bằng tiền tố `— ` và padding động theo level.

## 4. Tối ưu Token & Tra cứu Sơ đồ (Graphify)
- Khi tìm hiểu cấu trúc hoặc xác định file cần sửa, ưu tiên truy vấn graph:
  - `python -m graphify query "<keyword>"`
  - `python -m graphify path "<Node A>" "<Node B>"`
- Chỉ đọc phạm vi dòng cần thiết bằng `StartLine` / `EndLine`, không đọc toàn bộ file.
- Chạy `python -m graphify update .` sau khi thay đổi mã nguồn để đồng bộ sơ đồ kiến thức.
