import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAdminReview, parseReviewUserId } from '../src/api/admin/adminReview.ts';
const detail = { userId: 42, expertProfileId: 7, email: 'review@example.com', verificationStatus: 'PENDING' };
const certs = [{ certificateId: 3, fileId: 12, ownerName: '실제 소유자' }, { certificateId: 4, fileId: 13 }];
const business = { businessRegistrationInfoId: 5, fileId: 14, companyName: '실제 회사' };
const ok = data => ({ success: true, data });
function sources(overrides = {}) {
  return {
    getExpertDetail: async id => { assert.equal(id, 42); return ok(detail); },
    getExpertCertificates: async id => { assert.equal(id, 42); return ok(certs); },
    getExpertBusinessInfo: async id => { assert.equal(id, 42); return ok(business); },
    ...overrides,
  };
}
test('세 조회 결과를 같은 사용자 기준으로 묶고 모든 자격증을 보존한다', async () => {
  assert.deepEqual(await loadAdminReview(42, sources()), { detail, certificates: certs, business });
});
test('잘못된 URL ID는 요청 전에 차단한다', async () => {
  for (const value of [undefined, '', '0', '-1', '1e2', '1.5', 'Infinity', '9007199254740992']) assert.equal(parseReviewUserId(value), null);
  assert.equal(parseReviewUserId('42'), 42);
  await assert.rejects(loadAdminReview(0, sources()));
});
test('URL 대상과 상세 응답의 사용자가 다르면 결과를 사용하지 않는다', async () => {
  await assert.rejects(loadAdminReview(42, sources({ getExpertDetail: async () => ok({ ...detail, userId: 43 }) })));
});
test('성공 HTTP여도 실패 envelope와 빈 응답은 거절한다', async () => {
  for (const response of [{ success: false, data: detail }, { data: detail }, ok(null)]) {
    await assert.rejects(loadAdminReview(42, sources({ getExpertDetail: async () => response })));
  }
});
test('사업자 정보 조회 실패나 누락을 정상으로 삼지 않는다', async () => {
  await assert.rejects(loadAdminReview(42, sources({ getExpertBusinessInfo: async () => { throw new Error('403'); } })));
  await assert.rejects(loadAdminReview(42, sources({ getExpertBusinessInfo: async () => ok(null) })));
});
test('자격증 응답 형식, 중복 및 파일 식별자를 검증한다', async () => {
  for (const data of [null, {}, [certs[0], certs[0]], [{ certificateId: 3, fileId: null }]]) {
    await assert.rejects(loadAdminReview(42, sources({ getExpertCertificates: async () => ok(data) })));
  }
});
test('서류가 없으면 빈 목록을 유지하고 샘플 서류를 채우지 않는다', async () => {
  const result = await loadAdminReview(42, sources({ getExpertCertificates: async () => ok([]) }));
  assert.deepEqual(result.certificates, []);
});
test('알 수 없는 인증 상태는 심사 대상으로 사용하지 않는다', async () => {
  await assert.rejects(loadAdminReview(42, sources({ getExpertDetail: async () => ok({ ...detail, verificationStatus: 'UNKNOWN' }) })));
});
