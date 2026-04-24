import { Link } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'

export function ExpertBidsPage() {
  const { state } = useAppContext()
  const bids = state.bids.filter((bid) => bid.expertId === state.session.userId)

  return (
    <div>
      <PageTitle eyebrow="My Bids" title="내가 입찰한 목록" description="입찰 완료, 선택 대기, 선택됨 상태와 연결된 작업 화면을 확인할 수 있습니다." />
      <SectionCard title="입찰 내역">
        {bids.length ? (
          <div className="card-list">
            {bids.map((bid) => {
              const request = state.requests.find((item) => item.id === bid.requestId)
              return (
                <article className="list-card" key={bid.id}>
                  <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <h3>{request?.title}</h3>
                      <p className="muted">{request?.code}</p>
                    </div>
                    <StatusBadge type="bid" value={bid.status} />
                  </div>
                  <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
                  <p>{bid.message}</p>
                  <div className="inline-actions">
                    <Link className="button button--ghost" to={`/expert/requests/${request?.id}`}>
                      공고 상세
                    </Link>
                    {bid.status === 'selected' ? (
                      <Link className="button" to={`/expert/jobs/${request?.id}`}>
                        수주 작업 보기
                      </Link>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState title="입찰 내역이 없습니다." description="공고 목록에서 첫 입찰을 제출해보세요." />
        )}
      </SectionCard>
    </div>
  )
}
