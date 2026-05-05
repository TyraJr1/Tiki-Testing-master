const fs = require("fs");
const path = require("path");
const assert = require("assert");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");
const LoginPage = require("../../../pages/LoginPage");

const SCREENSHOT_PATH = path.join(
  process.cwd(),
  "evidence",
  "screenshots",
  "TC03.png"
);

async function saveScreenshot(driver) {
  fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });

  const image = await driver.takeScreenshot();
  fs.writeFileSync(SCREENSHOT_PATH, image, "base64");

  console.log(`Evidence: ${SCREENSHOT_PATH}`);
}

// Đăng nhập thất bại với số điện thoại sai định dạng
async function TC003() {
  const webDriverUtil = new WebDriverUtil();
  let driver;

  try {
    // Khởi tạo driver
    driver = await webDriverUtil.initDriver();
    await driver.manage().window().maximize();

    const homePage = new HomePage(driver);
    const loginPage = new LoginPage(driver);

    // Bước 1: Truy cập trang chủ Tiki
    await homePage.open();
    console.log("TC003 - Trang chủ Tiki load thành công.");

    // Bước 2: Nhấn biểu tượng Tài khoản
    await homePage.clickAccountIcon();
    console.log("TC003 - Popup đăng nhập hiển thị.");

    // Bước 3: Nhập số điện thoại sai định dạng
    await loginPage.enterFakePhoneNumber("0123");
    console.log("TC003 - Đã nhập số điện thoại sai định dạng.");

    // Bước 4: Kiểm tra thông báo lỗi
    const hasError = await loginPage.checkPhoneNumberError();

    // Chụp 1 ảnh minh chứng
    await saveScreenshot(driver);

    assert(
      hasError,
      "TC003 FAIL: Không hiển thị lỗi khi nhập số điện thoại sai định dạng."
    );

    console.log("TC004 PASS: Hệ thống hiển thị lỗi số điện thoại sai định dạng.");
  } catch (error) {
    console.error("TC003 FAIL:", error.message);

    if (driver) {
      await saveScreenshot(driver);
    }

    process.exitCode = 1;
  } finally {
    if (driver) {
      await webDriverUtil.quit();
    }
  }
}

// Chạy test
TC003();