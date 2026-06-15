# Expert API Contract v2

이 문서는 `serviceplatform` 전문가 파트 프론트엔드와 백엔드 연동을 위한 API 계약입니다.
`/Users/imin-yeong/Downloads/expert-api-contract-v2.md`를 기준으로 현재 의뢰 코드에 맞게 정리했습니다.

## Frontend API Mode

프론트는 mock adapter와 HTTP adapter를 분리합니다.

```text
VITE_API_MODE=mock
VITE_API_MODE=http
VITE_API_BASE_URL=/api
```

- 로컬 개발 기본값은 `mock`입니다.
- 프로덕션 빌드 기본값은 `http`입니다.
- `http` 모드에서는 `?status=APPROVED` 같은 개발용 인증 상태 override를 사용하지 않습니다.
- UI 컴포넌트는 기존 함수명을 유지하고, `src/api/*HttpApi.ts`와 DTO mapper에서 백엔드 계약을 흡수합니다.

## API Namespace

```text
POST   /api/auth/signup
GET    /api/expert/me/profile
PATCH  /api/expert/me/profile
GET    /api/expert/me/verification-status
POST   /api/expert/me/verification-requests
GET    /api/expert/me/bids
GET    /api/expert/me/dashboard                # optional

GET    /api/expert/job-posts
GET    /api/expert/job-posts/{announcement_code}
POST   /api/expert/job-posts/{announcement_code}/bids

POST   /api/files
GET    /api/files/{file_id}/download-url        # optional
```

## Shared Rules

- `POST /api/auth/signup`를 제외한 전문가 API는 인증된 전문가 사용자 기준입니다.
- `expert_profile_id`는 request body/query에서 받지 않고 서버의 auth context에서 추론합니다.
- 인증되지 않은 요청은 `401 UNAUTHORIZED`를 반환합니다.
- 전문가 권한이 없거나 승인 전 제한된 API 접근은 `403 FORBIDDEN` 또는 `403 EXPERT_NOT_APPROVED`를 반환합니다.
- 날짜/시간은 ISO 8601 문자열을 사용합니다.
- 금액과 통계는 원 단위 `number`로 내려주고 프론트에서 포맷팅합니다.
- 목록 API는 `page`, `size`, `total_count`, `total_pages`, `has_next`를 포함할 수 있습니다.

## Enums

```ts
type ExpertVerificationStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type JobPostStatusCode =
  | "ACTIVE"
  | "CLOSED"
  | "CANCELLED";

type BidStatusCode =
  | "PENDING"
  | "SELECTED"
  | "REJECTED";

type JobPostTypeCode =
  | "LICENSE"
  | "SURVEY"
  | "PERIODIC_REPORT"
  | "ETC";
```

`JobPostTypeCode`는 API 코드 enum입니다. 프론트 mapper에서 아래 한글 라벨로 변환합니다.

| API code | Korean label |
| --- | --- |
| `LICENSE` | 필요 면허 |
| `SURVEY` | 실태 조사 |
| `PERIODIC_REPORT` | 주기적 신고 |
| `ETC` | 기타 |

## Error Shape

```json
{
  "code": "VALIDATION_ERROR",
  "message": "입력값을 확인해주세요.",
  "details": {
    "bid_amount": "입찰 금액은 1원 이상이어야 합니다."
  }
}
```

권장 코드:

| HTTP | code |
| --- | --- |
| 400 | `VALIDATION_ERROR` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 403 | `EXPERT_NOT_APPROVED` |
| 404 | `NOT_FOUND` |
| 409 | `DUPLICATE_EMAIL` |
| 409 | `DUPLICATE_BID` |
| 409 | `ALREADY_VERIFICATION_PENDING` |
| 409 | `ALREADY_VERIFIED` |
| 409 | `JOB_POST_CLOSED` |
| 413 | `FILE_TOO_LARGE` |
| 415 | `UNSUPPORTED_FILE_TYPE` |

## Endpoints

### 1. Expert Signup

```http
POST /api/auth/signup
```

Request:

```json
{
  "userType": "EXPERT",
  "name": "홍길동",
  "email": "expert@example.com",
  "phone": "01012345678",
  "password": "Password1!",
  "businessName": "케이법무법인"
}
```

Response:

