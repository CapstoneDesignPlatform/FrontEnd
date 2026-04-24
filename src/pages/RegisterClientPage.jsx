import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { InfoBanner } from '../components/common/InfoBanner'
import { PageTitle } from '../components/common/PageTitle'
import { SectionCard } from '../components/common/SectionCard'
import { useAppContext } from '../context/AppContext'
import { getRequiredErrors, isValidBusinessNumber, isValidEmail, isValidPhoneNumber } from '../utils/validators'

const initialForm = {
  companyName: '',
  representativeName: '',
  businessNumber: '',
  managerName: '',
  phone: '',
  email: '',
  industry: '',
  address: '',
}

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

export function RegisterClientPage() {
  const navigate = useNavigate()
  const { actions } = useAppContext()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
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

    await actions.registerClient(form)
    navigate('/client')
  }

  return (
    <div>
      <PageTitle eyebrow="Client Sign Up" title="의뢰인 회원가입" description="회원 가입 후 공고 등록과 상세 관리 흐름을 이어서 사용할 수 있습니다." />
      <InfoBanner>비회원도 이용 가능하지만, 회원가입 시 공고 관리와 결제 단계 이동이 더 간편해집니다.</InfoBanner>
      <SectionCard title="기업 기본 정보">
        <form className="form-grid" onSubmit={handleSubmit}>
          {Object.entries(labels).map(([key, label]) => (
            <label className={key === 'address' ? 'full' : ''} key={key}>
              {label}
              <input name={key} value={form[key]} onChange={handleChange} />
              {errors[key] ? <span className="error-text">{errors[key]}</span> : null}
            </label>
          ))}
          <div className="full inline-actions">
            <button className="button" type="submit">
              회원가입 후 대시보드로 이동
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
