import { useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { processSteps } from '../../utils/constants'
import { Stepper } from '../../components/common/Stepper'

export function AdminRequestDetailPage() {
  const { code } = useParams()
  const { state } = useAppContext()
  const request = state.requests.find((item) => item.code === code)

  if (!request) {
    return <EmptyState title="의뢰를 찾을 수 없습니다." description="코드를 다시 확인해주세요." />
  }

  const client = state.clients.find((item) => item.id === request.clientId)
  const bids = state.bids.filter((bid) => bid.requestId === request.id)
  const selectedExpert = state.experts.find((expert) => expert.id === request.selectedExpertId)

  return (
    <div>
      <PageTitle eyebrow={request.code} title="의뢰 코드 상세 조회" description="공고 정보, 의뢰인 정보, 전체 입찰, 알림 발송 수, 최종 선택 전문가를 확인합니다." />
      <div className="grid-4">
        <SummaryCard label="알림 발송 수" value={`${request.notificationCount}회`} />
        <SummaryCard label="결제 상태" value={<StatusBadge type="payment" value={request.paymentStatus} />} />
        <SummaryCard label="정산 상태" value={<StatusBadge type="settlement" value={request.settlementStatus} />} />
        <SummaryCard label="최종 선택 전문가" value={selectedExpert ? selectedExpert.organization : '미선정'} tone="accent" />
      </div>
      <SectionCard title="공고 및 의뢰인 정보">
        <div className="detail-grid">
          <div className="detail-item">
            <span>업종</span>
            <strong>{request.industryLabel}</strong>
          </div>
          <div className="detail-item">
            <span>공고명</span>
            <strong>{request.title}</strong>
          </div>
          <div className="detail-item">
            <span>상태</span>
            <strong>
              <StatusBadge type="request" value={request.status} />
            </strong>
          </div>
          <div className="detail-item">
            <span>의뢰인</span>
            <strong>{client?.companyName || '-'}</strong>
          </div>
          <div className="detail-item">
            <span>담당자 연락처</span>
            <strong>{client?.phone || '-'}</strong>
          </div>
          <div className="detail-item">
            <span>마감일</span>
            <strong>{formatDate(request.deadline)}</strong>
          </div>
          <div className="detail-item">
            <span>최종 가격</span>
            <strong>{formatCurrency(request.finalPrice)}</strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="상태 이력">
        <Stepper steps={processSteps} currentStep={request.progressStep} />
      </SectionCard>
      <SectionCard title="최종 선택 전문가">
        {selectedExpert ? (
          <article className="list-card">
            <h3>
              {selectedExpert.organization} / {selectedExpert.name}
            </h3>
            <p className="muted">
              {selectedExpert.qualificationType} · {selectedExpert.phone}
            </p>
            <p>{selectedExpert.intro}</p>
          </article>
        ) : (
          <EmptyState title="아직 선택된 전문가가 없습니다." description="입찰 리스트를 통해 선정 전 상태를 확인하세요." />
        )}
      </SectionCard>
      <SectionCard title="입찰 전문가 전체 리스트">
        <div className="card-list">
          {bids.map((bid) => {
            const expert = state.experts.find((item) => item.id === bid.expertId)
            return (
              <article className="list-card" key={bid.id}>
                <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <h3>{expert?.organization}</h3>
                    <p className="muted">
                      {expert?.name} · {expert?.qualificationType}
                    </p>
                  </div>
                  <StatusBadge type="bid" value={bid.status} />
                </div>
                <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
              </article>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
