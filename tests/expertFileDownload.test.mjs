import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchExpertFile } from '../src/api/expertFileDownload.ts';
const signal = () => new AbortController().signal;
const metadata = (file = {}) => Response.json({ success: true, data: { file: { id: 7, original_name: '자격증.pdf', download_url: 'http://localhost:8081/api/files/7/download', ...file } } });

test('원본 파일명으로 다운로드하고 반환된 localhost URL 대신 설정된 API와 토큰을 사용한다', async t => {
  const urls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    urls.push(url);
    assert.equal(options.headers.Authorization, 'Bearer token');
    assert.equal(options.credentials, 'include');
    assert.equal(options.redirect, 'error');
    return urls.length === 1 ? metadata() : new Response('pdf-data', { headers: { 'Content-Type': 'application/pdf' } });
  });
  const result = await fetchExpertFile(7, 'token', signal(), '/backend/api');
  assert.deepEqual(urls, ['/backend/api/files/7/download-url', '/backend/api/files/7/download']);
  assert.equal(result.filename, '자격증.pdf');
  assert.equal(await result.blob.text(), 'pdf-data');
});

test('유효하지 않은 ID와 로그인 없음은 네트워크 요청 전에 차단한다', async t => {
  t.mock.method(globalThis, 'fetch', () => { assert.fail('요청하면 안 됨'); });
  for (const id of [0, -1, NaN, 1.5]) await assert.rejects(fetchExpertFile(id, 'token', signal()));
  await assert.rejects(fetchExpertFile(7, undefined, signal()), /로그인/);
});

test('권한 오류·파일 없음·서버 오류를 파일로 저장하지 않는다', async t => {
  for (const status of [401, 403, 404, 500]) {
    let calls = 0;
    const mock = t.mock.method(globalThis, 'fetch', async () => ++calls === 1 ? metadata() : new Response(null, { status }));
    await assert.rejects(fetchExpertFile(7, 'token', signal()));
    mock.mock.restore();
  }
});

test('성공 HTTP여도 JSON·HTML·빈 파일·다른 파일 메타데이터는 거부한다', async t => {
  for (const response of [Response.json({ success: false }), new Response('<html>error</html>', { headers: { 'Content-Type': 'text/html' } }), new Response(null)]) {
    let calls = 0;
    const mock = t.mock.method(globalThis, 'fetch', async () => ++calls === 1 ? metadata() : response);
    await assert.rejects(fetchExpertFile(7, 'token', signal()));
    mock.mock.restore();
  }
  t.mock.method(globalThis, 'fetch', async () => metadata({ id: 8 }));
  await assert.rejects(fetchExpertFile(7, 'token', signal()), /파일 정보/);
});

test('경로 문자는 파일명에서 제거하고 요청 취소를 전달한다', async t => {
  const controller = new AbortController();
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    assert.equal(options.signal, controller.signal);
    return ++calls === 1 ? metadata({ original_name: '../서류.pdf' }) : new Response('pdf', { headers: { 'Content-Type': 'application/pdf' } });
  });
  const result = await fetchExpertFile(7, 'token', controller.signal);
  assert.equal(result.filename, '_서류.pdf');
});
