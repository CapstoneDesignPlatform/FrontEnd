import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCapitalPayload } from '../src/app/pages/client/createProject/capitalPayload.ts';

test('자본금 2억, 자본 규모 10억을 뒤바꾸거나 원으로 환산하지 않는다', () => {
  for (const businessType of ['corporation', 'individual']) {
    assert.deepEqual(buildCapitalPayload({businessType, assetScale: '2', capitalScale: '10'}), {capital: 2, capitalScale: 10});
  }
});
test('창업 예정의 자본금은 보존하고 이전 자본 규모는 전송하지 않는다', () => {
  for (const capitalScale of ['', '10']) {
    assert.deepEqual(buildCapitalPayload({businessType: 'startup', assetScale: '2', capitalScale}), {capital: 2, capitalScale: null});
  }
});
test('법인·개인은 빈 자본 규모를 0으로 바꾸지 않고 입력을 요구한다', () => {
  for (const businessType of ['corporation', 'individual']) assert.throws(() => buildCapitalPayload({businessType, assetScale: '2', capitalScale: ''}), /자본 규모/);
});
test('비어 있거나 잘못된 자본금을 0으로 바꾸지 않는다', () => {
  for (const assetScale of ['', ' ', 'abc', '-2', 'Infinity', '10000000000000']) {
    assert.throws(() => buildCapitalPayload({businessType: 'startup', assetScale, capitalScale: ''}), /자본금/);
  }
});
test('명시적으로 입력한 0과 정상 범위의 숫자는 보존한다', () => {
  assert.deepEqual(buildCapitalPayload({businessType:'corporation', assetScale:'0', capitalScale:'0'}), {capital:0, capitalScale:0});
  assert.deepEqual(buildCapitalPayload({businessType:'corporation', assetScale:'0012', capitalScale:'9999999999999'}), {capital:12, capitalScale:9999999999999});
});
