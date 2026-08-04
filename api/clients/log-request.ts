import { APIRequestContext, APIResponse } from '@playwright/test';

const REDACTED = '***REDACTED***';
const SENSITIVE_HEADER_PATTERN = /cookie|authorization|token|secret/i;

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, SENSITIVE_HEADER_PATTERN.test(key) ? REDACTED : value]),
  );
}

function toCurl(method: string, url: string, headers: Record<string, string>, body?: unknown): string {
  const headerFlags = Object.entries(redactHeaders(headers))
    .map(([key, value]) => `-H '${key}: ${value}'`)
    .join(' ');
  const dataFlag = body !== undefined ? ` -d '${JSON.stringify(body)}'` : '';

  return `curl -X ${method} '${url}'${headerFlags ? ` ${headerFlags}` : ''}${dataFlag}`;
}

/** POSTs via the given request context, logging the equivalent curl command and the response status/body. */
export async function loggedPost(
  request: APIRequestContext,
  label: string,
  url: string,
  options: { data?: unknown; headers?: Record<string, string> },
): Promise<APIResponse> {
  console.log(`[${label}] Request:`, toCurl('POST', url, options.headers ?? {}, options.data));

  const response = await request.post(url, options);
  const body = await response.text();

  console.log(`[${label}] Response status:`, response.status());
  console.log(`[${label}] Response body:`, body);

  return response;
}
