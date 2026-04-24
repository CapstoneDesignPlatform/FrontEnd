import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { PageTitle } from '../components/common/PageTitle'
import { SectionCard } from '../components/common/SectionCard'
import { useAppContext } from '../context/AppContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [form, setForm] = useState({ loginId: '', password: '' })
  const client = state.clients.find((item) => !item.isGuestProfile)
  const expert = state.experts.find((item) => item.verificationStatus === 'approved')
  const admin = state.admins?.[0]

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const loginOptions = [
    {
      label: '의뢰인 데모',
      action: async () => {
        await actions.login('client', client.id)
        navigate('/client')
      },
    },
    {
      label: '전문가 데모',
      action: async () => {
        await actions.login('expert', expert.id)
        navigate('/expert')
      },
    },
    {
      label: '관리자 데모',
      action: async () => {
        await actions.login('admin', admin.id)
        navigate('/admin')
      },
    },
  ]

  const handleDemoLogin = async () => {
    await actions.login('client', client.id)
    navigate('/client')
  }

  return (
    <div className="login-layout">
      <section className="login-panel">
        <PageTitle
          eyebrow="Login"
          title="회원 로그인"
          description="실제 인증 연동은 없으며, MVP 데모용 로그인 폼과 간편 역할 진입을 제공합니다."
        />
        <SectionCard title="로그인">
          <div className="form-stack">
            <label>
              아이디
              <input name="loginId" value={form.loginId} onChange={handleChange} placeholder="아이디를 입력하세요" />
            </label>
            <label>
              비밀번호
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" />
            </label>
            <div className="inline-actions">
              <button className="button button--full" type="button" onClick={handleDemoLogin}>
                로그인
              </button>
            </div>
            <div className="login-links">
              <Link to="/register/client">회원가입</Link>
              <span>아이디/비밀번호 찾기</span>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="소셜 로그인" description="실제 연동 없이 버튼 UI만 제공합니다.">
          <div className="social-grid">
            {['네이버', '카카오', '구글'].map((provider) => (
              <button className="button button--ghost" key={provider} type="button">
                {provider} 로그인
              </button>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="login-side">
        <SectionCard title="비회원으로 바로 시작" description="회원가입 없이 의뢰 등록과 요청 코드 조회가 가능합니다.">
          <div className="inline-actions">
            <Link className="button button--full" to="/guest/start">
              비회원 의뢰 시작
            </Link>
            <Link className="button button--ghost button--full" to="/guest/lookup">
              요청 코드 조회
            </Link>
          </div>
        </SectionCard>
        <SectionCard title="역할별 데모 진입">
          <div className="demo-role-list">
            {loginOptions.map((option) => (
              <button className="button button--ghost button--full" key={option.label} type="button" onClick={option.action}>
                {option.label}
              </button>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
