import { Link } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { sortByNewest } from '../../utils/helpers'

export function ClientRequestsPage() {
  const { state } = useAppContext()
  const requests = sortByNewest(state.requests.filter((request) => request.clientId === state.session.userId))

  return (
    <div>
      <PageTitle
        eyebrow="My Requests"
        title="내가 등록한 공고 목록"
        description="상태별로 공고를 확인하고 입찰, 선택, 결제, 진행 단계로 이동할 수 있습니다."
        actions={
          <Link className="button" to="/client/requests/new/construction">
            공고 등록
          </Link>
        }
      />
      <SectionCard title="공고 리스트">
        {requests.length ? (
          <div className="card-list">
            {requests.map((request) => (
              <article className="list-card" key={request.id}>
                <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <h3>{request.title}</h3>
                    <p className="muted">
                      {request.code} · {request.type} · {request.region}
                    </p>
                  </div>
                  <StatusBadge type="request" value={request.status} />
                </div>
                <div className="list-card__meta">
                  <span>마감 {formatDate(request.deadline)}</span>
                  <span>예산 {formatCurrency(request.budgetMax)}</span>
                </div>
                <div className="inline-actions">
                  <Link className="button button--ghost" to={`/client/requests/${request.id}`}>
                    상세
                  </Link>
                  <Link className="button button--ghost" to={`/client/requests/${request.id}/bids`}>
                    입찰 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="등록한 공고가 없습니다."
            description="첫 공고를 등록하고 전문가 입찰을 받아보세요."
            action={
              <Link className="button" to="/client/requests/new/construction">
                공고 등록
              </Link>
            }
          />
        )}
      </SectionCard>
    </div>
  )
}
