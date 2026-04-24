import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ConfirmModal } from '../../components/common/ConfirmModal'
import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { getRecommendedBids } from '../../utils/recommendations'

export function ClientRequestSelectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, actions } = useAppContext()
  const [targetBidId, setTargetBidId] = useState('')
  const request = state.requests.find((item) => item.id === id && item.clientId === state.session.userId)
  const bids = state.bids.filter((bid) => bid.requestId === id)
  const recommended = useMemo(
    () => getRecommendedBids(bids, state.adminSettings.dumpingThresholdRatio),
    [bids, state.adminSettings.dumpingThresholdRatio],
  )

  if (!request) {
    return <EmptyState title="공고를 찾을 수 없습니다." description="잘못된 접근입니다." />
  }

  if (!bids.length) {
    return <EmptyState title="선택 가능한 입찰이 없습니다." description="입찰이 들어온 뒤 다시 확인해주세요." />
  }

  const handleSelect = async () => {
    await actions.selectExpert(request.id, targetBidId)
    setTargetBidId('')
    navigate(`/client/requests/${request.id}/payment`)
  }

  return (
    <div>
      <PageTitle eyebrow={request.code} title="전문가 선택" description="최저가 기준 추천 후보를 중심으로 최종 1명을 선택합니다." />
      <InfoBanner tone="warning">연락처를 통해 별도 협의를 진행하는 데모이며, 최종 가격은 최초 제시 가격 미만으로 조정하지 않는 흐름입니다.</InfoBanner>
      <SectionCard title="추천 후보">
        <div className="card-list">
          {recommended.map((bid) => {
            const expert = state.experts.find((item) => item.id === bid.expertId)
            return (
              <article className="list-card" key={bid.id}>
                <h3>
                  {expert.organization} / {expert.name}
                </h3>
                <p className="muted">
                  {expert.qualificationType} · 경력 {expert.careerYears}년
                </p>
                <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
                <p>{bid.message}</p>
                <button className="button" type="button" onClick={() => setTargetBidId(bid.id)}>
                  이 전문가 선택
                </button>
              </article>
            )
          })}
        </div>
      </SectionCard>
      <SectionCard title="전체 후보 보기">
        <div className="card-list">
          {bids
            .slice()
            .sort((a, b) => a.amount - b.amount)
            .map((bid) => {
              const expert = state.experts.find((item) => item.id === bid.expertId)
              return (
                <article className="list-card" key={bid.id}>
                  <h3>
                    {expert.organization} / {expert.name}
                  </h3>
                  <p className="muted">
                    {expert.qualificationType} · 경력 {expert.careerYears}년
                  </p>
                  <strong className="list-card__price">{formatCurrency(bid.amount)}</strong>
                  <p>{bid.message}</p>
                  <div className="inline-actions">
                    <button className="button button--ghost" type="button" onClick={() => setTargetBidId(bid.id)}>
                      이 후보 선택
                    </button>
                    <Link className="button button--ghost" to={`/client/requests/${request.id}/bids`}>
                      비교 화면
                    </Link>
                  </div>
                </article>
              )
            })}
        </div>
      </SectionCard>
      <ConfirmModal
        open={Boolean(targetBidId)}
        title="전문가를 선택할까요?"
        description="선택 후 결제 단계로 이동합니다. 외부 협의 후 최종 가격 확정 안내도 함께 표시됩니다."
        onCancel={() => setTargetBidId('')}
        onConfirm={handleSelect}
        confirmText="선택 확정"
      />
    </div>
  )
}
