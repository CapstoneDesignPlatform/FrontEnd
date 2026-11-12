import test from 'node:test';
import assert from 'node:assert/strict';
import { buildConstructionAnnouncementPayload } from '../src/app/pages/client/createProject/announcementPayload.ts';

const base = {
  businessStatus: 'corporation', hasExistingBusiness: true, registrationStatus: 'yes',
  constructionPurpose: 'construction-registration', registrationType: 'additional-business',
  targetBusinessLabel: '실내건축공사업', otherPurpose: '',
  financial: { capital: 1.5, capitalScale: 3 },
};
const enums = (p) => [p.industry, p.purpose, p.businessOwnerType];

test('백엔드 enum 값으로 변환한다', () => {
  assert.deepEqual(enums(buildConstructionAnnouncementPayload(base)), ['CONSTRUCTION', 'REQUIRED_LICENSE', 'CORPORATION']);
  assert.equal(buildConstructionAnnouncementPayload({ ...base, constructionPurpose: 'survey-response' }).purpose, 'STATUS_INVESTIGATION');
  assert.equal(buildConstructionAnnouncementPayload({ ...base, constructionPurpose: '', otherPurpose: '합병' }).purpose, 'ETC');
});

test('필요 면허: category·requiredLicense·currentIndustryStatus를 채우고 다른 탭 필드는 비운다', () => {
  const p = buildConstructionAnnouncementPayload(base);
  assert.equal(p.category, 'ADD');
  assert.equal(p.requiredLicense, '실내건축공사업');
  assert.equal(p.currentIndustryStatus, 'CONSTRUCTION_RELATED');
  assert.ok(p.currentIndustryDetail);
  assert.equal(p.heldLicense, null);
  assert.equal(p.diagnosisReason, null);
});

test('미등록·창업 예정은 신규 등록, 창업 예정은 자본규모와 현재 업종을 비운다', () => {
  const none = buildConstructionAnnouncementPayload({ ...base, registrationStatus: 'no', hasExistingBusiness: false, registrationType: '' });
  assert.equal(none.category, 'NEW');
  assert.equal(none.currentIndustryStatus, 'NONE');
  assert.equal(none.currentIndustryDetail, null);
  const startup = buildConstructionAnnouncementPayload({ ...base, businessStatus: 'startup', hasExistingBusiness: false, registrationStatus: 'no', constructionPurpose: '', registrationType: '', financial: { capital: 2, capitalScale: 5 } });
  assert.equal(startup.businessOwnerType, 'STARTUP');
  assert.equal(startup.capitalScale, null);
  assert.equal(startup.currentIndustryStatus, 'NONE');
});

test('등록 여부를 모르면 등록 구분을 반드시 선택해야 한다', () => {
  assert.throws(() => buildConstructionAnnouncementPayload({ ...base, registrationStatus: 'unsure', registrationType: '' }), /등록 구분/);
  const p = buildConstructionAnnouncementPayload({ ...base, registrationStatus: 'unsure', registrationType: 'new-registration' });
  assert.equal(p.category, 'NEW');
  assert.equal(p.currentIndustryStatus, 'NON_CONSTRUCTION_RELATED');
});

test('실태 조사: heldLicense만 채운다', () => {
  const p = buildConstructionAnnouncementPayload({ ...base, constructionPurpose: 'survey-response' });
  assert.equal(p.heldLicense, '실내건축공사업');
  assert.equal(p.category, null);
  assert.equal(p.requiredLicense, null);
  assert.equal(p.currentIndustryStatus, null);
  assert.equal(p.currentIndustryDetail, null);
});

test('기타: diagnosisReason=ETC와 상세 내용을 채운다', () => {
  const p = buildConstructionAnnouncementPayload({ ...base, constructionPurpose: 'survey-response', otherPurpose: ' 양수·양도 관련 진단 ' });
  assert.equal(p.purpose, 'ETC');
  assert.equal(p.diagnosisReason, 'ETC');
  assert.match(p.diagnosisReasonDetail, /^양수·양도 관련 진단 \(진단 대상 업종: 실내건축공사업\)$/);
  assert.equal(p.heldLicense, null);
  assert.equal(p.requiredLicense, null);
});

test('필수 값이 없으면 오류', () => {
  assert.throws(() => buildConstructionAnnouncementPayload({ ...base, targetBusinessLabel: '' }), /진단 대상 업종/);
  assert.throws(() => buildConstructionAnnouncementPayload({ ...base, financial: { capital: 1, capitalScale: null } }), /총자산/);
  assert.throws(() => buildConstructionAnnouncementPayload({ ...base, constructionPurpose: '' }), /진단 목적/);
});
