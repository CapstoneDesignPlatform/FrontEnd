import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'

export function ClientProgressPage() {
  const { id } = useParams()
  const { state } = useAppContext()
  const request = state.requests.find((item) => item.id === id && item.clientId === state.session.userId)

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="잘못된 접근입니다." />
  }

  const selectedExpert = state.experts.find((item) => item.id === request.selectedExpertId)

  return (
    <div>
      <PageTitle eyebrow={request.code} title="서비스 진행 상태" description="선택된 전문가가 업데이트한 작업 진행 단계를 확인할 수 있습니다." />
      <InfoBanner>플랫폼 내부 채팅은 구현하지 않고, 연락처를 통해 별도 협의를 진행하는 데모 안내만 제공합니다.</InfoBanner>
      <SectionCard title="현재 진행 현황">
        <div className="detail-grid">
          <div className="detail-item">
            <span>공고 상태</span>
            <strong>
              <StatusBadge type="request" value={request.status} />
            </strong>
          </div>
          <div className="detail-item">
            <span>진행 단계</span>
            <strong>{request.progressStep}</strong>
          </div>
          <div className="detail-item">
            <span>담당 전문가</span>
            <strong>{selectedExpert ? `${selectedExpert.organization} / ${selectedExpert.name}` : '-'}</strong>
          </div>
          <div className="detail-item">
            <span>연락처</span>
            <strong>{selectedExpert?.phone || '-'}</strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="선택된 전문가 정보">
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
              { label: '제시 금액', value: formatCurrency(state.bids.find((item) => item.id === request.selectedBidId)?.amount) },
              { label: '의뢰인 확정 금액', value: formatCurrency(request.clientConfirmedPrice || request.finalPrice) },
            ]}
          />
        ) : (
          <EmptyState title="선택된 전문가 없음" description="전문가 선택 이후 이 화면에서 연락 가능 정보를 확인할 수 있습니다." />
        )}
      </SectionCard>
      <SectionCard title="후속 단계">
        <div className="inline-actions">
          <Link className="button button--ghost" to={`/client/requests/${request.id}/complete`}>
            완료 / 정산 화면
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}
