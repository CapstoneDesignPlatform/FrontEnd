import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'
import { isPositiveNumber } from '../../utils/validators'

export function ExpertBidPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const expert = state.experts.find((item) => item.id === state.session.userId)
  const [request, setRequest] = useState(null)
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      const detail = await actions.getRequestDetailForExpert(expert.id, id)
      if (!active || !detail) return

      setRequest(detail)
      setAmount(detail.myBid?.amount || '')
      setMessage(detail.myBid?.message || '')
    }

    load()

    return () => {
      active = false
    }
  }, [actions, expert.id, id, state.requests, state.bids, state.clients])

  if (!request) return null

  const handleSubmit = async () => {
    if (expert.verificationStatus !== 'approved') {
      setError('전문가 인증 승인 후 입찰할 수 있습니다.')
      return
    }
    if (!isPositiveNumber(amount)) {
      setError('가격은 0보다 커야 합니다.')
      return
    }

    await actions.submitBid(request.id, {
      amount: Number(amount),
      message,
    })
    navigate('/expert/bids')
  }

  return (
    <div>
      <PageTitle eyebrow={request.code} title="가격 입찰 제출" description="최종 가격은 의뢰인과 외부 협의 후 확정되지만 최초 제시 가격 미만으로는 조정되지 않는 데모 규칙입니다." />
      {expert.verificationStatus !== 'approved' ? (
        <InfoBanner tone="warning">인증 승인 전이라 입찰 버튼이 비활성화됩니다.</InfoBanner>
      ) : null}
      <InfoBanner>입찰 단계에서는 의뢰인 회사명, 담당자명, 연락처, 이메일이 공개되지 않습니다.</InfoBanner>
      <SectionCard title="입찰 폼">
        <div className="form-grid">
          <label>
            업종
            <input disabled value={request.industryLabel || ''} />
          </label>
          <label>
            지역
            <input disabled value={request.region || ''} />
          </label>
          <label>
            제시 가격
            <input min="0" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="full">
            제안 메시지
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="inline-actions" style={{ marginTop: '20px' }}>
          <button className="button" disabled={expert.verificationStatus !== 'approved'} type="button" onClick={handleSubmit}>
            입찰 제출
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
