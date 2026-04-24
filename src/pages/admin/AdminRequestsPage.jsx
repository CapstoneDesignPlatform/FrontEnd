import { Link } from 'react-router-dom'

import { DataTable } from '../../components/common/DataTable'
import { PageTitle } from '../../components/common/PageTitle'
import { SectionCard } from '../../components/common/SectionCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { useAppContext } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'

export function AdminRequestsPage() {
  const { state } = useAppContext()

  const rows = state.requests.map((request) => ({
    ...request,
    clientName: state.clients.find((client) => client.id === request.clientId)?.companyName || '-',
  }))

  const columns = [
    { key: 'code', label: '의뢰 코드' },
    { key: 'industryLabel', label: '업종' },
    { key: 'title', label: '공고명' },
    { key: 'clientName', label: '의뢰인' },
    {
      key: 'status',
      label: '상태',
      render: (value) => <StatusBadge type="request" value={value} />,
    },
    {
      key: 'paymentStatus',
      label: '결제 상태',
      render: (value) => <StatusBadge type="payment" value={value} />,
    },
    {
      key: 'settlementStatus',
      label: '정산 상태',
      render: (value) => <StatusBadge type="settlement" value={value} />,
    },
    {
      key: 'createdAt',
      label: '등록일',
      render: (value) => formatDate(value),
    },
    {
      key: 'actions',
      label: '상세',
      render: (_, row) => (
        <Link className="button button--ghost" to={`/admin/requests/${row.code}`}>
          상세 조회
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageTitle eyebrow="Admin Requests" title="의뢰 목록" description="의뢰 코드 단위로 전체 흐름을 조회하고 상세 화면으로 이동합니다." />
      <SectionCard title="의뢰 전체 목록">
        <DataTable columns={columns} rows={rows} />
      </SectionCard>
    </div>
  )
}
