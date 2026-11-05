export const MAX_BID_AMOUNT = 9_999_999_999_999;

export function parseBidAmount(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;

  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount <= MAX_BID_AMOUNT ? amount : null;
}

export function formatBidAmountInKorean(value: string): string {
  const amount = parseBidAmount(value);
  if (amount === null) return "";
  if (amount === 0) return "영 원";

  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const units = ["", "십", "백", "천"];
  const groups = ["", "만", "억", "조"];
  const parts: string[] = [];
  let remaining = amount;

  for (let groupIndex = 0; remaining > 0; groupIndex += 1) {
    let group = remaining % 10_000;
    let text = "";

    for (let digitIndex = 0; group > 0; digitIndex += 1) {
      const digit = group % 10;
      if (digit > 0) {
        const digitText = digit === 1 && digitIndex > 0 ? "" : digits[digit];
        text = `${digitText}${units[digitIndex]}${text}`;
      }
      group = Math.floor(group / 10);
    }

    if (text) parts.unshift(`${text}${groups[groupIndex]}`);
    remaining = Math.floor(remaining / 10_000);
  }

  return `${parts.join(" ")} 원`;
}
