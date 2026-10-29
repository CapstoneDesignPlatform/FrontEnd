import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublicAuthRequest, shouldExpireSession, getRoleNextPath } from '../src/api/authRequestPolicy.ts';
test('로그인 실패와 이전 토큰의 401은 새 세션을 삭제하지 않는다', () => {
  assert.equal(isPublicAuthRequest('auth/login'), true);
  assert.equal(shouldExpireSession('/auth/login', 'Bearer current', 'current'), false);
  assert.equal(shouldExpireSession('/users/myInfo', 'Bearer previous', 'current'), false);
  assert.equal(shouldExpireSession('/users/myInfo', 'Bearer current', 'current'), true);
  assert.equal(shouldExpireSession('/users/myInfo', undefined, null), false);
});
test('계정 역할과 맞지 않는 복귀 경로를 사용하지 않는다', () => {
  assert.equal(getRoleNextPath('/expert/dashboard', 'client'), null);
  assert.equal(getRoleNextPath('/client/company-info', 'expert'), null);
  assert.equal(getRoleNextPath('/client/company-info', 'client'), '/client/company-info');
  assert.equal(getRoleNextPath('//example.com', 'client'), null);
  assert.equal(getRoleNextPath('/admin/login', 'client'), null);
});
