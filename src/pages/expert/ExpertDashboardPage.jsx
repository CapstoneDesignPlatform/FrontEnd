import { Link } from 'react-router-dom'

import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'

export function ExpertDashboardPage() {
  const { state } = useAppContext()
  const expert = state.experts.find((item) => item.id === state.session.userId)
  const myBids = state.bids.filter((bid) => bid.expertId === expert.id)
  const availableRequests = state.requests.filter((request) => ['bidding', 'posted', 'selecting'].includes(request.status))
  const selectedJobs = state.requests.filter((request) => request.selectedExpertId === expert.id)

  return (
    <div>
      <PageTitle
        eyebrow="Expert Dashboard"
        title={`${expert.organization} 전문가 대시보드`}
        description="입찰 가능한 공고와 내 입찰, 수주 후 진행 현황을 요약해 보여줍니다."
        actions={
          <Link className="button" to="/expert/requests">
            공고 보러가기
          </Link>
        }
      />
      <div className="grid-4">
        <SummaryCard label="입찰 가능 공고" value={`${availableRequests.length}`} />
        <SummaryCard label="내 입찰 건수" value={`${myBids.length}`} />
        <SummaryCard label="선택 대기 수" value={`${myBids.filter((bid) => bid.status === 'shortlisted').length}`} />
        <SummaryCard label="진행중 작업" value={`${selectedJobs.filter((request) => request.status !== 'settled').length}`} />
        <SummaryCard label="정산 대기 수" value={`${selectedJobs.filter((request) => request.settlementStatus === 'ready').length}`} />
      </div>
      <SectionCard title="인증 상태">
        <div className="inline-actions">
          <StatusBadge type="verification" value={expert.verificationStatus} />
          <Link className="button button--ghost" to="/expert/verify">
            인증 정보 관리
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}
