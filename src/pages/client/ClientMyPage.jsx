import { Link } from 'react-router-dom'

import { DataTable } from '../../components/common/DataTable'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { PartnerCard } from '../../components/common/PartnerCard'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { Stepper } from '../../components/common/Stepper'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'
import { processSteps } from '../../utils/constants'
import { formatCurrency, formatDate } from '../../utils/formatters'

export function ClientMyPage() {
  const { state } = useAppContext()
  const requests = state.requests.filter((item) => item.clientId === state.session.userId)
  const activeRequest = requests.find((item) => !['completed', 'settled'].includes(item.status)) || requests[0]
  const pastRequests = requests.filter((item) => item.id !== activeRequest?.id)
  const activeBids = state.bids.filter((bid) => bid.requestId === activeRequest?.id)
  const selectedExpert = state.experts.find((item) => item.id === activeRequest?.selectedExpertId)
  const selectedBid = state.bids.find((item) => item.id === activeRequest?.selectedBidId)

  const bidRows = activeBids.map((bid) => {
    const expert = state.experts.find((item) => item.id === bid.expertId)
    return {
      ...bid,
      expertName: expert?.name,
      organization: `${expert?.organization} / ${expert?.qualificationType}`,
      phone: expert?.phone,
      clientConfirmedPrice:
        activeRequest?.selectedBidId === bid.id ? formatCurrency(activeRequest.clientConfirmedPrice || activeRequest.finalPrice) : '-',
      selected: activeRequest?.selectedBidId === bid.id ? '선택됨' : '미선정',
    }
  })

  const columns = [
    { key: 'expertName', label: '전문가' },
    { key: 'organization', label: '상호명/자격' },
    { key: 'phone', label: '연락처' },
    { key: 'amount', label: '전문가 제시 금액', render: (value) => formatCurrency(value) },
    { key: 'clientConfirmedPrice', label: '의뢰인 확정 금액' },
    { key: 'selected', label: '최종 선택 여부' },
  ]

  return (
    <div>
      <PageTitle eyebrow="My Page" title="의뢰인 마이페이지" description="현재 진행 중인 의뢰와 과거 의뢰 내역, 견적서, 결제 동선을 한 곳에서 확인할 수 있습니다." />
      <InfoBanner>에스크로 기반 구매안전 서비스 연계 예정 (MVP 데모)</InfoBanner>
      {activeRequest ? (
        <>
          <SectionCard title="진행 상태">
            <Stepper steps={processSteps} currentStep={activeRequest.progressStep} />
          </SectionCard>
          <SectionCard title="현재 진행 중인 의뢰 요약">
            <div className="grid-3">
              <SummaryCard label="등록일자" value={formatDate(activeRequest.createdAt)} />
              <SummaryCard label="사업자 유형" value={activeRequest.businessInfo?.businessEntityType || '-'} />
              <SummaryCard label="구분" value={activeRequest.businessInfo?.classification || '-'} />
              <SummaryCard label="필요 면허" value={activeRequest.businessInfo?.requiredLicense || activeRequest.businessInfo?.heldLicense || '-'} />
              <SummaryCard label="현재 업종" value={activeRequest.businessInfo?.currentIndustry || '-'} />
              <SummaryCard label="자산 규모" value={activeRequest.businessInfo?.assetScale ? `${activeRequest.businessInfo.assetScale}억원` : '-'} />
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
                  { label: '의뢰인 확정 금액', value: formatCurrency(activeRequest.clientConfirmedPrice || activeRequest.finalPrice) },
                ]}
              />
            ) : (
              <EmptyState title="선택된 전문가 없음" description="전문가 선택 후 이 영역에 상세 카드가 노출됩니다." />
            )}
          </SectionCard>
          <SectionCard
            title="전문가 견적서 리스트"
            actions={
              <Link className="button" to={`/client/requests/${activeRequest.id}/payment`}>
                결제 진행
              </Link>
            }
          >
            <DataTable columns={columns} rows={bidRows} emptyMessage="마감 후 전문가 견적서가 여기에 표시됩니다." />
          </SectionCard>
        </>
      ) : null}
      <SectionCard title="과거 의뢰 내역">
        <div className="card-list">
          {pastRequests.map((request) => (
            <article className="list-card" key={request.id}>
              <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h3>{request.title}</h3>
                  <p className="muted">
                    {request.code} · {request.industryLabel}
                  </p>
                </div>
                <StatusBadge type="request" value={request.status} />
              </div>
              <Link className="button button--ghost" to={`/client/requests/${request.id}`}>
                상세보기
              </Link>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
