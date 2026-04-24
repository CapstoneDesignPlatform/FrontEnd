import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { expertProgressOptions } from '../../utils/constants'
import { formatCurrency, formatRatio } from '../../utils/formatters'

export function ExpertJobDetailPage() {
  const { id } = useParams()
  const { state, actions } = useAppContext()
  const [request, setRequest] = useState(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      const detail = await actions.getRequestDetailForExpert(state.session.userId, id)
      if (active) setRequest(detail)
    }

    load()

    return () => {
      active = false
    }
  }, [actions, id, state.session.userId, state.requests, state.bids, state.clients])

  if (!request || !request.isSelectedExpert) {
    return <EmptyState title="수주된 작업을 찾을 수 없습니다." description="선택된 작업만 접근 가능합니다." />
  }

  const fee = (request.finalPrice || 0) * state.adminSettings.platformFeeRate
  const expected = (request.finalPrice || 0) - fee

  return (
    <div>
      <PageTitle eyebrow={request.code} title="수주된 작업 상세" description="진행 상태를 변경하고 완료 처리와 정산 예정 금액을 확인합니다." />
      <InfoBanner>
        최종 가격은 의뢰인과 외부 협의 후 확정하되, 최초 제시 가격 미만으로 조정할 수 없음(데모 규칙).
      </InfoBanner>
      <InfoBanner tone="success">선택된 의뢰입니다. 의뢰인 연락처 공개 상태로 전환되었습니다.</InfoBanner>
      <SectionCard title="의뢰인 연락처 공개">
        <PartnerCard
          title={request.clientContact.companyName}
          subtitle="선택된 의뢰 · 연락 가능"
          items={[
            { label: '담당자명', value: request.clientContact.managerName },
            { label: '연락처', value: request.clientContact.phone },
            { label: '이메일', value: request.clientContact.email },
            { label: '업종', value: request.industryLabel },
          ]}
        />
      </SectionCard>
      <SectionCard title="작업 상태">
        <div className="detail-grid">
          <div className="detail-item">
            <span>현재 상태</span>
            <strong>
              <StatusBadge type="request" value={request.status} />
            </strong>
          </div>
          <div className="detail-item">
            <span>결제 상태</span>
            <strong>
              <StatusBadge type="payment" value={request.paymentStatus} />
            </strong>
          </div>
        </div>
        <div className="inline-actions" style={{ marginTop: '20px' }}>
          {expertProgressOptions.map((option) => (
            <button
              className="button button--ghost"
              key={option.value}
              type="button"
              onClick={async () => {
                await actions.updateProgress(request.id, option.value)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="정산 정보">
        <div className="detail-grid">
          <div className="detail-item">
            <span>최종 금액</span>
            <strong>{formatCurrency(request.finalPrice)}</strong>
          </div>
          <div className="detail-item">
            <span>플랫폼 수수료</span>
            <strong>{formatRatio(state.adminSettings.platformFeeRate)}</strong>
          </div>
          <div className="detail-item">
            <span>수수료 금액</span>
            <strong>{formatCurrency(fee)}</strong>
          </div>
          <div className="detail-item">
            <span>수령 예정 금액</span>
            <strong>{formatCurrency(expected)}</strong>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
