const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");
const LoginPage = require("../../../pages/LoginPage");

const SCREENSHOT_PATH = path.join(
  process.cwd(),
  "evidence",
  "screenshots",
  "TC02.png"
);

async function saveScreenshot(driver) {
  fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });

  const image = await driver.takeScreenshot();
  fs.writeFileSync(SCREENSHOT_PATH, image, "base64");

  console.log(`Evidence: ${SCREENSHOT_PATH}`);
}

// Kiểm tra form đăng nhập bằng email hiển thị
async function TC002() {
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
    await driver.wait(until.urlContains("tiki.vn"), 15000);
    console.log("TC002 - Trang chủ Tiki load thành công.");

    // Bước 2: Nhấn biểu tượng Tài khoản
    await homePage.clickAccountIcon();
    console.log("TC002 - Đã bấm nút Tài khoản.");

    // Bước 3: Nhấn nút Đăng nhập bằng email
    await loginPage.clickLoginEmail();
    console.log("TC002 - Đã chọn đăng nhập bằng email.");

    // Bước 4: Kiểm tra form email có hiển thị ô nhập liệu
    await driver.sleep(1000);

    const passwordInput = await driver.wait(
      until.elementLocated(
        By.xpath("//input[@type='password' or contains(@placeholder,'Mật khẩu')]")
      ),
      15000
    );

    const inputs = await driver.findElements(By.xpath("//input"));
    let visibleInputCount = 0;

    for (let input of inputs) {
      if (await input.isDisplayed()) {
        visibleInputCount++;
      }
    }

    const isPasswordDisplayed = await passwordInput.isDisplayed();

    // Chụp 1 ảnh minh chứng
    await saveScreenshot(driver);

    assert(
      visibleInputCount >= 2 && isPasswordDisplayed,
      "TC002 FAIL: Form đăng nhập bằng email không hiển thị đủ ô nhập liệu."
    );

    console.log("TC002 PASS: Form đăng nhập bằng email hiển thị đúng.");
  } catch (error) {
    console.error("TC002 FAIL:", error.message);

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
TC002();