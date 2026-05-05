const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { By, until } = require("selenium-webdriver");

const WebDriverUtil = require("../../../utils/WebDriverUtil");
const config = require("../../../config/config");

const CATEGORY_URL = "https://tiki.vn/nha-sach-tiki/c8322";
const SCREENSHOT_PATH = path.join(
  __dirname,
  "../../../evidence/screenshots/TC024.png"
);

async function saveScreenshot(driver) {
  fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });
  fs.writeFileSync(SCREENSHOT_PATH, await driver.takeScreenshot(), "base64");
}

async function TC024() {
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

    const maxPriceInput = await driver.wait(
      until.elementLocated(
        By.xpath(
          '//*[@id="__next"]/div[2]/main/div/div/div[2]/div[2]/div[4]/div[3]/div[2]/div[2]/div[5]/div[3]/div[2]/input'
        )
      ),
      config.timeout
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView({block:'center'});",
      maxPriceInput
    );

    await maxPriceInput.clear();
    await maxPriceInput.sendKeys("100000");

   const actualValue = await maxPriceInput.getAttribute("value");
await saveScreenshot(driver);

const normalizedValue = actualValue.replace(/\D/g, "");

assert.strictEqual(
  normalizedValue,
  "100000",
  `TC024 FAIL: Ô giá tối đa không xử lý đúng giá trị 100000. Actual = "${actualValue}"`
);

console.log(
  `TC024 PASS: Hệ thống chấp nhận và định dạng giá tối đa thành ${actualValue}.`
);
console.log(`Evidence: ${SCREENSHOT_PATH}`);
  } catch (error) {
    if (driver) await saveScreenshot(driver);
    console.error("Lỗi trong TC024:", error.stack);
    process.exitCode = 1;
  } finally {
    await webDriverUtil.quit();
  }
}

TC024();