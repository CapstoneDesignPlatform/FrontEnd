import {
  businessEntityTypes,
  currentIndustrySuggestions,
  otherIndustryOptions,
  requestReasons,
} from '../utils/constants'

const commonTabs = ['필요 면허', '실태 조사', '기타']

export const industryConfigs = {
  construction: {
    slug: 'construction',
    label: '건설업',
    description: '건설업 기업진단, 필요 면허, 실태 조사 의뢰를 등록합니다.',
    tabs: commonTabs,
    licenseOptions: ['건축공사업', '토목공사업', '실내건축공사업', '조경공사업'],
    currentIndustryMode: 'autocomplete',
    currentIndustryOptions: currentIndustrySuggestions,
  },
  electrical: {
    slug: 'electrical',
    label: '전기공사업',
    description: '전기공사업은 주기적 신고 탭이 추가됩니다.',
    tabs: ['필요 면허', '주기적 신고', '실태 조사', '기타'],
    licenseOptions: ['전기공사업'],
    currentIndustryMode: 'autocomplete',
    currentIndustryOptions: ['전기공사업', ...currentIndustrySuggestions],
  },
  'information-telecom': {
    slug: 'information-telecom',
    label: '정보통신공사업',
    description: '정보통신공사업 면허 및 진단 관련 의뢰를 등록합니다.',
    tabs: commonTabs,
    licenseOptions: ['정보통신공사업'],
    currentIndustryMode: 'autocomplete',
    currentIndustryOptions: ['정보통신공사업', ...currentIndustrySuggestions],
  },
  'fire-facility': {
    slug: 'fire-facility',
    label: '소방시설공사업',
    description: '소방시설공사업 실태 조사와 필요 면허 의뢰를 등록합니다.',
    tabs: commonTabs,
    licenseOptions: ['소방시설공사업'],
    currentIndustryMode: 'autocomplete',
    currentIndustryOptions: ['소방시설공사업', ...currentIndustrySuggestions],
  },
  'pharma-wholesale': {
    slug: 'pharma-wholesale',
    label: '의약품도매상업',
    description: '의약품도매상업 등록 준비와 실태 조사 의뢰를 등록합니다.',
    tabs: commonTabs,
    licenseOptions: ['의약품도매상업'],
    currentIndustryMode: 'autocomplete',
    currentIndustryOptions: ['의약품도매상업', '없음'],
  },
  other: {
    slug: 'other',
    label: '기타',
    description: '특수 업종 또는 기타 진단 사유 의뢰를 등록합니다.',
    tabs: commonTabs,
    licenseOptions: otherIndustryOptions,
    currentIndustryMode: 'select',
    currentIndustryOptions: otherIndustryOptions,
  },
}

export const industryCards = Object.values(industryConfigs).map((config) => ({
  slug: config.slug,
  label: config.label,
  description: config.description,
}))

export const getIndustryConfig = (slug) => industryConfigs[slug] || industryConfigs.construction

export const businessTypeOptions = businessEntityTypes
export const diagnosticReasonOptions = requestReasons
