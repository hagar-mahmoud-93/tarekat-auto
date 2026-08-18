import { Page } from '@playwright/test';

export class LoginLocators {
  constructor(private readonly page: Page) {}

  nafathLoginLink() {
    return this.page.getByText('الدخول عن طريق نفاذ');
  }

  usernameInput() {
    return this.page.getByLabel('اسم المستخدم');
  }

  passwordInput() {
    return this.page.getByLabel('كلمة المرور');
  }

  submitButton() {
    return this.page.getByRole('button', { name: /دخول|تسجيل الدخول/ });
  }
}
