# Tiki-Testing
This project is designed to automate testing for the Tiki application using Selenium WebDriver. The tests are organized by features (like products and users), and you can run them via the npm test script.

The setup allows you to execute browser-based automated tests for validating features like login, product details, and more.

## Project Structure
![image](https://github.com/user-attachments/assets/856757fd-5a24-4d61-adaf-617908b96438)



## Dependencies
Selenium WebDriver: For automating browser interactions.
Chromedriver: WebDriver for Chrome, required for running tests on Chrome.

Getting Started
1. Install Dependencies
Before running the tests, you need to install the required dependencies: npm install

This will install the necessary dependencies, including selenium-webdriver and chromedriver.

2. Create Test Scripts
The Selenium tests are located in the src/tests folder, organized by feature.

users/: Contains tests for user-related functionalities (e.g., login, registration).

products/: Contains tests for product-related functionalities (e.g., product page, details).

index.test.js: The main entry point that runs the tests in the feature-specific folders.

3. Running Tests
You can run the Selenium tests by executing the following command: npm test
This will run the tests defined in index.test.js. The script will initialize a Chrome WebDriver session and run the defined browser actions.


## Folder Descriptions
src/data/: Contains any mock data or test-specific data files. For example, user credentials or product information.

src/tests/products/: Contains Selenium tests for product-related features. Examples:

productPage.test.js: Tests for the product details page.

src/tests/users/: Contains Selenium tests for user-related features. Examples:

login.test.js: Tests for logging into the application.

src/utils/: Contains utility functions that may be shared across multiple test cases, such as helper functions for waiting for elements, taking screenshots, etc.

