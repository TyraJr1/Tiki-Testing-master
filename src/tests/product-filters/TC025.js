const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const config = require("../../../config/config");

const CATEGORY_URL = "https://tiki.vn/nha-sach-tiki/c8322";
const SCREENSHOT_PATH = path.join(
  __dirname,
  "../../../evidence/screenshots/TC025.png"
);

async function saveScreenshot(driver) {
  fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });
  fs.writeFileSync(SCREENSHOT_PATH, await driver.takeScreenshot(), "base64");
}

async function TC025() {
  const webDriverUtil = new WebDriverUtil();
  let driver;

  try {
    driver = await webDriverUtil.initDriver();
    await driver.manage().window().maximize();

    await driver.get(CATEGORY_URL);
    await driver.wait(until.urlContains("nha-sach-tiki"), config.timeout);

    try {
      const popup = await driver.wait(
        until.elementLocated(By.css('[data-view-id="popup-manager.close"]')),
        5000
      );
      await popup.click();
    } catch {}

    await driver.executeScript("window.scrollBy(0, 500);");

    const openFilterButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[2]/div/div[1]/div[2]/button'
        )
      ),
      config.timeout
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      openFilterButton
    );
    await driver.executeScript("arguments[0].click();", openFilterButton);

    const minPriceInput = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[5]/div[3]/div[1]/input'
        )
      ),
      config.timeout
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      minPriceInput
    );

    await minPriceInput.clear();
    await minPriceInput.sendKeys("2");

    const actualValue = await minPriceInput.getAttribute("value");
    const normalizedValue = actualValue.replace(/\D/g, "");

    await saveScreenshot(driver);

    assert.strictEqual(
      normalizedValue,
      "2",
      `TC025 FAIL: Ô giá tối thiểu không xử lý đúng giá trị 2. Actual = "${actualValue}"`
    );

    console.log("TC025 PASS: Hệ thống chấp nhận giá tối thiểu bằng 2.");
    console.log(`Evidence: ${SCREENSHOT_PATH}`);
  } catch (error) {
    if (driver) await saveScreenshot(driver);
    console.error("Lỗi trong TC025:", error.stack);
    process.exitCode = 1;
  } finally {
    await webDriverUtil.quit();
  }
}

TC025();