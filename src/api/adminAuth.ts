export class AdminAuthError extends Error {
  status: number;
  constructor(message: string, status = 0) { super(message); this.status = status; }
}
async function readResponse(response: Response) {
  if (!response.ok) {
    if (response.status >= 500) throw new AdminAuthError('서버 오류로 로그인 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.', response.status);
    if (response.status === 429) throw new AdminAuthError('요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.', 429);
    if (response.status === 403) throw new AdminAuthError('관리자 권한이 필요합니다.', 403);
    throw new AdminAuthError('로그인 정보를 확인할 수 없습니다. 이메일과 비밀번호 또는 로그인 상태를 확인해 주세요.', response.status);
  }
  let body;
  try { body = await response.json(); } catch { throw new AdminAuthError('서버 로그인 응답을 확인할 수 없습니다.'); }
  if (body?.success !== true || !body.data) throw new AdminAuthError('서버 로그인 응답을 확인할 수 없습니다.');
  return body.data;
}
export async function verifyAdminSession(token: string, signal: AbortSignal, baseUrl = '/api'): Promise<{ name: string }> {
  const data = await readResponse(await fetch(`${baseUrl.replace(/\/$/, '')}/users/myInfo`, {
    headers: { Authorization: `Bearer ${token}` }, credentials: 'include', signal,
  }));
  if (data.userType !== 'ADMIN') throw new AdminAuthError('관리자 계정만 접속할 수 있습니다.', 403);
  return { name: typeof data.name === 'string' ? data.name : '관리자' };
}
export async function loginAdmin(email: string, password: string, signal: AbortSignal, baseUrl = '/api') {
  const data = await readResponse(await fetch(`${baseUrl.replace(/\/$/, '')}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', signal,
    body: JSON.stringify({ email: email.trim(), password }),
  }));
  if (data.role !== 'ADMIN') throw new AdminAuthError('관리자 계정만 접속할 수 있습니다.', 403);
  if (typeof data.accessToken !== 'string' || !data.accessToken.trim() || typeof data.refreshToken !== 'string' || !data.refreshToken.trim()) {
    throw new AdminAuthError('로그인 토큰을 확인할 수 없습니다.');
  }
  const user = await verifyAdminSession(data.accessToken, signal, baseUrl);
  return { accessToken: data.accessToken as string, refreshToken: data.refreshToken as string, name: user.name };
}
