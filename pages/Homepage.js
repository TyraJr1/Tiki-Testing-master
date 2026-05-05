const { By, until } = require('selenium-webdriver');
const WebDriverUtil = require('../utils/WebDriverUtil');

class HomePage {
    constructor(driver) {
        this.driver = driver;
        this.webDriverUtil = new WebDriverUtil();
        this.webDriverUtil.driver = driver;
        // Định nghĩa các locator
        this.accountIcon = By.xpath("//span[contains(text(), 'Tài khoản')]");
        this.usernameLabel = By.xpath("//span[contains(text(), 'Tên người dùng')]");
        this.accountMenuItem = By.xpath("//p[@title='Thông tin tài khoản']");
        this.globalPopupClose = By.css('[data-view-id="popup-manager.close"]');
    }

    // Truy cập trang chủ
    async open() {
        await this.webDriverUtil.navigateTo('https://tiki.vn');
    }

    // Nhấp biểu tượng "Tài khoản"
    async clickAccountIcon() {
        await this.dismissGlobalPopupIfPresent();
        try {
            await this.webDriverUtil.clickElement(this.accountIcon);
        } catch (error) {
            const accountElement = await this.webDriverUtil.waitForElement(this.accountIcon, 5000);
            await this.driver.executeScript('arguments[0].click();', accountElement);
        }
    }

    async dismissGlobalPopupIfPresent() {
        try {
            const closeButton = await this.webDriverUtil.waitForElement(this.globalPopupClose, 3000);
            await this.driver.executeScript('arguments[0].click();', closeButton);
            await this.webDriverUtil.sleep(500);
        } catch (error) {
            // Global popup may not always appear.
        }
    }

    // Kiểm tra đăng nhập thành công
    async verifyLoginSuccess() {
        // Nhấp lại biểu tượng "Tài khoản" để kiểm tra dropdown
        await this.clickAccountIcon();

        // Chờ và nhấp vào mục "Thông tin tài khoản" trong dropdown
        const menuItem = await this.webDriverUtil.waitForElement(this.accountMenuItem);
        try {
            await menuItem.click();
        } catch (_) {
            await this.driver.executeScript('arguments[0].click();', menuItem);
        }

        // Xác minh URL chuyển hướng đến trang thông tin tài khoản
        await this.driver.wait(
            until.urlContains('/customer/account/edit'),
            15000
        );
        const currentUrl = await this.driver.getCurrentUrl();
        return currentUrl.includes('/customer/account/edit');
    }
}

module.exports = HomePage;