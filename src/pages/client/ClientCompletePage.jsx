import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'

export function ClientCompletePage() {
  const { id } = useParams()
  const { state, actions } = useAppContext()
  const request = state.requests.find((item) => item.id === id && item.clientId === state.session.userId)
  const [rating, setRating] = useState(request?.review?.rating || 5)
  const [comment, setComment] = useState(request?.review?.comment || '')
  const selectedExpert = state.experts.find((item) => item.id === request?.selectedExpertId)
  const selectedBid = state.bids.find((item) => item.id === request?.selectedBidId)

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="잘못된 접근입니다." />
  }

  const canSubmitReview = request.status === 'completed' || request.status === 'settled' || request.status === 'report_submitted'

  const handleComplete = async () => {
    await actions.submitClientReview(request.id, { rating: Number(rating), comment })
  }

  return (
    <div>
      <PageTitle eyebrow={request.code} title="완료 / 정산 요약" description="의뢰인이 완료를 승인하고 정산 완료 상태까지 확인할 수 있습니다." />
      {request.status !== 'completed' && request.status !== 'settled' ? (
        <InfoBanner tone="warning">전문가가 완료 처리한 뒤 의뢰인이 완료 승인과 평가를 진행하는 흐름입니다.</InfoBanner>
      ) : null}
      <SectionCard title="현재 상태">
        <div className="detail-grid">
          <div className="detail-item">
            <span>공고 상태</span>
            <strong>
              <StatusBadge type="request" value={request.status} />
            </strong>
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
        ) : (
          <EmptyState title="선택된 전문가 없음" description="선택 후 완료 단계에서 계속 확인할 수 있습니다." />
        )}
      </SectionCard>
      <SectionCard title="전문가 평가">
        <div className="form-grid">
          <label>
            별점
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              {[5, 4, 3, 2, 1].map((item) => (
                <option key={item} value={item}>
                  {item}점
                </option>
              ))}
            </select>
          </label>
          <label className="full">
            한줄평
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
          </label>
        </div>
        <div className="inline-actions" style={{ marginTop: '20px' }}>
          <button className="button" type="button" disabled={!canSubmitReview} onClick={handleComplete}>
            완료 승인 및 평가 반영
          </button>
          <button
            className="button button--ghost"
            disabled={request.status !== 'completed' || request.settlementStatus === 'completed'}
            type="button"
            onClick={async () => {
              await actions.completeSettlement(request.id)
            }}
          >
            정산 완료 처리
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
