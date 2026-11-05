import assert from "node:assert/strict";
import test from "node:test";
import { formatBidAmountInKorean, parseBidAmount } from "../src/app/utils/bidAmount.ts";

test("한글 금액은 0의 개수와 만·억·조 단위를 구분한다", () => {
  const cases = [
    ["0", "영 원"],
    ["1", "일 원"],
    ["10", "십 원"],
    ["100", "백 원"],
    ["1000", "천 원"],
    ["10000", "일만 원"],
    ["100000", "십만 원"],
    ["1000000", "백만 원"],
    ["10000000", "천만 원"],
    ["100000000", "일억 원"],
    ["100010001", "일억 일만 일 원"],
    ["123456789", "일억 이천삼백사십오만 육천칠백팔십구 원"],
    ["1000000000000", "일조 원"],
    ["0000100000", "십만 원"],
    ["9999999999999", "구조 구천구백구십구억 구천구백구십구만 구천구백구십구 원"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(formatBidAmountInKorean(input), expected, input);
  }
});

test("잘못된 금액을 다른 금액으로 변환하지 않는다", () => {
  for (const input of ["", " ", "1.5", "-100", "1e6", "100,000", "100만원", "10000000000000"]) {
    assert.equal(parseBidAmount(input), null, input);
    assert.equal(formatBidAmountInKorean(input), "", input);
  }
  assert.equal(parseBidAmount("000100"), 100);
  assert.equal(parseBidAmount("9999999999999"), 9_999_999_999_999);
});
