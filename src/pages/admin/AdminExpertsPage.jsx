import { useState } from 'react'

import { DataTable } from '../../components/common/DataTable'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'

export function AdminExpertsPage() {
  const { state, actions } = useAppContext()
  const [filter, setFilter] = useState('전체')

  const experts = state.experts.filter((expert) =>
    filter === '전체' ? true : expert.verificationStatus === filter,
  )

  const columns = [
    { key: 'organization', label: '업체명' },
    { key: 'name', label: '이름' },
    { key: 'qualificationType', label: '자격 유형' },
    {
      key: 'verificationStatus',
      label: '인증 상태',
      render: (value) => <StatusBadge type="verification" value={value} />,
    },
    {
      key: 'actions',
      label: '승인/반려',
      render: (_, row) => (
        <div className="inline-actions">
          <button
            className="button button--ghost"
            type="button"
            onClick={async () => {
              await actions.reviewExpertVerification(row.id, 'approved')
            }}
          >
            승인
          </button>
          <button
            className="button button--danger"
            type="button"
            onClick={async () => {
              await actions.reviewExpertVerification(row.id, 'rejected')
            }}
          >
            반려
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageTitle eyebrow="Expert Approval" title="전문가 인증 관리" description="상태 필터로 대기/승인/반려 전문가를 조회하고 인증 상태를 변경합니다." />
      <SectionCard title="상태 필터">
        <div className="pill-tabs">
          {['전체', 'pending', 'approved', 'rejected'].map((item) => (
            <button key={item} className={filter === item ? 'active' : ''} type="button" onClick={() => setFilter(item)}>
              {item === '전체' ? '전체' : item}
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="전문가 목록">
        <DataTable columns={columns} rows={experts} />
      </SectionCard>
    </div>
  )
}
