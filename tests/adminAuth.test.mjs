import test from 'node:test';
import assert from 'node:assert/strict';
import { loginAdmin, verifyAdminSession } from '../src/api/adminAuth.ts';
const ok = data => Response.json({ success: true, data });
const tokens = { role: 'ADMIN', accessToken: 'access-test', refreshToken: 'refresh-test' };

test('이메일로 공통 로그인 후 발급 토큰으로 서버의 관리자 역할을 확인한다', async t => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    urls.push(url);
    if (url.endsWith('/auth/login')) {
      assert.deepEqual(JSON.parse(options.body), { email: 'admin@example.test', password: 'input-password' });
      assert.equal(options.headers.Authorization, undefined);
      return ok(tokens);
    }
    assert.equal(options.headers.Authorization, 'Bearer access-test');
    return ok({ userType: 'ADMIN', name: '테스트 관리자' });
  });
  const result = await loginAdmin(' admin@example.test ', 'input-password', new AbortController().signal);
  assert.equal(result.name, '테스트 관리자');
  assert.deepEqual(urls, ['/api/auth/login', '/api/users/myInfo']);
});

test('의뢰인·전문가와 토큰 누락 응답은 관리자 로그인으로 처리하지 않는다', async t => {
  for (const data of [{ ...tokens, role: 'CLIENT' }, { ...tokens, role: 'EXPERT' }, { ...tokens, accessToken: '' }, { ...tokens, refreshToken: undefined }]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => ok(data));
    await assert.rejects(loginAdmin('x@example.test', 'pw', new AbortController().signal));
    mock.mock.restore();
  }
});

test('로그인 역할이 ADMIN이어도 서버 내 정보가 다르면 관리자 진입을 거절한다', async t => {
  t.mock.method(globalThis, 'fetch', async url => url.endsWith('/auth/login') ? ok(tokens) : ok({ userType: 'CLIENT' }));
  await assert.rejects(loginAdmin('x@example.test', 'pw', new AbortController().signal), error => error.status === 403);
});

test('인증 실패·권한 없음·서버 오류를 구분하고 잘못된 성공 응답도 거절한다', async t => {
  for (const status of [401, 403, 500, 429]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status }));
    await assert.rejects(verifyAdminSession('token', new AbortController().signal), error => error.status === status);
    mock.mock.restore();
  }
  t.mock.method(globalThis, 'fetch', async () => Response.json({ success: false }));
  await assert.rejects(verifyAdminSession('token', new AbortController().signal));
});
