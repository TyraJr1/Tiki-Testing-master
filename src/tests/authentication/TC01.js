const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { until } = require("selenium-webdriver");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");

const SCREENSHOT_PATH = path.join(
  process.cwd(),
  "evidence",
  "screenshots",
  "TC01.png"
);

async function saveScreenshot(driver) {
  fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });

  const image = await driver.takeScreenshot();
  fs.writeFileSync(SCREENSHOT_PATH, image, "base64");

  console.log(`Evidence: ${SCREENSHOT_PATH}`);
}

async function TC001() {
  const webDriverUtil = new WebDriverUtil();
  let driver;

  try {
    driver = await webDriverUtil.initDriver();
    await driver.manage().window().maximize();

    const homePage = new HomePage(driver);

    // Mở trang chủ
    await homePage.open();
    await driver.wait(until.urlContains("tiki.vn"), 15000);

    const title = await driver.getTitle();

    await driver.sleep(1000);
    await saveScreenshot(driver);

    assert(
      title.toLowerCase().includes("tiki"),
      `TC001 FAIL: Trang chủ Tiki không load đúng. Title = ${title}`
    );

    console.log("TC001 PASS: Trang chủ Tiki load thành công.");
  } catch (error) {
    console.error("TC001 FAIL:", error.message);

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

TC001();