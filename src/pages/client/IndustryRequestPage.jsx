import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Tabs } from '../../components/common/Tabs'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import {
  businessTypeOptions,
  diagnosticReasonOptions,
  getIndustryConfig,
  industryCards,
} from '../../config/industryConfigs'
import { useAppContext } from '../../context/AppContext'
import { regions } from '../../utils/constants'
import { isValidEmail, isValidPhoneNumber } from '../../utils/validators'

const baseForm = {
  title: '',
  description: '',
  deadline: '',
  region: '서울',
  managerName: '',
  phone: '',
  email: '',
  urgent: false,
  budgetMin: '',
  budgetMax: '',
  attachmentName: '',
  businessEntityType: '법인사업자',
  classification: '신규',
  requiredLicense: '',
  currentIndustry: '',
  assetScale: '',
  heldLicense: '',
  diagnosticReason: '자본금 변동',
}

export function IndustryRequestPage({ mode = 'client' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { industrySlug } = useParams()
  const { state, actions } = useAppContext()
  const currentClient = state.clients.find((item) => item.id === state.session.userId)
  const initialIndustrySlug = industrySlug || location.state?.industrySlug || ''
  const [selectedIndustrySlug] = useState(initialIndustrySlug)
  const hasIndustryContext = Boolean(selectedIndustrySlug)
  const config = useMemo(() => getIndustryConfig(selectedIndustrySlug), [selectedIndustrySlug])
  const [activeTab, setActiveTab] = useState(config.tabs[0])
  const [form, setForm] = useState({
    ...baseForm,
    managerName: mode === 'client' ? currentClient?.managerName || '' : '',
    phone: mode === 'client' ? currentClient?.phone || '' : '',
    email: mode === 'client' ? currentClient?.email || '' : '',
  })
  const [guestProfile, setGuestProfile] = useState({
    companyName: '',
    representativeName: '',
    managerName: '',
    phone: '',
    email: '',
    industry: config.label,
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')
  const [submittingMode, setSubmittingMode] = useState('posted')

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setForm((current) => {
      const next = { ...current, [name]: nextValue }

      if (name === 'businessEntityType' && value === '창업 예정') {
        next.currentIndustry = '없음'
        next.assetScale = ''
      }
      if (name === 'currentIndustry' && value === '없음') {
        next.assetScale = ''
      }

      return next
    })
  }

  const handleGuestChange = (event) => {
    const { name, value } = event.target
    setGuestProfile((current) => ({ ...current, [name]: value }))
  }

  const isAssetDisabled = form.currentIndustry === '없음' || form.businessEntityType === '창업 예정'

  if (!hasIndustryContext) {
    return (
      <div>
        <PageTitle
          eyebrow={mode === 'guest' ? 'Estimate Request' : 'Client Request'}
          title="견적 요청 업종을 먼저 선택해주세요"
          description="정상 플로우에서는 상단 `견적 요청` 메뉴에서 업종을 선택한 뒤 바로 해당 업종 폼으로 진입합니다."
        />
        <SectionCard title="업종 바로가기" description="업종이 미정인 직접 접근은 간단한 링크 리스트로만 안내합니다.">
          <div className="estimate-entry-links">
            {industryCards.map((item) => (
              <Link
                key={item.slug}
                className="estimate-entry-link"
                to={mode === 'guest' ? `/guest/start/${item.slug}` : `/client/requests/new/${item.slug}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    )
  }

  const validate = () => {
    const nextErrors = {}
    const requiredFormKeys = ['title', 'description', 'deadline', 'managerName', 'phone', 'email']

    requiredFormKeys.forEach((key) => {
      if (!form[key]) nextErrors[key] = '필수 입력 항목입니다.'
    })

    if (!isValidPhoneNumber(form.phone)) nextErrors.phone = '연락처 형식은 010-0000-0000 입니다.'
    if (!isValidEmail(form.email)) nextErrors.email = '이메일 형식을 확인해주세요.'
    if (form.budgetMin && Number(form.budgetMin) <= 0) nextErrors.budgetMin = '0보다 큰 값을 입력해주세요.'
    if (form.budgetMax && Number(form.budgetMax) <= 0) nextErrors.budgetMax = '0보다 큰 값을 입력해주세요.'
    if (!isAssetDisabled && form.assetScale && Number(form.assetScale) < 0) nextErrors.assetScale = '0 이상 값을 입력해주세요.'

    if (activeTab === '필요 면허') {
      if (!form.requiredLicense) nextErrors.requiredLicense = '필요 면허를 선택해주세요.'
      if (!form.currentIndustry) nextErrors.currentIndustry = '현재 업종을 입력해주세요.'
    }
    if (activeTab === '실태 조사' && !form.heldLicense) nextErrors.heldLicense = '보유 면허를 입력해주세요.'
    if (activeTab === '기타' && !form.diagnosticReason) nextErrors.diagnosticReason = '진단 사유를 선택해주세요.'

    if (mode === 'guest') {
      ;['companyName', 'managerName', 'phone', 'email'].forEach((key) => {
        if (!guestProfile[key]) nextErrors[`guest-${key}`] = '필수 입력 항목입니다.'
      })
      if (guestProfile.phone && !isValidPhoneNumber(guestProfile.phone)) {
        nextErrors['guest-phone'] = '연락처 형식은 010-0000-0000 입니다.'
      }
      if (guestProfile.email && !isValidEmail(guestProfile.email)) {
        nextErrors['guest-email'] = '이메일 형식을 확인해주세요.'
      }
    }

    return nextErrors
  }

  const buildBusinessInfo = () => {
    if (activeTab === '필요 면허') {
      return {
        businessEntityType: form.businessEntityType,
        classification: form.classification,
        requiredLicense: form.requiredLicense,
        currentIndustry: form.currentIndustry,
        assetScale: isAssetDisabled || !form.assetScale ? null : Number(form.assetScale),
      }
    }
    if (activeTab === '실태 조사' || activeTab === '주기적 신고') {
      return {
        businessEntityType: form.businessEntityType,
        heldLicense: form.heldLicense || form.requiredLicense || config.licenseOptions[0],
        currentIndustry: form.currentIndustry || '없음',
        assetScale: isAssetDisabled || !form.assetScale ? null : Number(form.assetScale),
      }
    }

    return {
      businessEntityType: form.businessEntityType,
      diagnosticReason: form.diagnosticReason,
      currentIndustry: form.currentIndustry || '없음',
      assetScale: isAssetDisabled || !form.assetScale ? null : Number(form.assetScale),
    }
  }

  const handleSubmit = async (publishNow) => {
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSubmittingMode(publishNow ? 'posted' : 'draft')
    const completionMessage = publishNow
      ? '전문가(구독자)에게 알림 발송 예정 (MVP 데모)'
      : '임시저장되었습니다. 이어서 수정할 수 있습니다.'

    const payload = {
      industrySlug: config.slug,
      industryLabel: config.label,
      requestCategory: activeTab,
      type: activeTab,
      title: form.title,
      description: form.description,
      deadline: form.deadline,
      region: form.region,
      managerName: form.managerName,
      phone: form.phone,
      email: form.email,
      urgent: form.urgent,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
      attachmentName: form.attachmentName,
      businessInfo: buildBusinessInfo(),
      progressStep: '필요정보등록',
    }

    setNotice(completionMessage)

    if (mode === 'guest') {
      const created = await actions.createGuestRequest(
        {
          ...guestProfile,
          industry: config.label,
        },
        payload,
        publishNow,
      )
      navigate(`/guest/requests/${created.request.id}`, {
        state: {
          submittedNotice: completionMessage,
          requestCode: created.request.code,
        },
      })
      return
    }

    const request = await actions.createRequest(payload, publishNow)
    navigate(`/client/requests/${request.id}`, {
      state: {
        submittedNotice: completionMessage,
      },
    })
  }

  return (
    <div>
      <PageTitle
        eyebrow={mode === 'guest' ? 'Guest Request' : 'Client Request'}
        title={mode === 'guest' ? `${config.label} 견적 요청` : `${config.label} 견적 요청`}
        description={mode === 'guest' ? '비회원도 바로 의뢰를 등록할 수 있으며, 요청 코드로 다시 조회할 수 있습니다.' : config.description}
        actions={
          mode === 'guest' ? (
            <Link className="button button--ghost" to="/guest/lookup">
              요청 코드 조회
            </Link>
          ) : null
        }
      />
      {notice ? <InfoBanner tone="success">{notice}</InfoBanner> : null}
      <SectionCard title={`${config.label} 의뢰 등록`} description="현재 진행 상태와 요청 유형을 확인하고, 필요한 탭만 열어 입력하세요.">
        <div className="detail-grid">
          <div className="detail-item">
            <span>업종명</span>
            <strong>{config.label} 견적 요청</strong>
          </div>
          <div className="detail-item">
            <span>현재 진행 상태</span>
            <strong>{submittingMode === 'draft' ? '임시저장 작성중' : '등록 작성중'}</strong>
          </div>
          <div className="detail-item full">
            <span>안내</span>
            <strong>현재 활성 탭의 입력 폼만 표시되며, 탭을 바꿔도 입력한 값은 유지됩니다.</strong>
          </div>
        </div>
      </SectionCard>

      {mode === 'guest' ? (
        <SectionCard title="비회원 기본 정보" description="제출 후 요청 코드로 다시 조회할 수 있습니다.">
          <div className="form-grid">
            <label>
              회사명
              <input name="companyName" value={guestProfile.companyName} onChange={handleGuestChange} />
              {errors['guest-companyName'] ? <span className="error-text">{errors['guest-companyName']}</span> : null}
            </label>
            <label>
              대표자명
              <input name="representativeName" value={guestProfile.representativeName} onChange={handleGuestChange} />
            </label>
            <label>
              담당자명
              <input name="managerName" value={guestProfile.managerName} onChange={handleGuestChange} />
              {errors['guest-managerName'] ? <span className="error-text">{errors['guest-managerName']}</span> : null}
            </label>
            <label>
              연락처
              <input name="phone" value={guestProfile.phone} onChange={handleGuestChange} />
              {errors['guest-phone'] ? <span className="error-text">{errors['guest-phone']}</span> : null}
            </label>
            <label>
              이메일
              <input name="email" value={guestProfile.email} onChange={handleGuestChange} />
              {errors['guest-email'] ? <span className="error-text">{errors['guest-email']}</span> : null}
            </label>
            <label className="full">
              주소
              <input name="address" value={guestProfile.address} onChange={handleGuestChange} />
            </label>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="의뢰 유형 선택">
        <Tabs items={config.tabs} value={activeTab} onChange={setActiveTab} />
      </SectionCard>

      <SectionCard title="기본 정보" description="공고 제목, 설명, 마감일, 지역 등 의뢰의 기본 정보를 입력합니다.">
        <div className="form-grid">
          <label className="full">
            공고 제목
            <input name="title" value={form.title} onChange={handleFormChange} placeholder={`${config.label} 관련 의뢰 제목을 입력하세요.`} />
            {errors.title ? <span className="error-text">{errors.title}</span> : null}
          </label>
          <label className="full">
            공고 설명
            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="현황과 요청 범위를 자세히 입력하세요." />
            {errors.description ? <span className="error-text">{errors.description}</span> : null}
          </label>
          <label>
            희망 마감일
            <input name="deadline" type="date" value={form.deadline} onChange={handleFormChange} />
            {errors.deadline ? <span className="error-text">{errors.deadline}</span> : null}
          </label>
          <label>
            지역
            <select name="region" value={form.region} onChange={handleFormChange}>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label>
            예산 최소
            <input name="budgetMin" min="0" type="number" value={form.budgetMin} onChange={handleFormChange} />
          </label>
          <label>
            예산 최대
            <input name="budgetMax" min="0" type="number" value={form.budgetMax} onChange={handleFormChange} />
          </label>
          <label>
            첨부파일명
            <input name="attachmentName" value={form.attachmentName} onChange={handleFormChange} placeholder="실제 업로드 없이 파일명만 표시됩니다." />
          </label>
          <label>
            긴급 여부
            <input checked={form.urgent} name="urgent" type="checkbox" onChange={handleFormChange} />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="담당자 정보" description="전문가가 연락을 준비할 수 있도록 담당자 정보를 입력합니다.">
        <div className="form-grid">
          <label>
            담당자명
            <input name="managerName" value={form.managerName} onChange={handleFormChange} />
            {errors.managerName ? <span className="error-text">{errors.managerName}</span> : null}
          </label>
          <label>
            연락처
            <input name="phone" value={form.phone} onChange={handleFormChange} />
            {errors.phone ? <span className="error-text">{errors.phone}</span> : null}
          </label>
          <label>
            이메일
            <input name="email" value={form.email} onChange={handleFormChange} />
            {errors.email ? <span className="error-text">{errors.email}</span> : null}
          </label>
        </div>
      </SectionCard>

      <SectionCard title="업종 세부 정보" description={`${activeTab} 탭에 필요한 필드만 표시됩니다. 비활성 탭 내용은 숨겨집니다.`}>
        <div className="form-grid">
          <label>
            사업자 유형
            <select name="businessEntityType" value={form.businessEntityType} onChange={handleFormChange}>
              {businessTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {activeTab === '필요 면허' ? (
            <>
              <label>
                구분
                <select name="classification" value={form.classification} onChange={handleFormChange}>
                  {['신규', '추가'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                필요 면허
                <select name="requiredLicense" value={form.requiredLicense} onChange={handleFormChange}>
                  <option value="">선택하세요</option>
                  {config.licenseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.requiredLicense ? <span className="error-text">{errors.requiredLicense}</span> : null}
              </label>
            </>
          ) : null}

          {activeTab === '실태 조사' ? (
            <label>
              보유 면허
              <input name="heldLicense" value={form.heldLicense} onChange={handleFormChange} placeholder="예: 건축공사업" />
              {errors.heldLicense ? <span className="error-text">{errors.heldLicense}</span> : null}
            </label>
          ) : null}

          {activeTab === '기타' ? (
            <label>
              진단 사유
              <select name="diagnosticReason" value={form.diagnosticReason} onChange={handleFormChange}>
                {diagnosticReasonOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {activeTab === '주기적 신고' ? <div className="detail-item"><span>안내</span><strong>전기공사업 전용 주기적 신고 의뢰입니다.</strong></div> : null}

          <label>
            현재 업종
            {config.currentIndustryMode === 'select' ? (
              <select name="currentIndustry" value={form.currentIndustry} onChange={handleFormChange}>
                <option value="">선택하세요</option>
                <option value="없음">없음</option>
                {config.currentIndustryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input list={`industry-options-${config.slug}`} name="currentIndustry" value={form.currentIndustry} onChange={handleFormChange} placeholder="현재 업종을 입력하세요." />
                <datalist id={`industry-options-${config.slug}`}>
                  <option value="없음" />
                  {config.currentIndustryOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </>
            )}
            {errors.currentIndustry ? <span className="error-text">{errors.currentIndustry}</span> : null}
          </label>

          <label>
            자산 규모(억원)
            <input
              disabled={isAssetDisabled}
              name="assetScale"
              type="number"
              min="0"
              step="0.1"
              value={form.assetScale}
              onChange={handleFormChange}
              placeholder={isAssetDisabled ? '현재 업종이 없으면 입력 비활성화' : '예: 4.5'}
            />
          </label>
        </div>
      </SectionCard>

      <div className="sticky-cta">
        <div className="sticky-cta__bar">
          <button className="button button--ghost" type="button" onClick={() => handleSubmit(false)}>
            임시저장
          </button>
          <button className="button" type="button" onClick={() => handleSubmit(true)}>
            {mode === 'guest' ? '등록하기' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
