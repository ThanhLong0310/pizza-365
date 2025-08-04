"use strict";
/*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
// Mảng danh sách các mã giảm giá
var gDiscountVouchers = [
    { voucherID: "10345", percentDiscount: 20 }, // mã giảm giá là 10345, phần trăm giảm giá 20%
    { voucherID: "11346", percentDiscount: 10 },
    { voucherID: "20445", percentDiscount: 5 },
    { voucherID: "21457", percentDiscount: 30 },
    { voucherID: "32154", percentDiscount: 20 },
    { voucherID: "30546", percentDiscount: 25 },
    { voucherID: "41351", percentDiscount: 15 },
    { voucherID: "53360", percentDiscount: 5 },
    { voucherID: "65343", percentDiscount: 30 },
    { voucherID: "78328", percentDiscount: 40 },
];
const gSMALL_SIZE = "S";
const gMEDIUM_SIZE = "M";
const gLARGE_SIZE = "L";

const gPIZZA_HAWAI = "Pizza Hawai";
const gPIZZA_HAISAN = "Pizza Hả Sản";
const gPIZZA_BACON = "Pizza Bacon";

var currentOrder = null;

/*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
function onBtnSmallSizeClick() {
    currentOrder = {
        size: getSize(gSMALL_SIZE, "20 cm", 2, "200 gr", 2, 150000),
        pizza: null
    };
    // Đổi màu button
    changeSizeButtonColor(gSMALL_SIZE);
}
function onBtnMediaSizeClick() {
    currentOrder = {
        size: getSize(gMEDIUM_SIZE, "25 cm", 4, "300 gr", 3, 200000),
        pizza: null
    };
    // Đổi màu button
    changeSizeButtonColor(gMEDIUM_SIZE);
}
function onBtnLargeSizeClick() {
    currentOrder = {
        size: getSize(gLARGE_SIZE, "30 cm", 8, "500 gr", 4, 250000),
        pizza: null
    };
    // Đổi màu button
    changeSizeButtonColor(gLARGE_SIZE);
}

///// nút dành cho chọn pizza
function onBtnPizzaHawai() {
    if (!currentOrder) currentOrder = { size: null };
    currentOrder.pizza = getPizza(gPIZZA_HAWAI, "Món ăn thanh đạm", "Hãy thưởng thức món ăn với phong cách Alo Ha đến từ Hawai.");
    changePizzaButtonColor(gPIZZA_HAWAI);
}
function onBtnPizzaHaiSan() {
    if (!currentOrder) currentOrder = { size: null };
    currentOrder.pizza = getPizza(gPIZZA_HAISAN, "Món ăn đến từ biển", "Bạn đã thử pizza được chế biến từ nguyên liệu hải sản chưa ?");
    changePizzaButtonColor(gPIZZA_HAISAN);
}
function onBtnPizzaBacon() {
    if (!currentOrder) currentOrder = { size: null };
    currentOrder.pizza = getPizza(gPIZZA_BACON, "Món ăn đăc biệt", "Được chế biến từ thịt bacon. Mang đến hương vị mới lạ.");
    changePizzaButtonColor(gPIZZA_BACON);
}
//hàm kiểm tra email
function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//ham kiemt tra so diện thoại
function kiemTraSoDienThoai(sdt) {
    // Loại bỏ tất cả khoảng trắng
    sdt = sdt.replace(/\s/g, '');
    const regex = /^(\+|0)[0-9]{9,11}$/;
    return regex.test(sdt);
}

function onBtnKiemTraDonHang() {
    if (!currentOrder) {
        alert("Vui lòng chọn combo và loại pizza trước!");
        return;
    }

    // Thu thập dữ liệu từ form
    thuThapDuLieu();

    // Kiểm tra dữ liệu
    if (kiemTraDuLieu()) {
        // Xử lý và hiển thị
        xuLiDuLieu();
    }
}

function onGuiDon() {
    if (!currentOrder) {
        alert("Không có đơn hàng nào để gửi!");
        return;
    }

    console.log("=== THÔNG TIN ĐƠN HÀNG ===");
    console.log("Combo :", currentOrder.size.size);
    console.log("Đường kính :", currentOrder.size.duongKinh);
    console.log("Số Lượng Sườn:", currentOrder.size.soLuongSuon);
    console.log("Salad:", currentOrder.size.salad);
    console.log("Số Lượng Nước ngọt:", currentOrder.size.soLuongNuocNgot);
    console.log("Giá Tiền:", currentOrder.size.giaTien);
    console.log("Pizza:", currentOrder.pizza.tenMonAn);
    console.log("Nguồn gốc Pizza", currentOrder.pizza.monAn);
    console.log("Giới Thiệu Pizza:", currentOrder.pizza.intro);
    console.log("Họ tên:", currentOrder.hoVaTen);
    console.log("Email:", currentOrder.email);
    console.log("Số điện thoại:", currentOrder.soDienThoai);
    console.log("Địa chỉ:", currentOrder.diaChi);
    console.log("Lời nhắn:", currentOrder.loiNhan || "Không có");
    console.log("Voucher:", currentOrder.voucher || "Không sử dụng");
    console.log("Tổng tiền:", currentOrder.total.toLocaleString() + " VND");
    console.log("Giảm giá:", currentOrder.discount + "% (" + currentOrder.discountAmount.toLocaleString() + " VND)");
    console.log("Thành tiền:", currentOrder.finalTotal.toLocaleString() + " VND");

    alert("Đơn hàng của bạn đã được gửi thành công!\nCảm ơn bạn đã đặt hàng tại Pizza 365.");

    // Reset form
    resetForm();
}

/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
/*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
function getSize(paramSize, paramDuongKinh, paramSoLuongSuon, paramSalad, paramSoLuongNuocNgot, paramGiaTien) {
    return {
        size: paramSize,
        duongKinh: paramDuongKinh,
        soLuongSuon: paramSoLuongSuon,
        salad: paramSalad,
        soLuongNuocNgot: paramSoLuongNuocNgot,
        giaTien: paramGiaTien,
        displaySizeInfor() {
            console.log("Combo:", this.size);
        }
    };
}


function getPizza(paramTenMonAn, paramMonAn, paramIntro) {
    return {
        tenMonAn: paramTenMonAn,
        monAn: paramMonAn,
        intro: paramIntro,
        displayPizzaInfor() {
            console.log("Pizza:", this.tenMonAN);
        }
    };
}

function changeSizeButtonColor(paramSize) {
    document.getElementById("btn-size-small").className = "btn-green";
    document.getElementById("btn-size-medium").className = "btn-green";
    document.getElementById("btn-size-large").className = "btn-green";

    if (paramSize === gSMALL_SIZE) {
        document.getElementById("btn-size-small").className = "btn-yellow";
    }
    else if (paramSize === gMEDIUM_SIZE) {
        document.getElementById("btn-size-medium").className = "btn-yellow";
    }
    else if (paramSize === gLARGE_SIZE) {
        document.getElementById("btn-size-large").className = "btn-yellow";
    }
}

function changePizzaButtonColor(paramPizza) {
    document.getElementById("btn-type-hawai").className = "btn-green";
    document.getElementById("btn-type-hai-san").className = "btn-green";
    document.getElementById("btn-type-bacon").className = "btn-green";

    if (paramPizza === gPIZZA_HAWAI) {
        document.getElementById("btn-type-hawai").className = "btn-yellow";
    }
    else if (paramPizza === gPIZZA_HAISAN) {
        document.getElementById("btn-type-hai-san").className = "btn-yellow";
    }
    else if (paramPizza === gPIZZA_BACON) {
        document.getElementById("btn-type-bacon").className = "btn-yellow";
    }
}



// vung thu thap du lieu
function thuThapDuLieu() {
    currentOrder.hoVaTen = document.getElementById("input-name").value.trim();
    currentOrder.email = document.getElementById("input-email").value.trim();
    currentOrder.soDienThoai = document.getElementById("input-phone").value.trim();
    currentOrder.diaChi = document.getElementById("input-address").value.trim();
    currentOrder.loiNhan = document.getElementById("input-message").value.trim();
    currentOrder.voucher = document.getElementById("input-voucher").value.trim();
}
// vung kiem tra du lieu
function kiemTraDuLieu() {
    if (!currentOrder.size) {
        alert("Vui lòng chọn combo!");
        return false;
    }

    if (!currentOrder.pizza) {
        alert("Vui lòng chọn loại pizza!");
        return false;
    }

    if (!currentOrder.hoVaTen) {
        alert("Vui lòng nhập họ và tên!");
        return false;
    }

    if (!currentOrder.email) {
        alert("Vui lòng nhập email!");
        return false;
    }

    if (!isValidEmail(currentOrder.email)) {
        alert("Email không hợp lệ! Vui lòng kiểm tra lại.");
        return false;
    }

    if (!currentOrder.soDienThoai) {
        alert("Vui lòng nhập số điện thoại!");
        return false;
    }

    if (!kiemTraSoDienThoai(currentOrder.soDienThoai)) {
        alert("Số điện thoại không hợp lệ! Phải bắt đầu bằng 0 hoặc + và có 10-12 số.");
        return false;
    }

    if (!currentOrder.diaChi) {
        alert("Vui lòng nhập địa chỉ!");
        return false;
    }

    return true;
}

function xuLiDuLieu() {
    const vDivcontainerOrder = document.getElementById("div-container-order");
    const vDivOrderInfor = document.getElementById("div-order-infor");

    // Xử lý voucher
    let discount = 0;
    let voucherValid = false;

    if (currentOrder.voucher) {
        const found = gDiscountVouchers.find(v => v.voucherID === currentOrder.voucher);
        if (found) {
            discount = found.percentDiscount;
            voucherValid = true;
        } else {
            alert("Mã giảm giá không tồn tại! Vui lòng kiểm tra lại.");
        }
    }

    const total = currentOrder.size.giaTien;
    const discountAmount = total * discount / 100;
    const finalAmount = total - discountAmount;

    // Lưu thông tin để sử dụng khi gửi đơn
    currentOrder.total = total;
    currentOrder.discount = discount;
    currentOrder.discountAmount = discountAmount;
    currentOrder.finalTotal = finalAmount;

    // Hiển thị thông tin
    vDivOrderInfor.innerHTML = `
      <h4>Thông tin đơn hàng</h4>
      <p><strong>Họ tên:</strong> ${currentOrder.hoVaTen}</p>
      <p><strong>Email:</strong> ${currentOrder.email}</p>
      <p><strong>Số điện thoại:</strong> ${currentOrder.soDienThoai}</p>
      <p><strong>Địa chỉ:</strong> ${currentOrder.diaChi}</p>
      <p><strong>Lời nhắn:</strong> ${currentOrder.loiNhan || "Không có"}</p>
      <hr>
      <p><strong>Kích cỡ: </strong> ${currentOrder.size.size}</p>
      <p><strong>Đường Kính</strong> ${currentOrder.size.duongKinh}</p>
      <p><strong>Sườn nướng: </strong> ${currentOrder.size.soLuongSuon}</p>
      <p><strong>Salad :</strong> ${currentOrder.size.salad}</p>
      <p><strong>Nước Ngọt</strong> ${currentOrder.size.soLuongNuocNgot}</p>
      <hr>
      <p><strong>Loại Pizzza: </strong> ${currentOrder.pizza.tenMonAn}</p>
      <p><strong>Nguồn gốc Pizza: </strong> ${currentOrder.pizza.monAn}</p>
      <p><strong>Giới thiệu về Pizza: </strong> ${currentOrder.pizza.intro}</p>
      <hr>
      <p><strong>Voucher:</strong> ${currentOrder.voucher || "Không sử dụng"} ${voucherValid ? "(Hợp lệ)" : currentOrder.voucher ? "(Không hợp lệ)" : ""}</p>
      <p><strong>Tổng tiền:</strong> ${total.toLocaleString()} VND</p>
      ${discount ? `<p><strong>Giảm giá:</strong> ${discount}% (${discountAmount.toLocaleString()} VND)</p>` : ''}
      <h4><strong>Thành tiền:</strong> ${finalAmount.toLocaleString()} VND</h4>
    `;

    vDivcontainerOrder.style.display = "block";

    // Cuộn đến vùng hiển thị
    vDivcontainerOrder.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById("input-name").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-phone").value = "";
    document.getElementById("input-address").value = "";
    document.getElementById("input-message").value = "";
    document.getElementById("input-voucher").value = "";

    // Reset nút chọn
    document.querySelectorAll('.btn-green, .btn-yellow').forEach(btn => {
        btn.className = "btn-green";
    });

    document.getElementById("div-container-order").style.display = "none";
    currentOrder = null;
}