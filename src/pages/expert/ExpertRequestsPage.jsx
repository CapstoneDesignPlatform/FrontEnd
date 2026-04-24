import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { EmptyState } from '../../components/common/EmptyState'
import { InfoBanner } from '../../components/common/InfoBanner'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { industries, requestTypes, regions } from '../../utils/constants'

export function ExpertRequestsPage() {
  const { state } = useAppContext()
  const expert = state.experts.find((item) => item.id === state.session.userId)
  const [filters, setFilters] = useState({
    type: '전체',
    industry: '전체',
    region: '전체',
    deadline: false,
    status: '전체',
    sort: 'latest',
  })

  const requests = useMemo(() => {
    let next = [...state.requests]
    if (filters.industry !== '전체') next = next.filter((request) => request.industrySlug === filters.industry)
    if (filters.type !== '전체') next = next.filter((request) => request.type === filters.type)
    if (filters.region !== '전체') next = next.filter((request) => request.region === filters.region)
    if (filters.deadline) next = next.filter((request) => new Date(request.deadline) <= new Date('2026-04-12'))
    if (filters.status !== '전체') next = next.filter((request) => request.status === filters.status)

    next.sort((a, b) => {
      if (filters.sort === 'deadline') return new Date(a.deadline) - new Date(b.deadline)
      if (filters.sort === 'budget') return (b.budgetMax || 0) - (a.budgetMax || 0)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return next
  }, [filters, state.requests])

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target
    setFilters((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div>
      <PageTitle eyebrow="Open Requests" title="공고 목록 확인" description="유형, 지역, 마감 임박, 진행 상태 기준으로 필터링하고 입찰 페이지로 이동할 수 있습니다." />
      {expert.verificationStatus !== 'approved' ? (
        <InfoBanner tone="warning">인증 승인 전에는 입찰 버튼이 비활성화됩니다.</InfoBanner>
      ) : null}
      <SectionCard title="필터 / 정렬">
        <div className="form-grid">
          <label>
            업종
            <select name="industry" value={filters.industry} onChange={handleFilterChange}>
              {['전체', ...industries.map((industry) => industry.slug)].map((industry) => (
                <option key={industry} value={industry}>
                  {industry === '전체' ? '전체' : industries.find((item) => item.slug === industry)?.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            공고 유형
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              {['전체', ...requestTypes].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            지역
            <select name="region" value={filters.region} onChange={handleFilterChange}>
              {['전체', ...regions].map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>
          <label>
            진행 상태
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              {['전체', 'bidding', 'selected', 'paid', 'in_progress', 'completed'].map((status) => (
                <option key={status} value={status}>
                  {status === '전체' ? '전체' : status}
                </option>
              ))}
            </select>
          </label>
          <label>
            정렬
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="latest">최신순</option>
              <option value="deadline">마감일순</option>
              <option value="budget">예산순</option>
            </select>
          </label>
          <label className="full">
            마감 임박
            <input checked={filters.deadline} name="deadline" type="checkbox" onChange={handleFilterChange} />
          </label>
        </div>
      </SectionCard>
      <SectionCard title="공고 리스트">
        {requests.length ? (
          <div className="card-list">
            {requests.map((request) => (
              <article className="list-card" key={request.id}>
                <div className="inline-actions" style={{ justifyContent: 'space-between' }}>
                  <div>
                      <h3>{request.title}</h3>
                      <p className="muted">
                      {request.code} · {request.industryLabel} · {request.region} · {request.type}
                      </p>
                    </div>
                  <StatusBadge type="request" value={request.status} />
                </div>
                <div className="list-card__meta">
                  <span>마감 {formatDate(request.deadline)}</span>
                  <span>예산 {formatCurrency(request.budgetMax)}</span>
                </div>
                <div className="inline-actions">
                  <Link className="button button--ghost" to={`/expert/requests/${request.id}`}>
                    상세 보기
                  </Link>
                  <Link
                    className="button"
                    to={`/expert/requests/${request.id}/bid`}
                    style={expert.verificationStatus !== 'approved' ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
                  >
                    입찰 제출
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="조건에 맞는 공고가 없습니다." description="필터를 조정해 다시 확인해주세요." />
        )}
      </SectionCard>
    </div>
  )
}