```json
{
  "user": {
    "id": 101,
    "name": "홍길동",
    "email": "expert@example.com",
    "phone": "01012345678"
  },
  "expert_profile": {
    "id": 1,
    "user_id": 101,
    "company_name": "케이법무법인",
    "is_verified": false,
    "stats": {
      "active_bids": 0,
      "selected_count": 0,
      "completed_projects": 0,
      "total_earned": 0
    }
  }
}
```

토큰 정책:

- 자동 로그인 정책이면 `accessToken`/`refreshToken` 또는 인증 쿠키를 함께 발급합니다.
- 자동 로그인하지 않는 정책이면 `loginRequired: true`를 명확히 반환합니다.

### 2. Get My Expert Profile

```http
GET /api/expert/me/profile
```

Response:

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
    "is_verified": true,
    "stats": {
      "active_bids": 4,
      "selected_count": 2,
      "completed_projects": 8,
      "total_earned": 24500000
    }
  }
}
```

### 3. Update My Expert Profile

```http
PATCH /api/expert/me/profile
```

Request:

```json
{
  "name": "전문가",
  "phone": "010-1234-5678",
  "company_name": "케이법무법인"
}
```

Response: `GET /api/expert/me/profile`과 동일합니다.

정책:

- `email`은 이 API에서 수정하지 않습니다.
- `license_type`, `expertise_areas`, `portfolio`는 프로필 응답/수정 계약에서 제외합니다.
- 자격 종류, 자격 번호, 발급일, 인증 첨부 파일은 인증 심사 플로우에서 관리합니다.

### 4. Get Expert Verification Status

```http
GET /api/expert/me/verification-status
```

Approved response:

```json
{
  "verification_request": {
    "id": 1,
    "status": "APPROVED",
    "specialty": "경영지도사",
    "license_number": "EXP-2026-001",
    "issue_date": "2020-03-15",
    "company_name": "케이법무법인",
    "certificates": [
      {
        "certificate_name": "경영지도사",
        "license_number": "EXP-2026-001",
        "issue_date": "2020-03-15",
        "holder_name": "홍길동",
        "file_id": 1,
        "file_name": "license.pdf"
      }
    ],
    "business_license": {
      "business_number": "123-45-67890",
      "owner_name": "홍길동",
      "company_name": "케이법무법인",
      "file_id": 2,
      "file_name": "business-license.pdf"
    },
    "submitted_at": "2026-04-05T10:00:00+09:00",
    "reviewed_at": "2026-04-06T15:00:00+09:00",
    "rejected_reason": null
  }
}
```

Not applied response:

```json
{
  "verification_request": {
    "id": null,
    "status": "NOT_APPLIED",
    "specialty": null,
    "license_number": null,
    "issue_date": null,
    "company_name": null,
    "certificates": [],
    "business_license": null,
    "submitted_at": null,
    "reviewed_at": null,
    "rejected_reason": null
  }
}
```

### 5. Submit Expert Verification

```http
POST /api/expert/me/verification-requests
```

Request:

```json
{
  "specialty": "경영지도사",
  "certificates": [
    {
      "certificate_name": "경영지도사",
      "license_number": "EXP-2026-001",
      "issue_date": "2020-03-15",
      "holder_name": "홍길동",
      "file_id": 1
    }
  ],
  "business_license": {
    "business_number": "123-45-67890",
    "owner_name": "홍길동",
    "company_name": "케이법무법인",
    "file_id": 2
  }
}
```

정책:

- request body에 `expert_profile_id`를 포함하지 않습니다.
- `PENDING`이면 `409 ALREADY_VERIFICATION_PENDING`을 반환합니다.
- `APPROVED`이면 `409 ALREADY_VERIFIED`를 반환합니다.
- `REJECTED` 재신청은 새 인증 신청 row 생성을 권장합니다.

### 6. Upload Verification Files

```http
POST /api/files
```

Request: `multipart/form-data`

```text
file: <binary>
purpose: EXPERT_VERIFICATION
```

Response:

```json
{
  "file": {
    "id": 1,
    "original_name": "license.pdf",
    "stored_name": "2026/04/license-uuid.pdf",
    "mime_type": "application/pdf",
    "size": 123456,
    "purpose": "EXPERT_VERIFICATION",
    "created_at": "2026-04-15T10:00:00+09:00"
  }
}
```

### 7. Get Expert Job List

```http
GET /api/expert/job-posts
```

Query:

```text
status=BIDDING
keyword=건설
job_type=LICENSE
industry=건설업
page=1
size=20
sort=posted_at_desc
```

Response:

```json
{
  "items": [
    {
      "id": 1,
      "announcement_code": "01012345678AB",
      "company_id": 1,
      "company_name": "(주)건설개발",
      "title": "건설업 일반건설업(토목) 신규 면허 취득",
      "industry": "건설업",
      "job_type": "LICENSE",
      "job_type_label": "필요 면허",
      "business_type": "법인 사업자",
      "classification": "신규 등록",
      "required_license": "일반건설업(토목공사업)",
      "capital": 5,
      "capital_scale": 50,
      "bid_count": 5,
      "posted_at": "2026-04-01T09:00:00+09:00",
      "is_new": true,
      "status": "ACTIVE",
      "has_my_bid": false
    }
  ],
  "page": 1,
  "size": 20,
  "total_count": 1,
  "total_pages": 1,
  "has_next": false
}
```

### 8. Get Expert Job Detail

```http
GET /api/expert/job-posts/{announcement_code}
```

Response는 `JobPostListItemDto`의 상세 정보에 `company`, `created_at`, `my_bid`를 추가합니다.

```json
{
  "id": 1,
  "announcement_code": "01012345678AB",
  "company_id": 1,
  "company_name": "(주)건설개발",
  "title": "건설업 일반건설업(토목) 신규 면허 취득",
  "industry": "건설업",
  "job_type": "LICENSE",
  "job_type_label": "필요 면허",
  "business_type": "법인 사업자",
  "bid_count": 5,
  "posted_at": "2026-04-01T09:00:00+09:00",
  "created_at": "2026-04-01T09:00:00+09:00",
  "is_new": true,
  "status": "ACTIVE",
  "company": {
    "id": 1,
    "name": "(주)건설개발",
    "representative": "김철수",
    "location": "서울특별시 강남구"
  },
  "my_bid": null
}
```

### 9. Create Bid

```http
POST /api/expert/job-posts/{announcement_code}/bids
```

Request:

```json
{
  "bid_amount": 2500000
}
```

Response:

```json
{
  "id": 1,
  "announcement_code": "01012345678AB",
  "bid_amount": 2500000,
  "status": "PENDING",
  "submitted_at": "2026-04-15T10:00:00+09:00",
  "total_bid_count": 6
}
```

정책:

- request body에 `job_post_id` 또는 `expert_profile_id`를 포함하지 않습니다.
- 같은 전문가가 같은 의뢰에 중복 입찰하면 `409 DUPLICATE_BID`를 반환합니다.
- 의뢰 상태가 `BIDDING`이 아니면 `409 JOB_POST_CLOSED`를 반환합니다.

### 10. Get My Bids

```http
GET /api/expert/me/bids
```

Response:

```json
{
  "items": [
    {
      "id": 1,
      "announcement_id": 1,
      "announcement_code": "01012345678AB",
      "job_post_title": "건설업 일반건설업(토목) 신규 면허 취득",
      "bid_amount": 2500000,
      "status": "SELECTED",
      "submitted_at": "2026-04-05T10:00:00+09:00",
      "total_bid_count": 5,
      "client_contact": {
        "name": "김담당",
        "phone": "010-1111-2222",
        "email": "client@example.com"
      }
    }
  ],
  "page": 1,
  "size": 20,
  "total_count": 1,
  "total_pages": 1,
  "has_next": false
}
```

`client_contact`는 `SELECTED` 상태에서만 객체로 내려주고, 그 외 상태는 `null`을 권장합니다.

## Frontend Migration Notes

- HTTP adapter 경로는 `/api/expert/me/**` 기준입니다.
- API의 `JobPostTypeCode`는 mapper에서 한글 라벨 ViewModel로 변환합니다.
- 프로필 수정 payload는 BE4 기준 `name`, `phone`, `company_name`만 보냅니다.
- 인증 미신청 상태의 `verification_request.id === null`은 정상 케이스입니다.
- 입찰 생성 payload는 `bid_amount`만 보냅니다.
- 내 입찰의 `client_contact`는 문자열이 아니라 객체 또는 `null`입니다.
- 공고 상세/입찰 생성 path에는 숫자 id가 아니라 `announcement_code`를 사용합니다.
