# Thiệp cưới online Tuấn Điệp & Đinh Thảo

## 1. Cấu trúc thư mục
- `index.html`: toàn bộ thiệp (nội dung, giao diện, mã chạy).
- `images/anh01.jpg` ... `anh12.jpg`: ảnh cưới (ảnh bìa là `anh10.jpg`, ảnh tròn chú rể/cô dâu cắt từ `anh12.jpg`).
- `yes-i-do.mp3`: nhạc nền, tự phát khi khách bấm "Chạm để mở thiệp".
- `google-apps-script.gs`: mã dán vào Google Apps Script để lưu lời chúc và xác nhận tham dự vào Google Sheet.

## 2. Sửa nội dung
Mở `index.html` và tìm trực tiếp chữ cần sửa (không có file cấu hình riêng):
- **Tên, ngày, bố mẹ, địa chỉ:** các phần "Thông Tin Hai Bên Gia Đình" và "Sự Kiện Trọng Đại".
- **Giờ các lễ:** hiện chỉ ghi ngày. Thêm giờ vào dòng có biểu tượng đồng hồ trong từng thẻ sự kiện.
- **Đồng hồ đếm ngược:** tìm `new Date('2026-11-16T08:00:00+07:00')` và đổi theo giờ thật.
- **Hạn phản hồi:** tìm `Vui lòng phản hồi trước ngày`.
- **Bản đồ:** hai nút "Xem Bản Đồ" trỏ tới link Google Maps nhà gái và nhà trai.
- **Ảnh:** thay file trong `images/` hoặc sửa danh sách `galleryImages` trong script. Nên nén ảnh dưới 500 KB (squoosh.app).
- **Mục Mừng cưới:** đã tạm bỏ vì chưa có số tài khoản. Khi có, thêm lại một khối `<section id="gift">` gồm số tài khoản và mã QR.

## 3. Lưu lời chúc và xác nhận vào Google Sheet
Cả "Sổ lưu bút" và "Xác nhận tham dự" dùng chung một Google Sheet.
1. Tạo Google Sheet mới → **Tiện ích mở rộng → Apps Script**.
2. Dán toàn bộ nội dung `google-apps-script.gs` → Lưu.
3. **Triển khai → Triển khai mới → Ứng dụng web**: *Chạy với tư cách* = Tôi, *Ai có quyền truy cập* = Bất kỳ ai → Triển khai (cấp quyền khi được hỏi).
4. Sao chép URL `.../exec` và dán vào hằng `WISH_API_URL` trong `index.html`.
5. Sheet tự tạo hai tab: `LoiChuc` (Thời gian, Tên, Quan hệ, Lời chúc) và `XacNhan` (Thời gian, Họ tên, Số điện thoại, Tham dự, Số người).

**Khi sửa `google-apps-script.gs`:** dán lại code, rồi **Triển khai → Quản lý bản triển khai → biểu tượng bút chì → Phiên bản: Phiên bản mới → Triển khai**. URL giữ nguyên. Nếu chỉ lưu code mà không tạo phiên bản mới, web vẫn chạy bản cũ.

Nếu `WISH_API_URL` để trống, lời chúc chỉ lưu tạm trên trình duyệt của từng người và xác nhận không được lưu.

## 4. Bong bóng lời chúc
Sau khi khách mở thiệp, lời chúc từ Sheet nổi lên ngẫu nhiên. Trang tự tải lại lời chúc mới mỗi 10 giây. Chỉnh trong `index.html` (đầu đoạn "Sổ lưu bút"):
- `BUBBLE_GAP = [3000, 5000]`: khoảng cách giữa hai bong bóng (ms).
- `BUBBLE_LIFE = [5000, 7000]`: thời gian một bong bóng hiển thị (ms).
- `REFRESH_MS = 10000`: chu kỳ tải lời chúc mới (ms).

Xóa lời chúc không phù hợp bằng cách xóa dòng trong tab `LoiChuc`.

## 5. Đưa lên GitHub Pages
1. Tạo repo mới (Public).
2. **Add file → Upload files**: kéo `index.html`, thư mục `images/` và `yes-i-do.mp3` → **Commit changes**.
3. **Settings → Pages** → *Branch* chọn `main` và `/ (root)` → **Save**.
4. Sau 1–2 phút thiệp có tại `https://ten-cua-ban.github.io/ten-repo/`.

Khi dùng nhạc có bản quyền (như bài này), chỉ nên chia sẻ trong phạm vi cá nhân/gia đình.