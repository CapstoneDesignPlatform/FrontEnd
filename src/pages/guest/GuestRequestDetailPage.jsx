import { useLocation, useParams } from 'react-router-dom'

import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Stepper } from '../../components/common/Stepper'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { processSteps } from '../../utils/constants'

export function GuestRequestDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { state } = useAppContext()
  const request = state.requests.find((item) => item.id === id && item.isGuestRequest)
  const client = state.clients.find((item) => item.id === request?.clientId)
  const selectedExpert = state.experts.find((item) => item.id === request?.selectedExpertId)

  if (!request) return null

  return (
    <div>
      <PageTitle eyebrow={request.code} title={request.title} description="비회원 의뢰 진행 현황을 조회합니다." />
      {location.state?.submittedNotice ? <InfoBanner tone="success">{location.state.submittedNotice}</InfoBanner> : null}
      <InfoBanner>이 코드로 나중에 다시 조회할 수 있습니다. 추가 협의는 전문가와 외부에서 진행되는 데모입니다.</InfoBanner>
      <SectionCard title="현재 진행 상태">
        <Stepper steps={processSteps} currentStep={request.progressStep} />
      </SectionCard>
      <SectionCard title="의뢰 요약">
        <div className="detail-grid">
          <div className="detail-item">
            <span>업종</span>
            <strong>{request.industryLabel}</strong>
          </div>
          <div className="detail-item">
            <span>상태</span>
            <strong><StatusBadge type="request" value={request.status} /></strong>
          </div>
          <div className="detail-item">
            <span>등록일</span>
            <strong>{formatDate(request.createdAt)}</strong>
          </div>
          <div className="detail-item">
            <span>결제 상태</span>
            <strong><StatusBadge type="payment" value={request.paymentStatus} /></strong>
          </div>
          <div className="detail-item">
            <span>의뢰인</span>
            <strong>{client?.companyName}</strong>
          </div>
          <div className="detail-item">
            <span>담당자 연락처</span>
            <strong>{client?.phone}</strong>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="선택 전문가 / 가격">
        <div className="detail-grid">
          <div className="detail-item">
            <span>선택 전문가</span>
            <strong>{selectedExpert ? `${selectedExpert.organization} / ${selectedExpert.name}` : '선택 대기'}</strong>
          </div>
          <div className="detail-item">
            <span>확정 금액</span>
            <strong>{formatCurrency(request.clientConfirmedPrice || request.finalPrice)}</strong>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
