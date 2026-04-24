import { useMemo, useState } from 'react'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'

export function ExpertVerifyPage() {
  const { state, actions } = useAppContext()
  const expert = useMemo(
    () => state.experts.find((item) => item.id === state.session.userId),
    [state.experts, state.session.userId],
  )
  const [form, setForm] = useState({
    certificateNumber: expert.certificateNumber || '',
    businessLicenseFile: expert.businessLicenseFile || '',
    certificateFile: expert.certificateFile || '',
    intro: expert.intro || '',
    careerYears: expert.careerYears || 0,
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setSaved(false)
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await actions.submitVerification(expert.id, {
      ...form,
      careerYears: Number(form.careerYears),
    })
    setSaved(true)
  }

  return (
    <div>
      <PageTitle eyebrow="Expert Verification" title="전문가 인증 신청" description="승인 전에는 입찰 버튼이 비활성화되며, 관리자 승인 후 공고 입찰이 가능합니다." />
      <InfoBanner tone={expert.verificationStatus === 'approved' ? 'success' : 'warning'}>
        현재 상태: <StatusBadge type="verification" value={expert.verificationStatus} />
      </InfoBanner>
      {saved ? <InfoBanner tone="success">인증 신청 정보가 저장되었습니다.</InfoBanner> : null}
      <SectionCard title="인증 제출 정보">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            자격증 번호
            <input name="certificateNumber" value={form.certificateNumber} onChange={handleChange} />
          </label>
          <label>
            경력 연차
            <input name="careerYears" min="0" type="number" value={form.careerYears} onChange={handleChange} />
          </label>
          <label>
            사업자등록증 파일명
            <input name="businessLicenseFile" value={form.businessLicenseFile} onChange={handleChange} />
          </label>
          <label>
            자격증 파일명
            <input name="certificateFile" value={form.certificateFile} onChange={handleChange} />
          </label>
          <label className="full">
            자기소개
            <textarea name="intro" value={form.intro} onChange={handleChange} />
          </label>
          <div className="full inline-actions">
            <button className="button" type="submit">
              인증 신청 저장
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
