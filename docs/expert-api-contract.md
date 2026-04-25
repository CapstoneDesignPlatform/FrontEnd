# Expert API Contract Draft

이 문서는 전문가 파트 프론트엔드가 백엔드 API와 연결될 때 필요한 계약 초안입니다.
현재 코드는 mock DTO를 `src/api/expert.ts`에서 읽고, `src/api/expertMappers.ts`에서 화면용 ViewModel로 바꿔 사용합니다.

## Data Flow By Page

| Page | Reads | Writes | Current API Function | ERD Tables |
| --- | --- | --- | --- | --- |
| `ExpertSignup` | 없음 | 전문가 회원가입 입력값 | `registerExpert()` | `users`, `expert_profiles` |
| `ExpertVerification` | 현재 인증 상태 | 인증 신청 정보, 첨부 파일 id | `getExpertVerificationStatus()`, `submitExpertVerification()` | `expert_profiles`, `expert_verification_requests`, `expert_certificates`, `expert_verification_files`, `files` |
| `ExpertVerificationStatus` | 인증 요청 상태, 반려 사유 | 없음 | `getExpertVerificationStatus()` | `expert_profiles`, `expert_verification_requests` |
| `ProjectListExpert` | 전문가가 볼 수 있는 공고 목록 | 없음 | `getExpertJobs()` | `job_posts`, `companies`, `bids` |
| `ProjectDetailExpert` | 공고 상세, 회사 요약 | 입찰 생성 | `getExpertJobDetail()`, `createBid()` | `job_posts`, `companies`, `bids`, `expert_profiles` |
| `MyBids` | 내 입찰 목록 | 연락처 복사만 로컬 동작 | `getMyBids()` | `bids`, `job_posts`, `companies` |
| `ExpertProfile` | 전문가 프로필 | 전문가 프로필 수정 | `getExpertProfile()`, `updateExpertProfile()` | `users`, `expert_profiles`, `expert_certificates` |
| `ExpertDashboard` | 전문가 프로필 통계, 최근 입찰 | 없음 | `getExpertProfile()`, `getMyBids()` | `expert_profiles`, `bids`, `job_posts` |

## API Draft

### 1. Expert Signup

`POST /api/auth/signup/expert`

Request draft:

```json
{
  "name": "홍길동",
  "email": "expert@example.com",
  "password": "password",
  "phone": "010-0000-0000"
}
```

Response draft:

```json
{
  "user": {
    "id": 101,
    "name": "홍길동",
    "email": "expert@example.com",
    "phone": "010-0000-0000"
  },
  "expert_profile": {
    "id": 1,
    "user_id": 101,
    "verification_status": "NOT_APPLIED",
    "is_verified": false
  }
}
```

Tables: `users`, `expert_profiles`

### 2. Submit Expert Verification

`POST /api/experts/me/verification-requests`

Request draft:

```json
{
  "expert_profile_id": 1,
  "license_type": "경영지도사",
  "license_number": "EXP-2026-001",
  "issue_date": "2020-03-15",
  "company_name": "케이법무법인",
  "portfolio": "건설업 신규 면허 120건",
  "file_ids": [1, 2]
}
```

Response draft:

```json
{
  "verification_request": {
    "id": 1,
    "expert_profile_id": 1,
    "status": "PENDING",
    "submitted_at": "2026-04-15"
  }
}
```

Tables: `expert_verification_requests`, `expert_certificates`, `expert_verification_files`, `files`

### 3. Get Expert Verification Status

`GET /api/experts/me/verification-status`

Response draft:

```json
{
  "verification_request": {
    "id": 1,
    "expert_profile_id": 1,
    "status": "APPROVED",
    "license_type": "경영지도사",
    "license_number": "EXP-2026-001",
    "issue_date": "2020-03-15",
    "company_name": "케이법무법인",
    "submitted_at": "2026-04-05",
    "reviewed_at": "2026-04-06",
    "rejected_reason": null
  }
}
```

Tables: `expert_profiles`, `expert_verification_requests`

### 4. Get Expert Job List

`GET /api/expert/job-posts`

Response draft:

```json
{
  "items": [
    {
      "id": 1,
      "company_id": 1,
      "company_name": "(주)건설개발",
      "title": "건설업 일반건설업(토목) 신규 면허 취득",
      "industry": "건설업",
      "job_type": "필요 면허",
      "business_type": "법인 사업자",
      "required_license": "일반건설업(토목공사업)",
      "asset_scale_label": "50억원",
      "bid_count": 5,
      "posted_at": "2026-04-01T09:00:00+09:00",
      "is_new": true,
      "status": "BIDDING"
    }
  ]
}
```

