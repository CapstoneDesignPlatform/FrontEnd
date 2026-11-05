export function isPublicAuthRequest(url = '') {
  return /(?:^|\/)auth\/(login|signup)(?:[?#]|$)/.test(url);
}

export function shouldExpireSession(url: string, sentAuthorization: unknown, currentToken: string | null | undefined) {
  return !isPublicAuthRequest(url) && !!currentToken && sentAuthorization === `Bearer ${currentToken}`;
}

export function getRoleNextPath(path: string | null, role: 'client' | 'expert') {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null;
  const pathname = path.split(/[?#]/)[0];
  const forbidden = role === 'client' ? '/expert' : '/client';
  if (pathname === forbidden || pathname.startsWith(`${forbidden}/`) || /^\/admin(?:\/|$)/.test(pathname)) return null;
  return path;
}
