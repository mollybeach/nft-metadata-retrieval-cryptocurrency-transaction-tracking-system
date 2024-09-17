## Exam Question: Building an Authentication Page

**Task:**

You are tasked with creating a simple authentication page for a web application. The backend functionality for registering and logging in users has already been developed and is accessible through APIs. You need to build the front-end page that allows users to register and log in, and integrate it with the backend APIs.

**Requirements:**

**Front-End:**

- **Login Page:**
  - Input fields for email and password.
  - Login button.
  - Option to navigate to the registration page.
- **Registration Page:**
  - Input fields for email, and password.
  - Register button.
  - Option to navigate to the login page.
- **Error Handling:**
  - Display appropriate error messages if login/registration fails (e.g., incorrect email/password, user already exists).
  - Validate input fields (e.g., password strength, email format).
- **User Experience:**
  - The page should be user-friendly and intuitive.
  - Use clear and concise language for labels and buttons.
  - Consider the visual appeal and layout of the page.

**Back-End Integration:**

- **API Calls:**
  - Use appropriate HTTP methods (POST for registration, POST for login) to interact with the backend APIs.
  - Send user data (username, email, password) to the relevant API endpoints.
  - Handle API responses (success or error messages).
- **Authentication:**
  - Upon successful login, store authentication tokens (e.g., JWT) in local storage or session storage.
  - Use these tokens for subsequent API requests.

**Grading Rubric:**

- **Functionality (50%):**
  - Login and registration features work correctly.
  - API calls are implemented correctly.
  - Error handling is implemented appropriately.
- **User Interface (25%):**
  - Page is visually appealing and user-friendly.
  - Clear and concise labels and buttons.
  - Good layout and structure.
- **Code Quality (25%):**
  - Clean and well-structured code.
  - Use of appropriate variables and functions.
  - Comments and documentation.

**Bonus:**

- **Security:** Implement best practices for security, including input validation, secure password storage, and proper use of tokens.
- **Accessibility:** Ensure the page is accessible to users with disabilities.

**Note:** This question is open-ended and allows for different approaches and implementations.
Don't focus on UI effects. The focus is on understanding the core concepts of authentication, API integration, and front-end development.
