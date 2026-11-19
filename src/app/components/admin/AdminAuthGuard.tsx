import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AdminAuthError, verifyAdminSession } from '../../../api/adminAuth';
import { clearAuthTokens, getStoredAccessToken } from '../../../api/authTokens';
import { Button } from '../ui/button';

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [token, setToken] = useState(getStoredAccessToken);
  const [checked, setChecked] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const sync = () => setToken(getStoredAccessToken());
    window.addEventListener('storage', sync);
    window.addEventListener('auth-session-changed', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('auth-session-changed', sync); };
  }, []);
  useEffect(() => {
    setChecked(null);
    setError('');
    if (!token) return;
    const controller = new AbortController();
    let mounted = true;
    const timeout = setTimeout(() => controller.abort(), 15000);
    verifyAdminSession(token, controller.signal, import.meta.env.VITE_API_BASE_URL ?? '/api').then(() => {
      if (mounted && !controller.signal.aborted && getStoredAccessToken() === token) setChecked(token);
    }).catch(reason => {
      if (!mounted || getStoredAccessToken() !== token) return;
      if (reason instanceof AdminAuthError && reason.status === 401) { clearAuthTokens(); return; }
      setError(reason instanceof AdminAuthError ? reason.message : '관리자 권한을 확인하지 못했습니다. 다시 시도해 주세요.');
    }).finally(() => clearTimeout(timeout));
    return () => { mounted = false; controller.abort(); clearTimeout(timeout); };
  }, [token, retry]);
  if (!token) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  if (error) return <div role="alert" className="rounded-xl border p-6 space-y-4"><p>{error}</p><Button onClick={() => setRetry(value => value + 1)}>다시 확인</Button><Button asChild variant="outline"><Link to="/admin/login">관리자 로그인</Link></Button></div>;
  if (checked !== token) return <p role="status" className="p-6">관리자 권한을 확인하는 중입니다.</p>;
  return <>{children}</>;
}
