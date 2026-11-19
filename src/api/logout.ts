// Keep logout independent of the normal 401 interceptor: even on failure,
// the caller must clear the local session and return home, not to /login.
export async function requestLogout(accessToken: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: 'include',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Server logout failed');
    const body = await response.json();
    if (body.success !== true) throw new Error('Server logout failed');
  } finally {
    clearTimeout(timeout);
  }
}
