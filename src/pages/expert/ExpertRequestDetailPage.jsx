import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ExpertRequestDetailPage() {
  const { id } = useParams()
  const { state, actions } = useAppContext()
  const expert = state.experts.find((item) => item.id === state.session.userId)
  const [request, setRequest] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      const detail = await actions.getRequestDetailForExpert(expert.id, id)
      if (active) setRequest(detail)
    }

    load()

    return () => {
      active = false
    }
  }, [actions, expert.id, id, state.requests, state.bids, state.clients])

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="잘못된 접근입니다." />
  }

  return (
    <div>
      <PageTitle
        eyebrow={request.code}
        title={request.title}
        description={request.description}
        actions={<StatusBadge type="request" value={request.status} />}
      />
      {request.clientContact ? (
        <InfoBanner tone="success">선택된 의뢰입니다. 의뢰인 연락처가 공개되었습니다.</InfoBanner>
      ) : (
        <InfoBanner>선택 전에는 의뢰인 회사명, 담당자명, 연락처, 이메일 등 상세 식별정보가 비공개됩니다.</InfoBanner>
      )}
      <SectionCard title="공고 정보">
        <div className="detail-grid">
          <div className="detail-item">
            <span>업종</span>
            <strong>{request.industryLabel}</strong>
          </div>
          <div className="detail-item">
            <span>공고 유형</span>
            <strong>{request.type}</strong>
          </div>
          <div className="detail-item">
            <span>지역</span>
            <strong>{request.region}</strong>
          </div>
          <div className="detail-item">
            <span>마감일</span>
            <strong>{formatDate(request.deadline)}</strong>
          </div>
          <div className="detail-item">
            <span>예산 범위</span>
            <strong>
              {formatCurrency(request.budgetMin)} ~ {formatCurrency(request.budgetMax)}
            </strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="내 상태">
        {request.myBid ? (
          <div className="detail-grid">
            <div className="detail-item">
              <span>입찰 상태</span>
              <strong>
                <StatusBadge type="bid" value={request.myBid.status} />
              </strong>
            </div>
            <div className="detail-item">
              <span>제시 가격</span>
              <strong>{formatCurrency(request.myBid.amount)}</strong>
            </div>
          </div>
        ) : (
          <EmptyState title="아직 입찰하지 않았습니다." description="상세를 확인한 뒤 가격 입찰을 진행할 수 있습니다." />
        )}
        <div className="inline-actions" style={{ marginTop: '20px' }}>
          <Link
            className="button"
            style={expert.verificationStatus !== 'approved' ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
            to={`/expert/requests/${request.id}/bid`}
          >
            입찰 제출
          </Link>
        </div>
      </SectionCard>
      {request.clientContact ? (
        <SectionCard title="의뢰인 정보">
          <div className="detail-grid">
            <div className="detail-item">
              <span>회사명</span>
              <strong>{request.clientContact.companyName}</strong>
            </div>
            <div className="detail-item">
              <span>담당자명</span>
              <strong>{request.clientContact.managerName}</strong>
            </div>
            <div className="detail-item">
              <span>연락처</span>
              <strong>{request.clientContact.phone}</strong>
            </div>
            <div className="detail-item">
              <span>이메일</span>
              <strong>{request.clientContact.email}</strong>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  )
}
