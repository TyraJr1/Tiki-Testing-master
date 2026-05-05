const assert = require("assert");
const { until } = require("selenium-webdriver");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const HomePage = require("../../../pages/Homepage");

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

    assert(
      title.toLowerCase().includes("tiki"),
      `TC001 FAIL: Trang chủ Tiki không load đúng. Title = ${title}`
    );

    console.log("TC001 PASS: Trang chủ Tiki load thành công.");
  } catch (error) {
    console.error("TC001 FAIL:", error.message);
    process.exitCode = 1;
  } finally {
    if (driver) {
      await webDriverUtil.quit();
    }
  }
}

TC001();