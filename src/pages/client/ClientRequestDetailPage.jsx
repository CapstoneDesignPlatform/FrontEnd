import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ClientRequestDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { state, actions } = useAppContext()
  const [request, setRequest] = useState(null)
  const requestBids = state.bids.filter((bid) => bid.requestId === id)

  useEffect(() => {
    let active = true

    const load = async () => {
      const detail = await actions.getRequestDetailForClient(state.session.userId, id)
      if (active) setRequest(detail)
    }

    load()

    return () => {
      active = false
    }
  }, [actions, id, state.session.userId, state.requests, state.bids, state.experts])

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="목록으로 돌아가 다시 선택해주세요." />
  }

  return (
    <div>
      <PageTitle
        eyebrow={request.code}
        title={request.title}
        description={request.description}
        actions={<StatusBadge type="request" value={request.status} />}
      />
      {location.state?.submittedNotice ? <InfoBanner tone="success">{location.state.submittedNotice}</InfoBanner> : null}
      <div className="grid-4">
        <SummaryCard label="입찰 수" value={`${requestBids.length}건`} />
        <SummaryCard label="결제 상태" value={<StatusBadge type="payment" value={request.paymentStatus} />} />
        <SummaryCard label="정산 상태" value={<StatusBadge type="settlement" value={request.settlementStatus} />} />
        <SummaryCard label="최종 가격" value={formatCurrency(request.finalPrice || request.budgetMax)} />
      </div>
      <SectionCard title="공고 정보">
        <div className="detail-grid">
          <div className="detail-item">
            <span>업종</span>
            <strong>{request.industryLabel || '-'}</strong>
          </div>
          <div className="detail-item">
            <span>공고 유형</span>
            <strong>{request.type}</strong>
          </div>
          <div className="detail-item">
            <span>희망 마감일</span>
            <strong>{formatDate(request.deadline)}</strong>
          </div>
          <div className="detail-item">
            <span>지역</span>
            <strong>{request.region}</strong>
          </div>
          <div className="detail-item">
            <span>첨부파일</span>
            <strong>{request.attachmentName || '-'}</strong>
          </div>
          <div className="detail-item full">
            <span>선택된 전문가</span>
            <strong>{request.selectedExpert ? `${request.selectedExpert.organization} / ${request.selectedExpert.name}` : '아직 선택 전'}</strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="선택된 전문가 정보">
        {request.selectedExpert ? (
          <PartnerCard
            title={request.selectedExpert.name}
            subtitle={`${request.selectedExpert.organization} · ${request.selectedExpert.qualificationType}`}
            badges={[
              { type: 'bid', value: 'selected' },
              { type: 'request', value: 'selected' },
            ]}
            items={[
              { label: '경력 연수', value: `${request.selectedExpert.careerYears}년` },
              { label: '연락처', value: request.selectedExpert.phone },
              { label: '이메일', value: request.selectedExpert.email },
              { label: '제시 금액', value: formatCurrency(request.selectedExpert.bidAmount) },
              { label: '의뢰인 확정 금액', value: formatCurrency(request.selectedExpert.clientConfirmedPrice) },
            ]}
          />
        ) : (
          <EmptyState title="선택된 전문가 없음" description="입찰 목록에서 전문가를 선택하면 여기에서 계속 확인할 수 있습니다." />
        )}
      </SectionCard>
      <SectionCard title="다음 단계">
        <div className="inline-actions">
          <Link className="button button--ghost" to={`/client/requests/${request.id}/bids`}>
            입찰 리스트 보기
          </Link>
          <Link className="button button--ghost" to={`/client/requests/${request.id}/select`}>
            전문가 선택
          </Link>
          <Link className="button button--ghost" to={`/client/requests/${request.id}/payment`}>
            결제 진행
          </Link>
          <Link className="button button--ghost" to={`/client/requests/${request.id}/progress`}>
            진행 상태 보기
          </Link>
          <Link className="button button--ghost" to={`/client/requests/${request.id}/complete`}>
            완료 / 정산
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}
