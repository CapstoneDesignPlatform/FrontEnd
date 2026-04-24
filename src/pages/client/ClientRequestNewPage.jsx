import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'
import { regions, requestTypes } from '../../utils/constants'
import { getRequiredErrors } from '../../utils/validators'

const initialForm = {
  title: '',
  type: requestTypes[0],
  description: '',
  deadline: '',
  region: regions[0],
  attachmentName: '',
  urgent: false,
  budgetMin: '',
  budgetMax: '',
}

const labels = {
  title: '공고 제목',
  type: '공고 유형',
  description: '공고 설명',
  deadline: '희망 마감일',
  region: '지역',
}

export function ClientRequestNewPage() {
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const client = useMemo(
    () => state.clients.find((item) => item.id === state.session.userId),
    [state.clients, state.session.userId],
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const nextErrors = getRequiredErrors(
      {
        title: form.title,
        type: form.type,
        description: form.description,
        deadline: form.deadline,
        region: form.region,
      },
      labels,
    )

    if (form.budgetMin && Number(form.budgetMin) <= 0) {
      nextErrors.budgetMin = '예산은 0원보다 커야 합니다.'
    }
    if (form.budgetMax && Number(form.budgetMax) <= 0) {
      nextErrors.budgetMax = '예산은 0원보다 커야 합니다.'
    }
    return nextErrors
  }

  const handleSubmit = async (publishNow) => {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const request = await actions.createRequest(
      {
        ...form,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        clientNameSnapshot: client?.companyName || '비회원 의뢰 기업',
      },
      publishNow,
    )

    navigate(`/client/requests/${request.id}`)
  }

  const profileIncomplete = !client?.companyName || !client?.managerName || !client?.phone || !client?.email

  return (
    <div>
      <PageTitle eyebrow="New Request" title="의뢰 공고 등록" description="긴 폼 형태로 공고를 등록하고 임시저장 또는 게시를 선택할 수 있습니다." />
      {profileIncomplete ? (
        <InfoBanner tone="warning">기업 정보가 일부 비어 있습니다. 상세 관리와 결제 흐름 전에는 기업 정보를 먼저 보완하는 것이 좋습니다.</InfoBanner>
      ) : null}
      <SectionCard title="공고 등록 폼" description="첨부파일은 실제 업로드 대신 파일명만 저장합니다.">
        <div className="form-grid">
          <label className="full">
            공고 제목
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title ? <span className="error-text">{errors.title}</span> : null}
          </label>
          <label>
            공고 유형
            <select name="type" value={form.type} onChange={handleChange}>
              {requestTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            희망 마감일
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            {errors.deadline ? <span className="error-text">{errors.deadline}</span> : null}
          </label>
          <label className="full">
            공고 설명
            <textarea name="description" value={form.description} onChange={handleChange} />
            {errors.description ? <span className="error-text">{errors.description}</span> : null}
          </label>
          <label>
            지역
            <select name="region" value={form.region} onChange={handleChange}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label>
            첨부파일명
            <input name="attachmentName" value={form.attachmentName} onChange={handleChange} placeholder="예: 재무자료.zip" />
          </label>
          <label>
            예산 최소
            <input name="budgetMin" type="number" min="0" value={form.budgetMin} onChange={handleChange} />
            {errors.budgetMin ? <span className="error-text">{errors.budgetMin}</span> : null}
          </label>
          <label>
            예산 최대
            <input name="budgetMax" type="number" min="0" value={form.budgetMax} onChange={handleChange} />
            {errors.budgetMax ? <span className="error-text">{errors.budgetMax}</span> : null}
          </label>
          <label className="full">
            <span className="stack">
              긴급 여부
              <input checked={form.urgent} name="urgent" type="checkbox" onChange={handleChange} />
            </span>
          </label>
        </div>
        <div className="inline-actions" style={{ marginTop: '20px' }}>
          <button className="button button--ghost" type="button" onClick={() => handleSubmit(false)}>
            임시저장
          </button>
          <button className="button" type="button" onClick={() => handleSubmit(true)}>
            공고 게시
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
