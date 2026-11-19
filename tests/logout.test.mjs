import test from 'node:test';
import assert from 'node:assert/strict';
import { requestLogout } from '../src/api/logout.ts';

test('로그아웃은 기존 API에 현재 토큰을 보내고 성공 응답을 확인한다', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/auth/logout');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.credentials, 'include');
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ success: true });
  });
  await requestLogout('test-token');
});

test('서버 실패·인증 실패·네트워크 실패를 성공으로 처리하지 않는다', async (t) => {
  for (const response of [Response.json({ success: false }), new Response(null, { status: 401 }), new Response(null, { status: 500 })]) {
    const mock = t.mock.method(globalThis, 'fetch', async () => response);
    await assert.rejects(requestLogout('test-token'));
    mock.mock.restore();
  }
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Network failure'); });
  await assert.rejects(requestLogout('test-token'));
});

test('로그아웃 응답이 없으면 5초 후 요청을 중단한다', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(globalThis, 'fetch', async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
  }));
  const result = assert.rejects(requestLogout('test-token'), /aborted/);
  t.mock.timers.tick(5000);
  await result;
});
