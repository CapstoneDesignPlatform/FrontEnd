import test from 'node:test';
import assert from 'node:assert/strict';
import { mapVerificationStatusDtoToVM } from '../src/api/expertVerificationMappers.ts';

const map = (request) => mapVerificationStatusDtoToVM({ verification_request: request }).status;

test('verification_status 값을 그대로 사용한다', () => {
  assert.equal(map({ id: null, status: false, verification_status: 'NOT_APPLIED' }), 'NOT_APPLIED');
  assert.equal(map({ id: 1, status: false, verification_status: 'PENDING' }), 'PENDING');
  assert.equal(map({ id: 1, status: true, verification_status: 'APPROVED' }), 'APPROVED');
  assert.equal(map({ id: 1, status: false, verification_status: 'NOT_SUBMITTED' }), 'NOT_APPLIED');
});

test('반려는 status=false, id가 있어도 PENDING이 아닌 REJECTED로 판단한다', () => {
  const vm = mapVerificationStatusDtoToVM({ verification_request: {
    id: 1, status: false, verification_status: 'REJECTED',
    rejected_reason: '사업자등록증 식별 불가', reviewed_at: '2026-11-10T13:00:00',
  } });
  assert.equal(vm.status, 'REJECTED');
  assert.equal(vm.rejectedReason, '사업자등록증 식별 불가');
  assert.equal(vm.reviewedAt, '2026-11-10T13:00:00');
});

test('verification_status가 없거나 모르는 값이면 기존 추론을 사용한다', () => {
  assert.equal(map({ id: 1, status: true }), 'APPROVED');
  assert.equal(map({ id: 1, status: false }), 'PENDING');
  assert.equal(map({ id: null, status: false }), 'NOT_APPLIED');
  assert.equal(map({ id: 1, status: false, verification_status: 'UNKNOWN' }), 'PENDING');
  assert.equal(map({ id: 1, status: false, verification_status: null }), 'PENDING');
});
