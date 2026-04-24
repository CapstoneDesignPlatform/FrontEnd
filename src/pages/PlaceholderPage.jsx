import { PageTitle } from '../components/common/PageTitle'
import { SectionCard } from '../components/common/SectionCard'

export function PlaceholderPage({ title, description }) {
  return (
    <div>
      <PageTitle eyebrow="Coming Soon" title={title} description={description} />
      <SectionCard title="추후 제공 예정" description="현재 MVP에서는 화면 구조와 진입 흐름만 확인할 수 있습니다.">
        <p className="muted">이 메뉴는 실제 서비스 단계에서 확장될 예정입니다.</p>
      </SectionCard>
    </div>
  )
}
