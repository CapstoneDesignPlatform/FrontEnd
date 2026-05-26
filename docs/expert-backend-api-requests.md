# 전문가 API 백엔드 논의 필요 항목

이 문서는 `Bid_BE4` 기준으로 프론트에서 억지로 맞추기보다 백엔드와 정책을 먼저 확정해야 하는 항목을 정리합니다.

## 1. 인증 상태 조회에서 enum 상태 제공 필요

상세 전달 문서: [expert-verification-status-backend-request.md](./expert-verification-status-backend-request.md)

현재 백엔드:

```http
GET /api/expert/me/verification-status
```

현재 응답의 `verification_request.status`는 `is_verified` 기반 boolean입니다.

```json
{
  "verification_request": {
    "id": 1,
    "status": false
  }
}
```

프론트는 임시로 아래처럼 해석하고 있습니다.

| 백엔드 값 | 프론트 임시 해석 |
| --- | --- |
| `status: true` | `APPROVED` |
| `status: false`, `id: null` | `NOT_APPLIED` |
| `status: false`, `id 있음` | `PENDING` |

문제는 `REJECTED`를 구분할 수 없다는 점입니다. 관리자 승인/반려 플로우까지 사용할 경우 아래처럼 enum 상태를 별도 필드로 내려주는 방향을 요청합니다.

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "verification_status": "REJECTED",
    "rejected_reason": "서류 식별이 어렵습니다."
  }
}
```

요청:

- `verification_status`: `NOT_SUBMITTED | PENDING | APPROVED | REJECTED`
- 가능하면 프론트 표준값에 맞춰 `NOT_SUBMITTED` 대신 `NOT_APPLIED`도 검토
- `REJECTED`일 때 반려 사유 필드 제공

## 2. 입찰 수정 API 제공 여부 확정 필요

현재 BE4에는 입찰 생성 API만 있습니다.

```http
POST /api/expert/job-posts/{announcementCode}/bids
```

프론트는 현재 중복 제출을 막기 위해 이미 입찰한 공고에서는 `입찰 완료`로 표시하고 수정 버튼을 비활성화했습니다.

서비스 정책상 입찰가 수정이 필요하다면 아래 API를 백엔드에서 제공해야 합니다.

```http
PATCH /api/expert/job-posts/{announcementCode}/bids
Content-Type: application/json
```

Request:

```json
{
  "bid_amount": 3500000
}
```

권장 검증:

- 로그인 전문가 본인의 기존 입찰만 수정 가능
- `PENDING` 상태 입찰만 수정 가능
- 공고가 `ACTIVE`가 아니면 수정 불가
- `bid_amount`는 0보다 큰 숫자만 허용

## 3. 전문가 프로필 응답 확장 여부 결정 필요

현재 BE4의 전문가 프로필 응답은 아래 중심입니다.

```json
{
  "expert_profile": {
    "id": 1,
    "user_id": 1,
    "company_name": "케이법무법인",
    "is_verified": true,
    "stats": {
      "active_bids": 0,
      "selected_count": 1,
      "completed_projects": 0,
      "total_earned": 0
    }
  }
}
```

프론트는 프로필 응답에서 아래 필드를 더 이상 기대하지 않도록 정리했습니다.

- `license_type`
- `expertise_areas`
- `portfolio`

따라서 위 세 필드는 백엔드에서 추가 제공하지 않아도 됩니다. 프로필 응답에서 추가로 논의가 필요한 필드는 인증 상태 구분용 `verification_status`입니다.

프론트는 현재 빠진 필드를 optional/default로 처리했습니다.

- `verification_status`
- `won_projects`

특히 인증 상태는 `is_verified` boolean만으로는 `PENDING`과 `REJECTED`를 구분할 수 없습니다.

## 4. 자격증 날짜 정책 확인 필요

BE4는 자격증 등록 시 아래 두 날짜를 모두 필수로 받습니다.

```json
{
  "issue_date": "2024-01-01",
  "expiry_date": "2029-01-01"
}
```

프론트는 이에 맞춰 발급일/유효기간을 둘 다 입력하도록 수정했습니다.

확인 요청:

- 모든 자격증에 `expiry_date`가 필수인지
- 세무사/공인회계사처럼 만료 개념이 약한 자격증도 `expiry_date`가 필요한지
- 필요 없다면 자격증 타입별 optional 정책이 더 적절한지

## 5. 공고 금액 필드 명칭 확인 필요

BE4 공고 응답은 `capital`, `capital_scale`을 내려줍니다.

프론트는 기존 화면 용어가 `자산 규모`였기 때문에 현재는 `capital_scale ?? capital`을 기존 `assetScale` ViewModel에 매핑해서 표시합니다.

확인 요청:

- 화면 표시 용어를 `자본 규모`로 변경해야 하는지
- `capital`과 `capital_scale`의 정확한 차이와 노출 우선순위
- 창업 예정 등 `capital_scale: null`인 경우 표시 정책
