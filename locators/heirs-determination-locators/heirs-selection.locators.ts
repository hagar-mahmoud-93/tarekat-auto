import { Page } from '@playwright/test';

export class HeirsSelectionLocators {
  constructor(private readonly page: Page) {}

  /** All نعم/لا radios on the page; لا is always the second (value="0") of each pair. */
  noRadios() {
    return this.page.locator('input[type="radio"][value="0"]');
  }

  /** All عدد.../كم عدد... count inputs (PrimeVue InputNumber) on the page. */
  numberInputs() {
    return this.page.locator('input.p-inputnumber-input');
  }

  /** عدد الأبناء الذكور على قيد الحياة input, scoped to its own field wrapper (label text is unique). */
  livingSonsCountInput() {
    return this.page
      .locator('div.relative.w-full.flex.flex-col.mt-4')
      .filter({ hasText: 'عدد الأبناء الذكور' })
      .locator('input.p-inputnumber-input');
  }

  /** Recomputes عدد الورثة المحتسب from the entered answers; relabels to "...من جديد" after the first click. */
  calculateHeirsCountButton() {
    return this.page.getByRole('button', { name: /^احسب عدد الورثة/ });
  }

  /** The عدد الورثة المحتسب result card (heading + per-relationship-type breakdown), shown after احسب عدد الورثة. */
  heirsCountResult() {
    return this.page.locator('div.p-4.bg-white.rounded-lg.shadow').filter({ hasText: 'عدد الورثة المحتسب' });
  }
}
