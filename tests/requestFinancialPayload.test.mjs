import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRequestFinancialPayload, normalizeFinancialInput, parseFinancialAmount } from '../src/app/pages/client/createProject/requestFinancialPayload.ts';

test('회사 입력 화면의 자본금과 총자산을 억원 단위로 구분한다', () => {
  assert.deepEqual(buildRequestFinancialPayload({ capitalScale: '2.50', assetScale: '10.25' }, 'corporation'), { capital: 2.5, capitalScale: 10.25 });
});
test('창업 예정에서는 입력한 자본금을 유지하고 이전 총자산은 보내지 않는다', () => {
  assert.deepEqual(buildRequestFinancialPayload({ capitalScale: '1.25', assetScale: '100' }, 'startup'), { capital: 1.25, capitalScale: null });
});
test('잘못된 입력을 양수나 다른 금액으로 바꾸지 않는다', () => {
  for (const value of ['', '0', '-2', '1e3', '1.2.3', '1.234', '1,2', 'abc', 'Infinity', '99999999999999999']) {
    assert.equal(parseFinancialAmount(value), null, value);
    assert.equal(normalizeFinancialInput(value), value);
    assert.throws(() => buildRequestFinancialPayload({ capitalScale: value, assetScale: '10' }, 'corporation'));
  }
});
test('정상 천단위 쉼표와 소수 둘째 자리만 허용한다', () => {
  assert.equal(parseFinancialAmount('1,234.56'), 1234.56);
  assert.equal(parseFinancialAmount('0.01'), 0.01);
  assert.throws(() => buildRequestFinancialPayload({ capitalScale: '2', assetScale: '-10' }, 'individual'));
});
