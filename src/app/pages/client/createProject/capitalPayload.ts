interface CapitalFormData {
  businessType: string;
  // 기존 폼의 assetScale은 화면에서 '자본금'으로 사용한다. 단위는 억원이다.
  assetScale: string;
  capitalScale: string;
}

function parseCapital(value: string, label: string): number {
  if (!/^\d+$/.test(value)) throw new Error(`${label}을 숫자로 입력해주세요.`);
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount > 9_999_999_999_999) {
    throw new Error(`${label}은 9,999,999,999,999억원 이하로 입력해주세요.`);
  }
  return amount;
}

export function buildCapitalPayload(data: CapitalFormData) {
  return {
    capital: parseCapital(data.assetScale, "자본금"),
    capitalScale: data.businessType === "startup"
      ? null
      : parseCapital(data.capitalScale, "자본 규모"),
  };
}