Tables: `job_posts`, `companies`, `bids`

### 5. Get Expert Job Detail

`GET /api/expert/job-posts/{job_post_id}`

Response draft:

```json
{
  "id": 1,
  "company_id": 1,
  "title": "건설업 일반건설업(토목) 신규 면허 취득",
  "industry": "건설업",
  "job_type": "필요 면허",
  "business_type": "법인 사업자",
  "bid_count": 5,
  "created_at": "2026-04-01T09:00:00+09:00",
  "status": "BIDDING",
  "company": {
    "id": 1,
    "name": "(주)건설개발",
    "representative": "김철수",
    "location": "서울특별시 강남구"
  }
}
```

Tables: `job_posts`, `companies`, `bids`

### 6. Create Bid

`POST /api/expert/job-posts/{job_post_id}/bids`

Request draft:

```json
{
  "job_post_id": 1,
  "bid_amount": 2500000
}
```

Response draft:

```json
{
  "bid": {
    "id": 1,
    "job_post_id": 1,
    "job_post_title": "건설업 일반건설업(토목) 신규 면허 취득",
    "bid_amount": 2500000,
    "status": "PENDING",
    "submitted_at": "2026-04-15T10:00:00+09:00",
    "total_bid_count": 6
  }
}
```

Tables: `bids`, `job_posts`, `expert_profiles`

### 7. Get My Bids

`GET /api/experts/me/bids`

Response draft:

```json
{
  "items": [
    {
      "id": 1,
      "job_post_id": 1,
      "job_post_title": "건설업 일반건설업(토목) 신규 면허 취득",
      "bid_amount": 2500000,
      "status": "PENDING",
      "submitted_at": "2026-04-05T10:00:00+09:00",
      "total_bid_count": 5,
      "client_contact": null
    }
  ]
}
```

Tables: `bids`, `job_posts`, `companies`

### 8. Get And Update Expert Profile

`GET /api/experts/me/profile`

`PATCH /api/experts/me/profile`

Update request draft:

```json
{
  "name": "전문가",
  "email": "expert@example.com",
  "phone": "010-1234-5678",
  "company_name": "케이법무법인",
  "license_type": "경영지도사",
  "license_number": "EXP-2026-001",
  "expertise_areas": ["건설업 인허가"],
  "experience_years": 10,
  "education": "한국대학교 경영학과",
  "introduction": "건설업 인허가 업무를 지원합니다.",
  "portfolio": "신규 면허 120건 수행"
}
```

Response draft:

```json
{
  "user": {
    "id": 101,
    "name": "전문가",
    "email": "expert@example.com",
    "phone": "010-1234-5678"
  },
  "expert_profile": {
    "id": 1,
    "user_id": 101,
    "company_name": "케이법무법인",
    "license_type": "경영지도사",
    "license_number": "EXP-2026-001",
    "expertise_areas": ["건설업 인허가"],
    "experience_years": 10,
    "verification_status": "APPROVED",
    "is_verified": true,
    "stats": {
      "active_bids": 4,
      "won_projects": 2,
      "completed_projects": 8,
      "total_earned_label": "₩24,500,000"
    }
  }
}
```

Tables: `users`, `expert_profiles`, `expert_certificates`

## Open Questions For Backend

1. 인증 상태의 source of truth는 `expert_profiles.is_verified`인지, `expert_verification_requests.status`인지 확인이 필요합니다.
2. 반려 사유 필드 이름은 `rejected_reason`, `reject_reason`, `review_comment` 중 무엇인지 확정이 필요합니다.
3. 인증 요청 재신청 시 기존 요청을 갱신하는지, 새 요청 row를 생성하고 이전 요청과 연결하는지 확인이 필요합니다.
4. 입찰 상태 enum 값은 `PENDING`, `SELECTED`, `REJECTED`로 충분한지 확인이 필요합니다.
5. `job_posts.status` enum 값은 `BIDDING`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`로 충분한지 확인이 필요합니다.
6. 로그인 후 현재 사용자와 `expert_profiles`를 연결하는 방식이 `users.id` 기준인지, 별도 expert profile id를 토큰에 넣는지 확인이 필요합니다.
7. 파일 업로드 방식은 먼저 업로드 후 `file_id`를 받는 방식인지, 인증 신청 요청과 함께 multipart로 보내는 방식인지 확인이 필요합니다.
8. 공고 목록에서 전문가가 볼 수 없는 상태의 공고를 백엔드에서 필터링하는지, 프론트에서 필터링해야 하는지 확인이 필요합니다.
9. 입찰 금액 단위는 원 단위 정수인지, VAT 포함 여부가 별도 필드로 필요한지 확인이 필요합니다.
