import { Link } from 'react-router-dom'

import { SectionCard } from '../components/common/SectionCard'
import { industryCards } from '../config/industryConfigs'

const infoCards = [
  { title: '기업진단이 필요한 순간', description: '필요 면허, 실태 조사, 주기적 신고, 합병/양도 등 진단 사유별로 요청할 수 있습니다.' },
  { title: '입찰 비교와 전문가 선택', description: '전문가 제시 금액과 추천 후보를 비교하고, 외부 협의 후 결제 흐름으로 이어집니다.' },
  { title: '결제와 정산 흐름 확인', description: '에스크로 기반 구매안전 서비스 연계 예정 구조를 데모로 확인할 수 있습니다.' },
]

const teaserCards = [
  { title: '전문가 검색', description: '전문 분야와 자격별 전문가 탐색 기능을 준비 중입니다.', to: '/placeholder/expert-search' },
  { title: '커뮤니티', description: '업종별 질의응답과 자료 공유 공간을 준비 중입니다.', to: '/placeholder/community' },
  { title: '자료실', description: '기업진단 가이드와 체크리스트 아카이브를 준비 중입니다.', to: '/placeholder/support' },
]

const links = [
  ['국가법령정보센터', 'https://www.law.go.kr'],
  ['국토교통부', 'https://www.molit.go.kr'],
  ['한국공인회계사회', 'https://www.kicpa.or.kr'],
  ['한국세무사회', 'https://www.kacpta.or.kr'],
  ['한국경영기술지도사회', 'https://www.kmtca.or.kr'],
  ['대한건설협회', 'https://www.cak.or.kr'],
  ['전문건설협회', 'https://www.kosca.or.kr'],
]

export function LandingPage() {
  return (
    <div className="stack" style={{ display: 'grid', gap: '20px' }}>
      <section className="hero">
        <div className="hero__panel">
          <p className="page-title__eyebrow">기업진단 용역 입찰 매칭 플랫폼</p>
          <h1>진단 bid로 기업진단 의뢰부터 전문가 선택, 결제까지 한 번에</h1>
          <p>
            비회원 의뢰인도 바로 의뢰를 시작할 수 있고, 전문가는 인증 후 입찰에 참여할 수 있습니다.
            관리자 데모에서는 의뢰 코드별 조회와 덤핑 방지 기준 설정을 함께 확인할 수 있습니다.
          </p>
          <div className="hero__actions">
            <Link className="button" to="/guest/start">
              비회원으로 의뢰 시작
            </Link>
            <Link className="button button--ghost" to="/login">
              회원 로그인
            </Link>
            <Link className="button button--ghost" to="/login">
              관리자 데모
            </Link>
            <Link className="button button--ghost" to="/register/expert">
              전문가 참여
            </Link>
          </div>
        </div>
        <div className="hero__side">
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="muted">업종별 의뢰 등록</span>
              <strong>6개 업종</strong>
            </div>
            <div className="hero__stat">
              <span className="muted">비회원 조회</span>
              <strong>요청 코드 지원</strong>
            </div>
            <div className="hero__stat">
              <span className="muted">Mock Service Layer</span>
              <strong>async 데모</strong>
            </div>
          </div>
        </div>
      </section>

      <SectionCard title="공지 및 안내" description="실제 결제, 알림, 파일 업로드는 연동하지 않는 프론트엔드 MVP 데모입니다.">
        <div className="announcement-grid">
          <div className="announcement-card">
            <strong>비회원 의뢰 가능</strong>
            <p className="muted">회원가입 없이도 업종 선택 후 의뢰 등록과 요청 코드 조회가 가능합니다.</p>
          </div>
          <div className="announcement-card">
            <strong>전문가 인증 필요</strong>
            <p className="muted">전문가는 회원가입과 인증 승인 이후에만 입찰 버튼이 활성화됩니다.</p>
          </div>
          <div className="announcement-card">
            <strong>결제는 데모 시뮬레이션</strong>
            <p className="muted">에스크로/카드/가상계좌 UI만 제공되며 실제 PG 연동은 포함하지 않습니다.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="업종 카테고리" description="업종별 등록 페이지는 공통 폼 구조와 설정 데이터 방식으로 동작합니다.">
        <div className="industry-grid">
          {industryCards.map((industry) => (
            <Link className="industry-card" key={industry.slug} to={`/guest/start/${industry.slug}`}>
              <strong>{industry.label}</strong>
              <span>{industry.description}</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="서비스 설명 카드">
        <div className="grid-3">
          {infoCards.map((card) => (
            <article className="role-card" key={card.title}>
              <h3>{card.title}</h3>
              <p className="muted">{card.description}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="전문가 검색 / 커뮤니티 / 자료실">
        <div className="grid-3">
          {teaserCards.map((card) => (
            <article className="role-card" key={card.title}>
              <h3>{card.title}</h3>
              <p className="muted">{card.description}</p>
              <div className="inline-actions" style={{ marginTop: '16px' }}>
                <Link className="button button--ghost" to={card.to}>
                  자세히 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="배너 / 광고 영역">
        <div className="banner-placeholder">
          <strong>배너 Placeholder</strong>
          <p className="muted">파트너 기관 배너, 자료실 홍보, 전문가 모집 배너가 들어올 영역입니다.</p>
        </div>
      </SectionCard>

      <SectionCard title="외부기관 링크">
        <div className="link-grid">
          {links.map(([label, href]) => (
            <a key={label} className="external-link" href={href} rel="noreferrer" target="_blank">
              {label}
            </a>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
