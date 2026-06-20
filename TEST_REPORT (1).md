# BÁO CÁO KẾT QUẢ UNIT TEST — HĐ3: VIẾT UNIT TEST (AUTOMATION TEST)

**Dự án:** Food Store (Cửa hàng bán đồ ăn trực tuyến)
**Chức năng được kiểm thử:** Thuật toán **tính tổng tiền đơn hàng có áp dụng khuyến mãi/giảm giá**
(trích từ logic trong `server.js` — route `POST /api/orders`)
**Thư viện sử dụng:** `node:test` + `node:assert` — test runner tích hợp sẵn của Node.js,
đóng vai trò tương tự JUnit (Java) / NUnit (C#) trong môi trường JavaScript.
**Người thực hiện:** _______________
**Ngày thực hiện:** Tháng 6, 2026

---

## 1. Đối tượng kiểm thử

| Hàm | Mô tả | File |
|---|---|---|
| `calculateDiscountedPrice(price, discountPercent)` | Tính giá sau khi áp dụng % giảm giá | `src/orderCalculator.js` |
| `calculateItemSubtotal(price, discountPercent, quantity)` | Tính tiền cho 1 dòng sản phẩm trong đơn hàng | `src/orderCalculator.js` |
| `calculateOrderTotal(items)` | Tính tổng tiền toàn bộ đơn hàng (nhiều sản phẩm) | `src/orderCalculator.js` |

## 2. Bảng 20 Test Case & Kết Quả

| STT | Test Case | Input | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| 1 | TC01 | price=100000, discount=0 | 100000 | 100000 | ✅ Pass |
| 2 | TC02 | price=100000, discount=15 | 85000 | 85000 | ✅ Pass |
| 3 | TC03 | price=35000, discount=15 (Cơm Tấm Sườn) | 29750 | 29750 | ✅ Pass |
| 4 | TC04 | price=100000, discount=100 | 0 | 0 | ✅ Pass |
| 5 | TC05 | price=0, discount=20 | 0 | 0 | ✅ Pass |
| 6 | TC06 | price=-5000, discount=10 | throw INVALID_PRICE | throw INVALID_PRICE | ✅ Pass |
| 7 | TC07 | price=100000, discount=-10 | throw INVALID_DISCOUNT | throw INVALID_DISCOUNT | ✅ Pass |
| 8 | TC08 | price=100000, discount=150 | throw INVALID_DISCOUNT | throw INVALID_DISCOUNT | ✅ Pass |
| 9 | TC09 | price=35000, discount=15, qty=2 | 59500 | 59500 | ✅ Pass |
| 10 | TC10 | price=40000, discount=0, qty=3 | 120000 | 120000 | ✅ Pass |
| 11 | TC11 | price=20000, discount=10, qty=1 | 18000 | 18000 | ✅ Pass |
| 12 | TC12 | price=15000, discount=0, qty=0 | throw INVALID_QUANTITY | throw INVALID_QUANTITY | ✅ Pass |
| 13 | TC13 | price=15000, discount=0, qty=-2 | throw INVALID_QUANTITY | throw INVALID_QUANTITY | ✅ Pass |
| 14 | TC14 | price=15000, discount=0, qty=2.5 | throw INVALID_QUANTITY | throw INVALID_QUANTITY | ✅ Pass |
| 15 | TC15 | items=[{35000,15%,2},{40000,0%,1}] | 99500 | 99500 | ✅ Pass |
| 16 | TC16 | items=[] | throw EMPTY_CART | throw EMPTY_CART | ✅ Pass |
| 17 | TC17 | items=null | throw INVALID_ITEMS | throw INVALID_ITEMS | ✅ Pass |
| 18 | TC18 | items=[{25000,0%,1}] | 25000 | 25000 | ✅ Pass |
| 19 | TC19 | items chứa 1 sp giá âm | throw INVALID_PRICE | throw INVALID_PRICE | ✅ Pass |
| 20 | TC20 | price=20000, discount=0, qty=1000 | 20000000 | 20000000 | ✅ Pass |

## 3. Kết quả chạy test (tổng hợp)

```
# tests 20
# suites 0
# pass 20
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

**➡️ 20/20 test case PASS (100%).**

Chi tiết log đầy đủ: xem file `reports/test-output-FINAL-PASS.txt`.

## 4. Minh chứng khả năng phát hiện lỗi (Mutation Test thủ công)

Để chứng minh bộ test thực sự có khả năng **phát hiện lỗi** (không chỉ pass vì test "yếu"),
một lỗi giả lập (quên áp dụng % giảm giá: `return price` thay vì
`return price * (100 - discountPercent) / 100`) đã được chèn tạm vào source code và chạy lại:

| Kết quả khi CÓ BUG | Số lượng |
|---|---|
| Pass | 14 |
| **Fail** | **6** (TC02, TC03, TC04, TC09, TC11, TC15 — đúng các case có giảm giá ≠ 0%) |

```
# tests 20
# pass 14
# fail 6
```

➡️ Bộ test phát hiện đúng 6 trường hợp liên quan đến giảm giá bị sai, trong khi 14 trường hợp
không liên quan đến giảm giá vẫn pass — chứng tỏ test case được thiết kế chính xác,
bám sát logic nghiệp vụ. Sau khi khôi phục code gốc, lại đạt 20/20 Pass.

Log đầy đủ của lần chạy có bug: xem file `reports/test-output-WITH-BUG.txt`.


