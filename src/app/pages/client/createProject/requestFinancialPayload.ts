// Company flow: capitalScale is the capital input; assetScale is total assets.
// Keep this separate from capitalPayload.ts, whose legacy fields mean the reverse.
export function normalizeFinancialInput(value: string): string {
  if (/^\d{1,3}(,\d{3})+(\.\d*)?$/.test(value)) return value.replace(/,/g, '');
  return value;
}

export function parseFinancialAmount(value: string): number | null {
  const normalized = normalizeFinancialInput(value);
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const hundredths = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(hundredths) && hundredths > 0
    && Number(whole) <= 9_999_999_999_999 ? hundredths / 100 : null;
}

export function buildRequestFinancialPayload(data: { capitalScale: string; assetScale: string }, businessStatus: string) {
  const capital = parseFinancialAmount(data.capitalScale);
  if (capital === null) throw new Error('자본금은 0보다 큰 금액을 소수점 둘째 자리까지 입력해 주세요.');
  const capitalScale = businessStatus === 'startup' ? null : parseFinancialAmount(data.assetScale);
  if (businessStatus !== 'startup' && capitalScale === null) {
    throw new Error('현재 총자산은 0보다 큰 금액을 소수점 둘째 자리까지 입력해 주세요.');
  }
  return { capital, capitalScale };
}
