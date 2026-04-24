import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'

export function GuestLookupPage() {
  const navigate = useNavigate()
  const { actions } = useAppContext()
  const [form, setForm] = useState({ code: '', verifier: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleLookup = async (event) => {
    event.preventDefault()
    const result = await actions.lookupGuestRequest(form.code, form.verifier)
    if (!result?.request) {
      setError('요청 코드 또는 확인 정보가 일치하지 않습니다.')
      return
    }

    navigate(`/guest/requests/${result.request.id}`)
  }

  return (
    <div>
      <PageTitle eyebrow="Guest Lookup" title="비회원 의뢰 조회" description="요청 코드와 연락처 또는 이메일 일부 정보로 비회원 의뢰를 다시 조회할 수 있습니다." />
      <InfoBanner>예시: `REQ-2026-0007` + 연락처 전체 또는 이메일 일부 입력</InfoBanner>
      <SectionCard title="조회 정보 입력">
        <form className="form-grid" onSubmit={handleLookup}>
          <label>
            요청 코드
            <input name="code" value={form.code} onChange={handleChange} placeholder="REQ-2026-0007" />
          </label>
          <label>
            연락처 또는 이메일 일부
            <input name="verifier" value={form.verifier} onChange={handleChange} placeholder="010-0000-0000 또는 demo@" />
          </label>
          <div className="full inline-actions">
            <button className="button" type="submit">
              조회하기
            </button>
          </div>
        </form>
        {error ? <p className="error-text">{error}</p> : null}
      </SectionCard>
    </div>
  )
}
