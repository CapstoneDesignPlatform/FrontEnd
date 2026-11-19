import test from 'node:test';
import assert from 'node:assert/strict';
import { mapVerificationStatusDtoToVM } from '../src/api/expertVerificationMappers.ts';
import { saveVerificationAssets, VerificationSaveUncertainError } from '../src/api/verificationAssets.ts';
const map = request => mapVerificationStatusDtoToVM({ verification_request: request });
const certificate = { id: 5, existing: true, fileId: 10, licenseType: '행정사', licenseNumber: 'A1', holderName: '테스트', issueDate: '2025-01-01', expiryDate: '2028-01-01' };
const business = { id: 6, existing: true, fileId: 11, businessNumber: '1234567890', companyName: '회사', ownerName: '대표' };

test('명시적 인증 상태를 불리언보다 우선하고 반려 사유·서류 ID를 유지한다', () => {
  const result = map({ id: 1, status: false, verification_status: 'REJECTED', rejected_reason: '파일 교체', certificates: [{ id: 5, file_id: 10 }], business_registration_info: { id: 6, file_id: 11 } });
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.rejectedReason, '파일 교체');
  assert.equal(result.certificates[0].id, 5);
  assert.equal(result.certificates[0].existing, true);
  assert.equal(result.businessLicense.id, 6);
  assert.equal(result.certificates[0].expiryDate, '');
  for (const status of ['PENDING', 'APPROVED', 'NOT_APPLIED']) assert.equal(map({ status: false, verification_status: status }).status, status);
});
test('불명확한 기존 불리언 응답과 알 수 없는 상태를 대기로 꾸미지 않는다', () => {
  assert.throws(() => map({ id: 1, status: false }));
  assert.throws(() => map({ status: false, verification_status: 'UNKNOWN' }));
  assert.equal(map({ status: false, id: null }).status, 'NOT_APPLIED');
  assert.equal(map({ status: true }).status, 'APPROVED');
  assert.equal(map({ status: 'NOT_SUBMITTED' }).status, 'NOT_APPLIED');
});
test('기존 자격증과 사업자 정보는 원래 ID로 PATCH하고 기존 파일을 재사용한다', async () => {
  const calls = [], progress = [];
  const client = { post: async () => assert.fail('POST 불필요'), patch: async (path, { body }) => { calls.push([path, body.file_id]); return { id: path.endsWith('/5') ? 5 : 6 }; } };
  await saveVerificationAssets(client, { certificates: [certificate], businessLicense: business, onProgress: event => progress.push(event) });
  assert.deepEqual(calls, [['/expert/me/certificates/5', 10], ['/expert/me/business-registration-info/6', 11]]);
  assert.equal(progress.at(-1).id, 6);
});
test('파일 교체는 업로드 후 동일 자격증 PATCH, 새 자격증만 POST한다', async () => {
  const calls = [];
  const client = { post: async (path, options) => { calls.push(path); return path === '/files' ? { file: { id: 20 } } : { id: 8 }; }, patch: async (path, { body }) => { calls.push(path); assert.equal(body.file_id, 20); return { id: 5 }; } };
  await saveVerificationAssets(client, { certificates: [{ ...certificate, file: new File(['file'], 'test.pdf') }, { ...certificate, id: undefined, existing: false }] });
  assert.deepEqual(calls, ['/files', '/expert/me/certificates/5', '/expert/me/certificates']);
});
test('기존 서류 ID가 없으면 업로드나 등록을 시작하지 않는다', async () => {
  const client = { post: async () => assert.fail(), patch: async () => assert.fail() };
  await assert.rejects(saveVerificationAssets(client, { certificates: [{ ...certificate, id: undefined }] }), /ID/);
});
test('일부 성공한 저장 ID는 보존하고 이후 저장 실패 시 순서를 중단한다', async () => {
  const events = [];
  const client = { post: async () => ({ id: 8 }), patch: async () => { throw new Error('network'); } };
  await assert.rejects(saveVerificationAssets(client, { certificates: [{ ...certificate, id: undefined, existing: false }], businessLicense: business, onProgress: event => events.push(event) }), VerificationSaveUncertainError);
  assert.ok(events.some(event => event.kind === 'certificate' && event.id === 8));
});
