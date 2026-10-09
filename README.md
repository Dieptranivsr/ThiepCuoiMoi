# Thiệp cưới online Tuấn Điệp & Đinh Thảo

## 1. Cấu trúc thư mục
- `index.html`: nội dung và giao diện thiệp (HTML + CSS).
- `js/main.js`: toàn bộ mã chạy (cuộn phim, lịch trình, album, lời chúc, hộp quà, số tài khoản...). Các mục `PARTIES`, `CEREMONIES`, `PLACES`, `GIFT_ACCOUNTS`, `galleryImages`, `WISH_API_URL`... nhắc tới bên dưới đều nằm trong file này.
- `images/anh01.jpg` ... `anh12.jpg`: ảnh cưới (ảnh bìa là `anh10.jpg`, ảnh tròn chú rể/cô dâu cắt từ `anh12.jpg`).
- `music/yeu2-tu-giay-28.mp3`: nhạc nền Yêu 2 đã cắt từ giây 28 (bỏ nhạc dạo), tự phát khi khách chọn phía khách mời để mở thiệp.
- `google-apps-script.gs`: mã dán vào Google Apps Script để lưu lời chúc và xác nhận tham dự vào Google Sheet.

## 2. Sửa nội dung
Chữ hiển thị cố định sửa trong `index.html`; lịch trình, số tài khoản, danh sách ảnh, đồng hồ đếm ngược sửa trong `js/main.js`:
- **Tên, bố mẹ, địa chỉ:** phần "Thông Tin Hai Bên Gia Đình".
- **Lịch trình sự kiện:** khách chọn "Bạn Cô Dâu" hoặc "Bạn Chú Rể" ở màn hình phong bì, phần "Sự Kiện Trọng Đại" hiện lịch tương ứng (khách vẫn chuyển qua lại được). Lễ Vu Quy và Lễ Thành Hôn dùng chung giờ cho cả hai phía, sửa trong `CEREMONIES`; tiệc chung vui riêng từng phía sửa trong `PARTIES` (gồm cả ngày âm lịch `lunar`); địa chỉ và link bản đồ trong `PLACES` (cùng trong script).
- **Đồng hồ đếm ngược:** tìm `new Date('2026-11-16T16:30:00+07:00')` và đổi theo giờ thật.
- **Hạn phản hồi:** tìm `Vui lòng phản hồi trước ngày`.
- **Bản đồ:** hai nút "Xem Bản Đồ" trỏ tới link Google Maps nhà gái và nhà trai.
- **Ảnh:** thay file trong `images/` hoặc sửa danh sách `galleryImages` trong script. Nên nén ảnh dưới 500 KB (squoosh.app).
- **Hộp quà mừng cưới:** nằm cuối mục Sổ lưu bút (khối `<div id="gift">`), không có tiêu đề, chỉ có chiếc hộp và dòng "Chạm nhẹ vào món quà". Bấm vào: nắp hộp bật lên rồi mở popup giữa màn hình (khối `<div id="giftModal">`) gồm lời cảm ơn, mã QR (`images/qr-chu-re.jpg`, `images/qr-co-dau.jpg`) và số tài khoản (sửa trong `GIFT_ACCOUNTS` ở `js/main.js`).

## 3. Lưu lời chúc và xác nhận vào Google Sheet
Cả "Sổ lưu bút" và "Xác nhận tham dự" dùng chung một Google Sheet.
1. Tạo Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Dán toàn bộ nội dung `google-apps-script.gs` → Lưu.
3. **Triển khai → Triển khai mới → Ứng dụng web**: *Chạy với tư cách* = Tôi, *Ai có quyền truy cập* = Bất kỳ ai → Triển khai (cấp quyền khi được hỏi).
4. Sao chép URL `.../exec` và dán vào hằng `WISH_API_URL` trong `js/main.js`.
5. Sheet tự tạo hai tab: `LoiChuc` (Thời gian, Tên, Quan hệ, Lời chúc) và `XacNhan` (Thời gian, Họ tên, Số điện thoại, Tham dự, Số người).

**Khi sửa `google-apps-script.gs`:** dán lại code, rồi **Triển khai → Quản lý bản triển khai → biểu tượng bút chì → Phiên bản: Phiên bản mới → Triển khai**. URL giữ nguyên. Nếu chỉ lưu code mà không tạo phiên bản mới, web vẫn chạy bản cũ.

Nếu `WISH_API_URL` để trống, lời chúc chỉ lưu tạm trên trình duyệt của từng người và xác nhận không được lưu.

## 4. Bong bóng lời chúc
Sau khi khách mở thiệp, lời chúc từ Sheet nổi lên ngẫu nhiên. Trang tự tải lại lời chúc mới mỗi 10 giây. Chỉnh trong `js/main.js` (đầu đoạn "Sổ lưu bút"):
- `BUBBLE_GAP = [3000, 5000]`: khoảng cách giữa hai bong bóng (ms).
- `BUBBLE_LIFE = [5000, 7000]`: thời gian một bong bóng hiển thị (ms).
- `REFRESH_MS = 10000`: chu kỳ tải lời chúc mới (ms).

Xóa lời chúc không phù hợp bằng cách xóa dòng trong tab `LoiChuc`.

## 5. Đưa lên GitHub Pages
1. Tạo repo mới (Public).
2. **Add file → Upload files**: kéo `index.html`, thư mục `js/`, thư mục `images/`, thư mục `music/` (gồm `yeu2-tu-giay-28.mp3`) → **Commit changes**.
3. **Settings → Pages** → *Branch* chọn `main` và `/ (root)` → **Save**.
4. Sau 1–2 phút thiệp có tại `https://ten-cua-ban.github.io/ten-repo/`.

Khi dùng nhạc có bản quyền (như bài này), chỉ nên chia sẻ trong phạm vi cá nhân/gia đình.