const { By, Key } = require("selenium-webdriver");
const WebDriverUtil = require("../utils/WebDriverUtil");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.webDriverUtil = new WebDriverUtil();
    this.webDriverUtil.driver = driver;

    this.phoneInput         = By.xpath("//div[@role='dialog']//input[@placeholder='Số điện thoại']");
    this.agreeTermsCheckbox = By.xpath("//div[@role='dialog']//label[contains(@class,'agree-terms')]//input[@type='checkbox']");
    this.continueButton     = By.xpath("//div[@role='dialog']//button[contains(normalize-space(),'Tiếp Tục') or contains(normalize-space(),'Tiếp tục')]");
    this.passwordInput      = By.xpath("//div[@role='dialog']//input[@placeholder='Mật khẩu']");
    this.emailInput         = By.xpath("//div[@role='dialog']//input[@placeholder='acb@email.com']");
    this.loginButton        = By.xpath("//div[@role='dialog']//button[contains(normalize-space(),'Đăng nhập') or contains(normalize-space(),'Đăng Nhập')]");
    this.verifyButton       = By.xpath("//div[@role='dialog']//button[contains(normalize-space(),'Xác Minh') or contains(normalize-space(),'Xác minh')]");
    this.loginEmail         = By.xpath("//div[@role='dialog']//p[@class='login-with-email']");
    this.loginSMS           = By.xpath("//div[@role='dialog']//p[@class='login-with-sms']");
    this.errorMessage       = By.xpath("//div[@role='dialog']//span[@class='error-mess']");
    this.captchaIframe      = By.css("iframe#meili");

    this.otpInputDigits = [
      By.xpath("//input[@aria-label='Please enter verification code. Digit 1']"),
      By.xpath("//input[@aria-label='Digit 2']"),
      By.xpath("//input[@aria-label='Digit 3']"),
      By.xpath("//input[@aria-label='Digit 4']"),
      By.xpath("//input[@aria-label='Digit 5']"),
      By.xpath("//input[@aria-label='Digit 6']"),
    ];

    this.facebookIcon           = By.xpath("//li[@class='social__item'][.//img[@alt='facebook']]");
    this.facebookEmailInput     = By.xpath("//input[@name='email']");
    this.facebookPasswordInput  = By.xpath("//input[@name='pass']");
    this.facebookLoginButton    = By.xpath("//button[@name='login'] | //input[@type='submit'] | //button[@type='submit']");
    this.facebookContinueButton = By.xpath("//button[@name='__CONFIRM__']");
  }

  // Nhấn phần tử, fallback JS click nếu thất bại
  async _jsClick(locator) {
    const el = await this.webDriverUtil.waitForElement(locator);
    try { await el.click(); } catch (_) { await this.driver.executeScript("arguments[0].click();", el); }
    return el;
  }

  async acceptTermsIfNeeded() {
    try {
      const checkbox = await this.webDriverUtil.waitForElement(this.agreeTermsCheckbox, 3000);
      if (!(await checkbox.isSelected())) {
        const result = await this.driver.executeScript(`
          const cb = arguments[0];
          const k = Object.keys(cb).find(k => k.startsWith('__reactProps'));
          if (k && cb[k] && cb[k].onChange) {
            cb[k].onChange({ target: { checked: true }, preventDefault: ()=>{}, stopPropagation: ()=>{} });
            return 'react-onChange-called';
          }
          return 'no-react-props';
        `, checkbox);
        console.log('acceptTerms result:', result);
        await this.webDriverUtil.sleep(500);
      }
    } catch (_) {}
  }

  async enterPhoneNumber(phoneNumber) {
    await this.webDriverUtil.sendKeys(this.phoneInput, phoneNumber);
    await this.acceptTermsIfNeeded();
    const phoneEl = await this.webDriverUtil.waitForElement(this.phoneInput);

    try { await this.webDriverUtil.clickElement(this.continueButton); }
    catch (_) { await this._jsClick(this.continueButton); }

    const moved = await this.driver.wait(async () => {
      const pw  = await this.driver.findElements(this.passwordInput);
      const otp = await this.driver.findElements(this.otpInputDigits[0]);
      return pw.length > 0 || otp.length > 0;
    }, 5000).catch(() => false);

    if (!moved) {
      await phoneEl.sendKeys(Key.ENTER);
      try { await this._jsClick(this.continueButton); } catch (_) {}
    }
  }

  async enterFakePhoneNumber(fakeNumber) {
    await this.webDriverUtil.sendKeys(this.phoneInput, fakeNumber);
    await this.acceptTermsIfNeeded();
    await this._jsClick(this.continueButton);
  }

  async enterPassword(password) { await this.webDriverUtil.sendKeys(this.passwordInput, password); }
  async enterEmail(email)       { await this.webDriverUtil.sendKeys(this.emailInput, email); }

  async enterOtp(otp) {
    if (otp.length !== 6) throw new Error("OTP phải có 6 chữ số");
    for (let i = 0; i < 6; i++)
      await this.driver.findElement(this.otpInputDigits[i]).sendKeys(otp[i]);
    await this.clickVerifyButton();
  }

  // Trả về false nếu nhập thành công, true nếu ô OTP đã bị vô hiệu hóa
  async enterFakeOtp(fakeOtp) {
    if (fakeOtp.length !== 6) throw new Error("OTP phải có 6 chữ số");
    try {
      for (let i = 0; i < 6; i++)
        await this.driver.findElement(this.otpInputDigits[i]).sendKeys(fakeOtp[i]);
      await this.clickVerifyButton();
      await this.webDriverUtil.sleep(2000);
      return false;
    } catch (_) {
      return true;
    }
  }

  async clickLoginButton()  { await this.webDriverUtil.clickElement(this.loginButton); }
  async clickVerifyButton() { await this.webDriverUtil.clickElement(this.verifyButton); }
  async clickLoginEmail()   { await this.webDriverUtil.clickElement(this.loginEmail); }

  async clickLoginWithSMS() {
    await this._jsClick(this.loginSMS);
    await this.webDriverUtil.waitForElement(this.otpInputDigits[0], 15000);
  }

  async clickFacebookIcon() {
    await this.webDriverUtil.waitForElement(this.facebookIcon);
    await this.webDriverUtil.sleep(300);
    const el = await this.driver.findElement(this.facebookIcon);
    try { await el.click(); } catch (_) { await this.driver.executeScript("arguments[0].click();", el); }
    console.log('clickFacebookIcon result: real-click');
  }

  async enterFacebookCredentials(email, password) {
    await this.webDriverUtil.sendKeys(this.facebookEmailInput, email);
    await this.webDriverUtil.sendKeys(this.facebookPasswordInput, password);
  }

  async clickFacebookLoginButton()          { await this._jsClick(this.facebookLoginButton); }

  async confirmFacebookAccessIfNeeded(timeout = 10000) {
    try {
      const btn = await this.webDriverUtil.waitForElement(this.facebookContinueButton, timeout);
      if (await btn.isDisplayed()) await btn.click();
    } catch (_) {}
  }

  async checkPhoneNumberError() {
    const el = await this.webDriverUtil.waitForElement(this.errorMessage);
    return (await el.getText()) === "Số điện thoại không đúng định dạng.";
  }

  async checkOTPError() {
    const el = await this.webDriverUtil.waitForElement(this.errorMessage);
    return (await el.getText()) === "Mã xác thực không hợp lệ.";
  }

  async waitForCaptchaResolved(timeout = 120000) {
    if ((await this.driver.findElements(this.captchaIframe)).length === 0) return true;
    await this.driver.wait(async () =>
      (await this.driver.findElements(this.captchaIframe)).length === 0
    , timeout).catch(() => { throw new Error("Captcha chưa được xác minh."); });
    return true;
  }

  // Trả về 'password', 'otp' hoặc 'unknown'
  async detectLoginStep(timeout = 15000) {
    return this.driver.wait(async () => {
      if ((await this.driver.findElements(this.passwordInput)).length > 0) return 'password';
      if ((await this.driver.findElements(this.otpInputDigits[0])).length > 0) return 'otp';
      return false;
    }, timeout).catch(() => 'unknown');
  }
}

module.exports = LoginPage;