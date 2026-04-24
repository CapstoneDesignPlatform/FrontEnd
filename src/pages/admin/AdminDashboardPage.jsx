import { Link } from 'react-router-dom'

import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { SummaryCard } from '../../components/common/SummaryCard'
import { useAppContext } from '../../context/AppContext'

export function AdminDashboardPage() {
  const { state, actions } = useAppContext()

  const stats = [
    { label: '총 공고 수', value: `${state.requests.length}` },
    { label: '총 전문가 수', value: `${state.experts.length}` },
    {
      label: '승인 대기 전문가',
      value: `${state.experts.filter((expert) => expert.verificationStatus === 'pending').length}`,
    },
    {
      label: '결제 진행 건수',
      value: `${state.requests.filter((request) => ['paid', 'in_progress', 'report_submitted'].includes(request.status)).length}`,
    },
    {
      label: '정산 대기 건수',
      value: `${state.requests.filter((request) => request.settlementStatus === 'ready').length}`,
    },
  ]

  return (
    <div>
      <PageTitle
        eyebrow="Admin Dashboard"
        title="관리자 대시보드"
        description="의뢰 전체 흐름과 인증 승인, 덤핑 방지 기준을 한 곳에서 관리합니다."
        actions={
          <button
            className="button button--ghost"
            type="button"
            onClick={async () => {
              await actions.resetDemoData()
            }}
          >
            데모 데이터 초기화
          </button>
        }
      />
      <div className="grid-4">
        {stats.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
      <SectionCard title="빠른 이동">
        <div className="inline-actions">
          <Link className="button button--ghost" to="/admin/requests">
            의뢰 목록
          </Link>
          <Link className="button button--ghost" to="/admin/experts">
            전문가 인증 관리
          </Link>
          <Link className="button button--ghost" to="/admin/settings">
            덤핑/수수료 설정
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}
