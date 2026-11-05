import test from 'node:test';
import assert from 'node:assert/strict';
import { canCloseBidding, canSelectExpert, compareBidAmounts } from '../src/api/clientBidRules.ts';
const bid = { bid_id: 1, status: 'PENDING', bid_amount: 2500000 };
test('입찰이 있는 ACTIVE 2단계만 마감한다', () => {
  assert.equal(canCloseBidding({ status: 'ACTIVE', progress_step: 2 }, [bid]), true);
  assert.equal(canCloseBidding({ status: 'ACTIVE', progress_step: 2 }, []), false);
  for (const status of ['CANCELLED', 'CLOSED', 'UNKNOWN']) assert.equal(canCloseBidding({ status, progress_step: 2 }, [bid]), false);
  for (const progress_step of [undefined, 1, 3, 4, 7]) assert.equal(canCloseBidding({ status: 'ACTIVE', progress_step }, [bid]), false);
});
test('CLOSED 3단계에서 유효한 PENDING 입찰만 선정한다', () => {
  assert.equal(canSelectExpert({ status: 'CLOSED', progress_step: 3 }, bid), true);
  for (const status of ['ACTIVE', 'CANCELLED', 'UNKNOWN']) assert.equal(canSelectExpert({ status, progress_step: 3 }, bid), false);
  for (const status of ['SELECTED', 'REJECTED', 'UNKNOWN']) assert.equal(canSelectExpert({ status: 'CLOSED', progress_step: 3 }, { ...bid, status }), false);
  for (const bid_id of [undefined, 0, -1, 1.5]) assert.equal(canSelectExpert({ status: 'CLOSED', progress_step: 3 }, { ...bid, bid_id }), false);
  assert.equal(canSelectExpert({ status: 'CLOSED', progress_step: 4 }, bid), false);
});
test('누락된 금액은 최저가로 취급하지 않고 모든 입찰을 보존한다', () => {
  const bids = [{ bid_amount: null }, { bid_amount: 3000000 }, { bid_amount: 1000000 }, { bid_amount: 2000000 }];
  assert.deepEqual([...bids].sort(compareBidAmounts).map(bid => bid.bid_amount), [1000000, 2000000, 3000000, null]);
});

test('사전 마감 없이 후보를 고를 수 있지만 취소·완료·이미 선정된 의뢰는 제외한다', async () => {
  const { canChooseExpertCandidate } = await import('../src/api/clientBidRules.ts');
  assert.equal(canChooseExpertCandidate({ status: 'ACTIVE', progress_step: 2 }, bid), true);
  assert.equal(canChooseExpertCandidate({ status: 'CLOSED', progress_step: 3 }, bid), true);
  for (const project of [{ status: 'CANCELLED', progress_step: 2 }, { status: 'ACTIVE', progress_step: 1 }, { status: 'CLOSED', progress_step: 4 }, { status: 'CLOSED', progress_step: 7 }]) {
    assert.equal(canChooseExpertCandidate(project, bid), false);
  }
  assert.equal(canChooseExpertCandidate({ status: 'ACTIVE', progress_step: 2 }, { ...bid, status: 'REJECTED' }), false);
});
