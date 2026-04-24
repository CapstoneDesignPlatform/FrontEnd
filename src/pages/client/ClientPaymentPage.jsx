import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { paymentMethods } from '../../utils/constants'

export function ClientPaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [method, setMethod] = useState(paymentMethods[0].value)
  const [confirmedPrice, setConfirmedPrice] = useState('')
  const [error, setError] = useState('')
  const request = state.requests.find((item) => item.id === id && item.clientId === state.session.userId)

  if (!request) {
    return null
  }

  if (!request.selectedExpertId) {
    return (
      <div>
        <PageTitle eyebrow={request.code} title="가짜 결제/에스크로 화면" description="선택된 전문가가 있어야 결제를 진행할 수 있습니다." />
        <InfoBanner tone="warning">전문가 선택 전에는 결제 단계 진입이 불가능합니다.</InfoBanner>
        <Link className="button" to={`/client/requests/${request.id}/select`}>
          전문가 선택으로 이동
        </Link>
      </div>
    )
  }

  const selectedExpert = state.experts.find((item) => item.id === request.selectedExpertId)
  const selectedBid = state.bids.find((item) => item.id === request.selectedBidId)

  const handlePayment = async () => {
    if (confirmedPrice) {
      const result = await actions.updateClientConfirmedPrice(request.id, request.selectedBidId, Number(confirmedPrice))
      if (result?.error) {
        setError(result.error)
        return
      }
    }
    await actions.confirmPayment(request.id, method)
    navigate(`/client/requests/${request.id}/progress`)
  }

  return (
    <div>
      <PageTitle eyebrow={request.code} title="가짜 결제 / 에스크로" description="실제 PG 연동 없이 버튼 클릭으로 결제 상태만 변경됩니다." />
      <SectionCard title="결제 대상 요약">
        <div className="detail-grid">
          <div className="detail-item">
            <span>선택 전문가</span>
            <strong>
              {selectedExpert.organization} / {selectedExpert.name}
            </strong>
          </div>
          <div className="detail-item">
            <span>현재 결제 상태</span>
            <strong>
              <StatusBadge type="payment" value={request.paymentStatus} />
            </strong>
          </div>
          <div className="detail-item">
            <span>최종 가격</span>
            <strong>{formatCurrency(request.finalPrice)}</strong>
          </div>
          <div className="detail-item">
            <span>정산 상태</span>
            <strong>
              <StatusBadge type="settlement" value={request.settlementStatus} />
            </strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="최종 선택 전문가">
        {selectedExpert ? (
          <PartnerCard
            title={selectedExpert.name}
            subtitle={`${selectedExpert.organization} · ${selectedExpert.qualificationType}`}
            badges={[
              { type: 'bid', value: 'selected' },
              { type: 'request', value: 'selected' },
            ]}
            items={[
              { label: '경력 연수', value: `${selectedExpert.careerYears}년` },
              { label: '연락처', value: selectedExpert.phone },
              { label: '이메일', value: selectedExpert.email },
              { label: '제시 금액', value: formatCurrency(selectedBid?.amount) },
              { label: '의뢰인 확정 금액', value: formatCurrency(request.clientConfirmedPrice || request.finalPrice) },
            ]}
          />
        ) : null}
      </SectionCard>
      <SectionCard title="결제 수단 선택">
        <InfoBanner>에스크로 기반 구매안전 서비스 연계 예정 (MVP 데모)</InfoBanner>
        <div className="form-grid">
          <label>
            전문가 제시 금액
            <input disabled value={selectedBid?.amount || request.finalPrice || ''} />
          </label>
          <label>
            의뢰인 확정 금액
            <input
              min={selectedBid?.amount || request.finalPrice || 0}
              type="number"
              value={confirmedPrice || request.clientConfirmedPrice || request.finalPrice || ''}
              onChange={(event) => {
                setError('')
                setConfirmedPrice(event.target.value)
              }}
            />
          </label>
        </div>
        <div className="pill-tabs">
          {paymentMethods.map((item) => (
            <button
              key={item.value}
              className={item.value === method ? 'active' : ''}
              type="button"
              onClick={() => setMethod(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <InfoBanner>
          {method === 'escrow'
            ? '에스크로 선택 시 결제 상태는 에스크로보관중으로 반영됩니다.'
            : '카드/가상계좌 선택 시 결제완료 상태로 반영됩니다.'}
        </InfoBanner>
        {error ? <p className="error-text">{error}</p> : null}
        <div className="inline-actions">
          <button className="button" type="button" onClick={handlePayment}>
            결제 상태 변경
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
