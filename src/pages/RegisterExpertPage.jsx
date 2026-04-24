import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageTitle } from '../components/common/PageTitle'
import { SectionCard } from '../components/common/SectionCard'
import { useAppContext } from '../context/AppContext'
import { qualificationTypes } from '../utils/constants'
import { getRequiredErrors, isValidEmail, isValidPhoneNumber } from '../utils/validators'

const initialForm = {
  name: '',
  organization: '',
  phone: '',
  email: '',
  password: '',
  specialty: '',
  qualificationType: qualificationTypes[0],
}

const labels = {
  name: '이름',
  organization: '소속/업체명',
  phone: '연락처',
  email: '이메일',
  password: '비밀번호',
  specialty: '전문 분야',
  qualificationType: '자격 종류',
}

export function RegisterExpertPage() {
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
    if (form.phone && !isValidPhoneNumber(form.phone)) {
      nextErrors.phone = '연락처 형식은 010-0000-0000 입니다.'
    }
    if (form.email && !isValidEmail(form.email)) {
      nextErrors.email = '이메일 형식을 확인해주세요.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    await actions.registerExpert(form)
    navigate('/expert/verify')
  }

  return (
    <div>
      <PageTitle eyebrow="Expert Join" title="전문가 회원가입" description="회원가입 후 인증 신청을 진행하면 관리자 승인 이후 입찰에 참여할 수 있습니다." />
      <SectionCard title="전문가 기본 정보">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            이름
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name ? <span className="error-text">{errors.name}</span> : null}
          </label>
          <label>
            소속/업체명
            <input name="organization" value={form.organization} onChange={handleChange} />
            {errors.organization ? <span className="error-text">{errors.organization}</span> : null}
          </label>
          <label>
            연락처
            <input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone ? <span className="error-text">{errors.phone}</span> : null}
          </label>
          <label>
            이메일
            <input name="email" value={form.email} onChange={handleChange} />
            {errors.email ? <span className="error-text">{errors.email}</span> : null}
          </label>
          <label>
            비밀번호
            <input name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password ? <span className="error-text">{errors.password}</span> : null}
          </label>
          <label>
            자격 종류
            <select name="qualificationType" value={form.qualificationType} onChange={handleChange}>
              {qualificationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="full">
            전문 분야
            <input name="specialty" value={form.specialty} onChange={handleChange} />
            {errors.specialty ? <span className="error-text">{errors.specialty}</span> : null}
          </label>
          <div className="full inline-actions">
            <button className="button" type="submit">
              가입 후 인증 신청으로 이동
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}
