import { Link } from 'react-router-dom'

import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'
import { sortByNewest } from '../../utils/helpers'

export function ClientDashboardPage() {
  const { state } = useAppContext()
  const requests = state.requests.filter((request) => request.clientId === state.session.userId)
  const recentRequests = sortByNewest(requests).slice(0, 4)

  const stats = [
    { label: '내 공고 수', value: requests.length },
    {
      label: '진행중 공고',
      value: requests.filter((request) =>
        ['selected', 'paid', 'in_progress', 'report_submitted'].includes(request.status),
      ).length,
    },
    {
      label: '결제 대기',
      value: requests.filter((request) => request.status === 'selected' || request.paymentStatus === 'unpaid').length,
    },
    { label: '완료 건수', value: requests.filter((request) => ['completed', 'settled'].includes(request.status)).length },
  ]

  return (
    <div>
      <PageTitle
        eyebrow="Client Dashboard"
        title="의뢰인 대시보드"
        description="내 공고 현황과 최근 등록 건을 한눈에 확인할 수 있습니다."
        actions={
          <Link className="button" to="/client/requests/new/construction">
            새 공고 등록
          </Link>
        }
      />
      <div className="grid-4">
        {stats.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={`${item.value}`} />
        ))}
      </div>
      <SectionCard title="최근 공고" description="상세 화면에서 입찰, 선택, 결제, 진행 흐름으로 이어집니다.">
        <div className="card-list">
          {recentRequests.map((request) => (
            <article className="list-card" key={request.id}>
              <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                <div>
                  <h3>{request.title}</h3>
                  <p className="muted">
                    {request.code} · {request.region} · 마감 {formatDate(request.deadline)}
                  </p>
                </div>
                <StatusBadge type="request" value={request.status} />
              </div>
              <div className="inline-actions">
                <Link className="button button--ghost" to={`/client/requests/${request.id}`}>
                  상세 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
