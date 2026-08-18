import { Locator } from '@playwright/test';

/** 1x1 transparent PNG, used to satisfy the pdf/jpg/jpeg/png/bmp attachment requirement. */
const PLACEHOLDER_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

/** Sets the given file input to a placeholder PNG, for screens that only check an attachment exists. */
export async function uploadPlaceholderFile(fileInput: Locator, fileName: string): Promise<void> {
  await fileInput.setInputFiles({ name: fileName, mimeType: 'image/png', buffer: Buffer.from(PLACEHOLDER_PNG_BASE64, 'base64') });
}
