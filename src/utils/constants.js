export const STORAGE_KEY = 'service-platform-mvp'

export const requestStatusMeta = {
  draft: { label: '임시저장', tone: 'neutral' },
  posted: { label: '게시됨', tone: 'info' },
  bidding: { label: '입찰중', tone: 'info' },
  selecting: { label: '선정중', tone: 'warning' },
  selected: { label: '전문가 선택됨', tone: 'success' },
  awaiting_payment: { label: '결제대기', tone: 'warning' },
  paid: { label: '결제완료', tone: 'success' },
  in_progress: { label: '진행중', tone: 'info' },
  association_review: { label: '협회 경유', tone: 'info' },
  report_submitted: { label: '보고서 제출완료', tone: 'info' },
  completed: { label: '완료', tone: 'success' },
  settled: { label: '정산완료', tone: 'success' },
}

export const verificationStatusMeta = {
  pending: { label: '대기', tone: 'warning' },
  approved: { label: '승인', tone: 'success' },
  rejected: { label: '반려', tone: 'danger' },
}

export const bidStatusMeta = {
  submitted: { label: '입찰완료', tone: 'info' },
  shortlisted: { label: '추천후보', tone: 'warning' },
  selected: { label: '선택됨', tone: 'success' },
  rejected: { label: '미선정', tone: 'neutral' },
}

export const paymentStatusMeta = {
  unpaid: { label: '미결제', tone: 'warning' },
  escrow: { label: '에스크로보관중', tone: 'info' },
  paid: { label: '결제완료', tone: 'success' },
  refunded: { label: '환불', tone: 'danger' },
}

export const settlementStatusMeta = {
  pending: { label: '정산예정', tone: 'warning' },
  ready: { label: '정산대기', tone: 'info' },
  completed: { label: '정산완료', tone: 'success' },
}

export const requestTypes = ['필요 면허', '실태 조사', '기타']

export const businessEntityTypes = ['법인사업자', '개인사업자', '창업 예정']

export const requestReasons = ['자본금 변동', '양도', '합병']

export const currentIndustrySuggestions = [
  '건축공사업',
  '토목건축공사업',
  '실내건축공사업',
  '금속구조물창호온실공사업',
  '기계설비공사업',
  '정보통신공사업',
  '소방시설공사업',
]

export const otherIndustryOptions = [
  '문화재수리업',
  '산림사업',
  '국방부 기술용역 적격심사',
  '방송채널 사용사업',
  '인터넷 멀티미디어 방송사업',
]

export const processSteps = [
  '필요정보등록',
  '마감',
  '결제',
  '진단시작',
  '협회 경유',
  '작성 완료 및 발송',
  '수령',
]

export const qualificationTypes = ['공인회계사', '세무사', '경영지도사', '진단기관', '기타']

export const regions = ['서울', '경기', '인천', '대전', '부산', '광주', '대구', '울산']

export const industries = [
  { slug: 'construction', label: '건설업' },
  { slug: 'electrical', label: '전기공사업' },
  { slug: 'information-telecom', label: '정보통신공사업' },
  { slug: 'fire-facility', label: '소방시설공사업' },
  { slug: 'pharma-wholesale', label: '의약품도매상업' },
  { slug: 'other', label: '기타' },
]

export const paymentMethods = [
  { value: 'card', label: '카드' },
  { value: 'virtual-account', label: '가상계좌' },
  { value: 'escrow', label: '에스크로' },
]

export const expertProgressOptions = [
  { value: 'in_progress', label: '진행중' },
  { value: 'report_submitted', label: '보고서 제출완료' },
  { value: 'completed', label: '완료' },
]
