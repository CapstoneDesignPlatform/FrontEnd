import test from 'node:test';
import assert from 'node:assert/strict';
import { requireClientInfoId, isMissingCompany } from '../src/api/companyInfoModel.ts';

test('회사명이 비어 있어도 기존 기업 정보 ID를 복원할 수 있다', () => {
  assert.equal(requireClientInfoId({ id: 42, companyName: null }), 42);
});
test('잘못된 저장 응답으로 undefined ID를 저장하거나 다음 단계로 이동하지 않는다', () => {
  for (const value of [null, {}, { id: '42' }, { id: 0 }, { id: -1 }, { id: 1.2 }]) assert.throws(() => requireClientInfoId(value));
});
test('권한·서버·알 수 없는 404 오류를 기업 정보 미등록으로 숨기지 않는다', () => {
  assert.equal(isMissingCompany(404, '기업 정보를 찾을 수 없습니다.'), true);
  assert.equal(isMissingCompany(403, '접근 권한이 없습니다.'), false);
  assert.equal(isMissingCompany(401, '인증이 필요합니다.'), false);
  assert.equal(isMissingCompany(500, '서버 오류'), false);
  assert.equal(isMissingCompany(404, 'Not found'), false);
});
