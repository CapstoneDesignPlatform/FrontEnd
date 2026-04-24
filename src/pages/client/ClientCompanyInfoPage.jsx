import { useMemo, useState } from 'react'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'
import { getRequiredErrors, isValidBusinessNumber, isValidEmail, isValidPhoneNumber } from '../../utils/validators'

const labels = {
  companyName: '회사명',
  representativeName: '대표자명',
  businessNumber: '사업자등록번호',
  managerName: '담당자명',
  phone: '연락처',
  email: '이메일',
  industry: '업종',
  address: '기업 주소',
}

export function ClientCompanyInfoPage() {
  const { state, actions } = useAppContext()
  const client = useMemo(
    () => state.clients.find((item) => item.id === state.session.userId),
    [state.clients, state.session.userId],
  )
  const [form, setForm] = useState(client)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setSaved(false)
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = getRequiredErrors(form, labels)
    if (form.businessNumber && !isValidBusinessNumber(form.businessNumber)) {
      nextErrors.businessNumber = '사업자등록번호 형식은 000-00-00000 입니다.'
    }
    if (form.phone && !isValidPhoneNumber(form.phone)) {
      nextErrors.phone = '연락처 형식은 010-0000-0000 입니다.'
    }
    if (form.email && !isValidEmail(form.email)) {
      nextErrors.email = '이메일 형식을 확인해주세요.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    await actions.updateClientProfile(client.id, form)
    setSaved(true)
  }

  return (
    <div>
      <PageTitle eyebrow="Company Info" title="기업 정보 입력 / 수정" description="결제와 상세 관리 단계에서 사용되는 기본 기업 정보를 관리합니다." />
      {state.session.isGuest ? (
        <InfoBanner tone="warning">비회원으로 진입한 상태입니다. 결제 전까지 기업 정보를 모두 입력해두는 흐름으로 시연할 수 있습니다.</InfoBanner>
      ) : null}
      {saved ? <InfoBanner tone="success">기업 정보가 저장되었습니다.</InfoBanner> : null}
      <SectionCard title="기본 정보">
        <form className="form-grid" onSubmit={handleSubmit}>
          {Object.entries(labels).map(([key, label]) => (
            <label className={key === 'address' ? 'full' : ''} key={key}>
              {label}
              <input name={key} value={form?.[key] || ''} onChange={handleChange} />
              {errors[key] ? <span className="error-text">{errors[key]}</span> : null}
            </label>
          ))}
          <div className="full inline-actions">
            <button className="button" type="submit">
              정보 저장
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
