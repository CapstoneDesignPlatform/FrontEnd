import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Building2, Lock } from 'lucide-react';
import Cookies from 'js-cookie';
import { loginAdmin } from '../../../api/adminAuth';
import { clearAuthTokens, getStoredAccessToken, persistAuthTokens } from '../../../api/authTokens';
import type { RootOutletContext } from '../../types/rootContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext<RootOutletContext>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const active = useRef<AbortController | null>(null);
  useEffect(() => () => { active.current?.abort(); active.current = null; }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (active.current) return;
    const controller = new AbortController();
    active.current = controller;
    const previousToken = getStoredAccessToken();
    setPending(true);
    setError('');
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const result = await loginAdmin(email, password, controller.signal, import.meta.env.VITE_API_BASE_URL ?? '/api');
      if (controller.signal.aborted || active.current !== controller) return;
      if (getStoredAccessToken() !== previousToken) throw new Error('다른 화면에서 로그인 상태가 변경되었습니다. 다시 시도해 주세요.');
      clearAuthTokens();
      persistAuthTokens(result);
      Cookies.set('USER_ROLE', 'ADMIN', { expires: 1 });
      setUser({ type: 'admin', name: result.name });
      setPassword('');
      navigate('/admin/projects', { replace: true });
    } catch (reason) {
      if (active.current === controller) setError(controller.signal.aborted
        ? '로그인 응답이 지연되고 있습니다. 다시 시도해 주세요.'
        : reason instanceof TypeError ? '서버에 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.'
        : reason instanceof Error ? reason.message : '로그인하지 못했습니다.');
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) { active.current = null; setPending(false); }
    }
  }
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8"><div className="flex items-center justify-center gap-2 mb-2"><Building2 className="h-8 w-8 text-blue-600" /><span className="text-2xl font-bold">진단매치</span></div><p className="text-sm text-gray-500">관리자 전용 접속</p></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <Lock className="h-6 w-6 text-blue-600 mx-auto mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label htmlFor="admin-email" className="block text-sm font-medium mb-1">이메일</label><input id="admin-email" type="email" autoComplete="username" required disabled={pending} value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="이메일을 입력하세요" className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label htmlFor="admin-password" className="block text-sm font-medium mb-1">비밀번호</label><input id="admin-password" type="password" autoComplete="current-password" required disabled={pending} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="비밀번호를 입력하세요" className="w-full px-3 py-2 border rounded-lg" /></div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={pending} className="w-full py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">{pending ? '로그인 확인 중…' : '로그인'}</button>
        </form>
      </div>
    </div>
  </div>;
}
