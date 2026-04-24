import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { getAverageBidAmount, getRecommendedBids, isDumpingBid } from '../../utils/recommendations'

export function ClientRequestBidsPage() {
  const { id } = useParams()
  const { state, actions } = useAppContext()
  const request = state.requests.find((item) => item.id === id && item.clientId === state.session.userId)
  const bids = state.bids.filter((bid) => bid.requestId === id)
  const average = getAverageBidAmount(bids)
  const recommended = getRecommendedBids(bids, state.adminSettings.dumpingThresholdRatio)

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="잘못된 접근입니다." />
  }

  if (!bids.length) {
    return (
      <div>
        <PageTitle eyebrow={request.code} title="입찰 전문가 목록" description="아직 제출된 입찰이 없습니다." />
        <EmptyState title="입찰이 없습니다." description="전문가 입찰이 들어오면 이 화면에서 확인할 수 있습니다." />
      </div>
    )
  }

  const handleMarkRecommended = async () => {
    await actions.markShortlisted(
      request.id,
      recommended.map((item) => item.id),
    )
  }

  return (
    <div>
      <PageTitle
        eyebrow={request.code}
        title="입찰 전문가 목록"
        description="가격, 자격, 인증 상태를 비교하고 추천 후보를 확인할 수 있습니다."
        actions={
          <Link className="button" to={`/client/requests/${request.id}/select`}>
            선택 화면으로 이동
          </Link>
        }
      />
      <InfoBanner>
        평균 입찰가 {formatCurrency(average)} 기준으로 {Math.round(state.adminSettings.dumpingThresholdRatio * 100)}% 미만은 덤핑 의심으로 분류됩니다.
      </InfoBanner>
      <SectionCard
        title="추천 전문가"
        description="덤핑 의심을 제외한 최저가 기준 3~5명 추천입니다."
        actions={
          <button className="button button--ghost" type="button" onClick={handleMarkRecommended}>
            추천 후보 반영
          </button>
        }
      >
        <div className="card-list">
          {recommended.map((bid) => {
            const expert = state.experts.find((item) => item.id === bid.expertId)
            return (
              <article className="list-card" key={bid.id}>
                <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <h3>{expert.organization}</h3>
                    <p className="muted">
                      {expert.name} · {expert.qualificationType} · 경력 {expert.careerYears}년
                    </p>
                  </div>
                  <StatusBadge type="verification" value={expert.verificationStatus} />
                </div>
                <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
                <p className="muted">{expert.intro}</p>
              </article>
            )
          })}
        </div>
      </SectionCard>
      <SectionCard title="전체 입찰 리스트">
        <div className="card-list">
          {bids
            .slice()
            .sort((a, b) => a.amount - b.amount)
            .map((bid) => {
              const expert = state.experts.find((item) => item.id === bid.expertId)
              const dumping = isDumpingBid(bid.amount, average, state.adminSettings.dumpingThresholdRatio)
              return (
                <article className="list-card" key={bid.id}>
                  <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                    <div>
                      <h3>
                        {expert.name} / {expert.organization}
                      </h3>
                      <p className="muted">
                        {expert.qualificationType} · 경력 {expert.careerYears}년 · {expert.phone}
                      </p>
                    </div>
                    <div className="stack">
                      <StatusBadge type="bid" value={bid.status} />
                      {dumping ? <StatusBadge type="verification" value="rejected" /> : null}
                    </div>
                  </div>
                  <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
                  <p>{bid.message}</p>
                  {dumping ? (
                    <InfoBanner tone="warning">평균 대비 지나치게 낮은 가격으로 추천 리스트에서 제외됩니다.</InfoBanner>
                  ) : null}
                </article>
              )
            })}
        </div>
      </SectionCard>
    </div>
  )
}
