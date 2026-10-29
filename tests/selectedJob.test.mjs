import test from 'node:test';
import assert from 'node:assert/strict';
import { requireSelectedJob, matchSelectedJob } from '../src/api/selectedJobModel.ts';
const job = { announcement_code: 'CODE', my_bid: { id: 42, status: 'SELECTED', bid_amount: 2500000, submitted_at: '2026-10-30T12:00:00' } };
const detail = { progress_step: 6, bids: [{ bid_id: 42, status: 'SELECTED', final_amount: 2700000 }] };
test('본인의 선정 입찰과 같은 코드일 때만 상세 조회를 진행한다', () => {
  assert.equal(requireSelectedJob(job, 'CODE').id, 42);
  for (const status of ['PENDING', 'REJECTED', 'UNKNOWN']) assert.throws(() => requireSelectedJob({ ...job, my_bid: { ...job.my_bid, status } }, 'CODE'));
  assert.throws(() => requireSelectedJob(job, 'OTHER'));
  assert.throws(() => requireSelectedJob({ ...job, my_bid: null }, 'CODE'));
});
test('실제 최종 금액과 진행 단계를 그대로 사용한다', () => {
  assert.deepEqual(matchSelectedJob(detail, 42), { finalAmount: 2700000, progressStep: 6 });
  assert.deepEqual(matchSelectedJob({ ...detail, progress_step: 7 }, 42), { finalAmount: 2700000, progressStep: 7 });
});
test('미제공 금액과 단계를 4단계나 임의 금액으로 채우지 않는다', () => {
  for (const progress_step of [undefined, null, 0, 8, 4.5]) {
    assert.deepEqual(matchSelectedJob({ progress_step, bids: [{ bid_id: 42, status: 'SELECTED', final_amount: null }] }, 42), { finalAmount: null, progressStep: null });
  }
});
test('다른 입찰의 선정 결과나 중복 선정 응답을 표시하지 않는다', () => {
  assert.throws(() => matchSelectedJob(detail, 99));
  assert.throws(() => matchSelectedJob({ ...detail, bids: [] }, 42));
  assert.throws(() => matchSelectedJob({ ...detail, bids: [...detail.bids, ...detail.bids] }, 42));
});
