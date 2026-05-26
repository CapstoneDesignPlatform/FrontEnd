# 전문가 인증 상태 조회 API 수정 요청

## 목적

프론트 전문가 플로우에서 `NOT_APPLIED`, `PENDING`, `APPROVED`, `REJECTED` 상태를 정확히 구분할 수 있도록 `GET /api/expert/me/verification-status` 응답을 보강 요청드립니다.

현재 프론트는 백엔드 응답을 임시 추론해서 사용하고 있으나, `REJECTED` 상태는 정확히 판별할 수 없습니다. 이 부분은 프론트에서 끼워 맞추기보다 백엔드 응답 계약을 명확히 하는 것이 맞다고 판단했습니다.

## 현재 백엔드 동작

대상 API:

```http
GET /api/expert/me/verification-status
```

현재 응답의 핵심 필드는 아래 형태입니다.

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "specialty": "세무사",
    "submitted_at": "2026-05-25T10:00:00",
    "reviewed_at": null,
    "rejected_reason": null
  }
}
```

현재 `verification_request.status`는 `ExpertProfile.isVerified` 기반 boolean으로 내려오는 것으로 확인했습니다.

관련 코드:

```java
.id(applied ? expertProfile.getId() : null)
.status(expertProfile.getIsVerified())
.reviewedAt(expertProfile.getIsVerified() ? expertProfile.getVerifiedAt() : null)
.rejectedReason(null)
```

## 문제점

백엔드에는 이미 `ExpertProfile.verificationStatus` enum이 존재합니다.

```java
NOT_SUBMITTED,
PENDING,
APPROVED,
REJECTED
```

하지만 전문가 본인 상태 조회 API는 이 enum을 내려주지 않고 `isVerified` boolean만 내려줍니다.

그 결과 프론트는 현재 아래처럼 임시 해석할 수밖에 없습니다.

| 백엔드 응답 | 프론트 임시 해석 |
| --- | --- |
| `status: true` | `APPROVED` |
| `status: false`, `id: null` | `NOT_APPLIED` |
| `status: false`, `id 있음` | `PENDING` |

이 방식으로는 `PENDING`과 `REJECTED`가 둘 다 `status: false`, `id 있음` 형태가 되어 구분되지 않습니다.

즉, 관리자가 전문가를 반려 처리해도 프론트에서는 계속 `PENDING`처럼 보일 수 있습니다.

## 요청 사항

### 1. enum 상태 필드 추가

기존 `status` boolean을 바로 제거하면 다른 클라이언트에 영향이 있을 수 있으므로, 우선은 새 필드를 추가하는 방식을 권장합니다.

권장 필드명:

```json
"verification_status": "PENDING"
```

권장 응답 예시:

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "verification_status": "PENDING",
    "specialty": "세무사",
    "company_name": "케이컨설팅",
    "certificates": [],
    "business_registration_info": null,
    "submitted_at": "2026-05-25T10:00:00",
    "reviewed_at": null,
    "rejected_reason": null
  }
}
```

프론트 표준값은 아래 4개입니다.

```ts
type ExpertVerificationStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";
```

백엔드 도메인 enum을 그대로 사용한다면 미신청은 `NOT_SUBMITTED`로 내려와도 프론트에서 매핑할 수 있습니다. 다만 API 응답 계약 관점에서는 프론트와 의미가 더 직관적으로 맞는 `NOT_APPLIED`도 검토 부탁드립니다.

### 2. 반려 사유 제공

`REJECTED` 상태일 때 반려 사유를 내려줄 수 있으면 좋겠습니다.

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "verification_status": "REJECTED",
    "rejected_reason": "사업자등록증 파일 식별이 어렵습니다.",
    "reviewed_at": "2026-05-25T13:00:00"
  }
}
```

현재 관리자 승인 상태 변경 요청에는 `rejectReason`이 있으나, 별도 컬럼 없이 admin log에만 기록되는 구조로 보입니다. 프론트에 반려 사유를 보여줘야 한다면 아래 중 하나가 필요합니다.

- `expert_profiles`에 `reject_reason` 또는 `rejected_reason` 컬럼 추가
- 별도 심사 이력 테이블에서 최신 반려 사유 조회
- 당장 저장이 어렵다면 `rejected_reason: null`로 두되, `verification_status: "REJECTED"`는 반드시 제공

### 3. reviewed_at 정책 확인

현재 `reviewed_at`은 승인된 경우에만 `verifiedAt`으로 채워지는 구조입니다.

반려 상태에서도 심사 완료 시각이 필요하다면 `reviewed_at`을 승인/반려 공통 심사 완료 시각으로 내려주는 방향이 좋습니다.

## 기대 상태별 응답

### 미신청

```json
{
  "verification_request": {
    "id": null,
    "status": false,
    "verification_status": "NOT_APPLIED",
    "submitted_at": null,
    "reviewed_at": null,
    "rejected_reason": null
  }
}
```

백엔드 enum을 그대로 노출한다면 `verification_status`는 `NOT_SUBMITTED`여도 됩니다.

### 심사 대기

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "verification_status": "PENDING",
    "submitted_at": "2026-05-25T10:00:00",
    "reviewed_at": null,
    "rejected_reason": null
  }
}
```

### 승인

```json
{
  "verification_request": {
    "id": 1,
    "status": true,
    "verification_status": "APPROVED",
    "submitted_at": "2026-05-25T10:00:00",
    "reviewed_at": "2026-05-25T13:00:00",
    "rejected_reason": null
  }
}
```

### 반려

```json
{
  "verification_request": {
    "id": 1,
    "status": false,
    "verification_status": "REJECTED",
    "submitted_at": "2026-05-25T10:00:00",
    "reviewed_at": "2026-05-25T13:00:00",
    "rejected_reason": "제출 서류가 식별되지 않습니다."
  }
}
```

## 프론트 영향

이 필드가 추가되면 프론트는 더 이상 boolean 상태를 추론하지 않고 `verification_status`를 우선 사용하면 됩니다.

프론트 매핑 우선순위 권장:

1. `verification_request.verification_status`가 있으면 해당 값 사용
2. 없으면 기존 호환 로직으로 `status` boolean 임시 해석

따라서 기존 `status` boolean을 유지한 채 새 필드만 추가해도 프론트는 안정적으로 대응 가능합니다.

## 완료 기준

- `GET /api/expert/me/verification-status` 응답에 `verification_status`가 포함됩니다.
- `PENDING`과 `REJECTED`가 서로 다른 값으로 구분됩니다.
- `REJECTED` 상태에서 가능한 경우 `rejected_reason`이 제공됩니다.
- 미신청 상태는 `NOT_APPLIED` 또는 `NOT_SUBMITTED` 중 하나로 명확히 내려옵니다.
- 기존 `status` boolean 유지 여부는 백엔드 호환성 정책에 따라 결정하되, 프론트는 `verification_status`를 우선 사용합니다.
