# 전문가 프론트 기준 백엔드 API 작업 요청서

이 문서는 현재 전문가 프론트 플로우와 `0511 전문가 API 명세서`를 기준으로 백엔드에 확인하거나 추가 요청해야 할 API 작업을 정리한 문서입니다.

## 전제

- Base URL: `http://localhost:8081/api`
- 전문가 API는 access token 인증이 필요합니다.
- 프론트는 요청 시 `Authorization: Bearer <access_token>` 헤더를 사용합니다.
- 프론트 기본 API 모드는 실제 HTTP 연동입니다.
- Mock 데이터는 프론트 개발/시연용이며, 실제 검증 기준은 백엔드 API입니다.

## 1. 입찰 생성/수정 API 확정 필요

현재 프론트는 공고 목록/상세에서 공고별로 아래 버튼을 분리해서 보여줍니다.

- 입찰하지 않은 공고: `입찰 시작`
- 이미 입찰한 공고: `입찰 수정`
- 선정됨 또는 마감된 공고: 입찰 수정 불가

### 현재 프론트 사용 API

```http
POST /api/expert/job-posts/{job_post_id}/bids
Content-Type: application/json
```

Request:

```json
{
  "bid_amount": 3000000
}
```

### 입찰 수정 API

```http
PATCH /api/expert/job-posts/{job_post_id}/bids
```

Request:

```json
{
  "bid_amount": 3500000
}
```

현재 프론트는 `has_my_bid: true`인 공고에서 입찰을 제출할 때 위 PATCH API를 호출합니다.

### 확인 요청

- `PATCH /api/expert/job-posts/{job_post_id}/bids`를 수정 API로 제공해주세요.
- 응답은 생성 API와 동일하게 `bid` 객체를 내려주는 것을 기대합니다.

### 백엔드 검증 요청

- 공고 상태가 입찰 가능 상태가 아니면 입찰 생성/수정 거부
- 선정된 입찰은 수정 거부
- 동일 전문가의 중복 입찰 정책 확정
- 입찰 금액은 0보다 큰 숫자만 허용

## 2. 내 입찰 목록 API 명세 확정 필요

현재 프론트의 `내 입찰 목록` 페이지와 `마이페이지 > 선정된 공고 목록`에서 사용합니다.

```http
GET /api/expert/me/bids
```

권장 Response:

```json
{
  "items": [
    {
      "id": 1,
      "job_post_id": 10,
      "job_post_title": "공고 제목",
      "bid_amount": 3000000,
      "status": "PENDING",
      "submitted_at": "2026-05-11T10:30:00",
      "total_bid_count": 5,
      "job_post_deadline": "2026-05-20T18:00:00",
      "client_contact": null
    }
  ],
  "page": 1,
  "size": 20,
  "total_count": 1,
  "total_pages": 1,
  "has_next": false
}
```

상태값:

| API 값 | 프론트 표시 |
| --- | --- |
| `PENDING` | 대기 중 |
| `SELECTED` | 선정됨 |
| `REJECTED` | 거절됨 |

### 의뢰인 정보 노출 정책

`client_contact`는 `SELECTED` 상태에서만 내려주는 것을 권장합니다.

```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "email": "client@example.com"
}
```

선정되지 않은 입찰은 `client_contact: null`로 내려주세요.

## 3. 공고 상세 응답의 입찰 여부 필드 정확도 필요

프론트는 공고 상세에서 `입찰 시작` / `입찰 수정` 버튼을 결정하기 위해 아래 값을 사용합니다.

```json
{
  "has_my_bid": true,
  "my_bid": {
    "id": 1,
    "bid_amount": 3000000,
    "status": "PENDING",
    "submitted_at": "2026-05-11T10:30:00"
  }
}
```

요청사항:

- 내가 입찰한 공고면 `has_my_bid: true`
- 입찰하지 않은 공고면 `has_my_bid: false`, `my_bid: null`
- `my_bid`가 있으면 `has_my_bid`도 항상 `true`
- `has_my_bid`와 `my_bid`가 서로 불일치하면 백엔드 응답 오류로 간주합니다.

프론트는 방어적으로 `my_bid`가 있으면 입찰 수정 상태로 처리하지만, 이 값이 정확해야 공고 상세와 공고 목록에서 버튼 상태가 정상 동작합니다.

## 4. 파일 다운로드 URL API 사용 정책 확인

0511 명세서에 아래 API가 포함되어 있습니다.

```http
GET /api/files/{file_id}/download-url
GET /api/files/{file_id}/download
```

프론트에서는 추후 인증 상태 화면, 관리자 검토 화면, 등록증/사업자등록증 미리보기 또는 다운로드 기능에 사용할 수 있습니다.

확인 요청:

- 다운로드 URL 만료 시간
- PDF/이미지 미리보기 가능 여부
- 본인 파일만 접근 가능한지 권한 체크 기준
- 관리자 검토 시 타 사용자 인증 파일 접근 가능 정책

## 5. 전문가 인증 날짜 필드 의미 정리

현재 API 필드명은 아래처럼 `issue_date`입니다.

```json
{
  "issue_date": "2026-05-11"
}
```

하지만 프론트 화면에서는 해당 값을 `유효기간`으로 사용하기로 확정했습니다.

요청사항:

- 당장은 기존 명세의 `issue_date` 필드를 유지해도 됩니다.
- 단, 백엔드 문서에는 프론트가 이 값을 자격증 유효기간으로 전송한다고 명시해주세요.
- 추후 API 개선 시 `valid_until` 또는 `expiry_date` 같은 명확한 필드명으로 변경을 검토해주세요.

## 6. 전문가 인증 서버 검증 필요

프론트에서도 입력 검증을 하지만, 프론트 검증은 사용자 경험과 실수 방지용입니다.
실제 데이터 무결성과 보안은 백엔드에서 최종 검증해야 합니다.

### 프론트 검증 역할

- 잘못된 입력을 화면에서 즉시 안내
- 불필요한 API 요청 감소
- 사용자가 인증 조건을 이해하도록 보조

### 백엔드 검증이 필요한 이유

- 개발자도구, Postman, curl 등으로 프론트 검증을 우회할 수 있음
- 파일 ID, 자격증 종류, 전문가 유형 등을 임의 조작할 수 있음
- 전문가 인증은 서비스 신뢰와 직접 연결되므로 서버가 최종 판단해야 함

### 서버 검증 요청

전문가 유형이 `전문경영진단`인 경우:

- `경영지도사(재무관리)` 등록증 2개 이상 필수
- 다른 자격증 종류가 섞이면 인증 신청 거부
- 사업자등록증 필수
- 파일 ID가 현재 로그인한 전문가가 업로드한 파일인지 확인
- 파일 purpose가 자격증은 `CERTIFICATE`, 사업자등록증은 `BUSINESS_REGISTRATION`인지 확인

그 외 전문가 유형:

- 선택된 전문가 유형에 맞는 등록증 최소 1개 필수
- 사업자등록증 필수

## 7. 공고 목록 정렬 옵션 추가 요청

현재 0511 명세서에서 지원하는 정렬 옵션:

```text
posted_at_desc
posted_at_asc
```

현재 프론트는 입찰 인원순 정렬을 받아온 데이터 범위 안에서만 처리하고 있습니다.
예를 들어 `size=20`이면 20개 안에서만 정렬되고, 전체 공고 기준 정렬은 아닙니다.

추후 공고 수가 많아지고 전체 공고 기준 정렬이 필요해지면 아래 sort 옵션 추가를 요청드립니다.

```text
bid_count_desc
bid_count_asc
```

예시:

```http
GET /api/expert/job-posts?page=1&size=20&sort=bid_count_desc
```

우선순위는 낮습니다. 초기에는 프론트 정렬로 대응 가능합니다.

## 8. 전문가 회원가입 응답 및 토큰 정책 확인

현재 전문가 회원가입 후 프론트는 전문가 인증 화면으로 이동합니다.

현재 프론트의 전문가 회원가입 화면은 `상호명`을 필수로 입력받습니다.

프론트 요청값:

```json
{
  "company_name": "케이법무법인",
  "name": "홍길동",
  "email": "expert@example.com",
  "password": "password",
  "phone": "01012345678"
}
```

확인 요청:

- `POST /api/auth/signup/expert` 요청에서 `company_name`을 받을 수 있는지
- `POST /api/auth/signup/expert` 후 access token을 즉시 발급하는지
- 회원가입 직후 자동 로그인 상태가 되는지
- 자동 로그인하지 않는다면 프론트에서 로그인 페이지로 이동해야 하는지

권장:

- 회원가입 시 `company_name`을 저장하고, 응답의 `expert_profile.company_name`에도 동일하게 반영
- 회원가입 성공 후 access token을 내려주면 프론트가 저장 후 인증 신청 페이지로 이동
- access token을 내려주지 않는 정책이면 명확히 로그인 필요 상태를 반환

## 우선순위

### 1순위

- 입찰 생성/수정 API 방식 확정
- `GET /api/expert/me/bids` 명세 확정
- 공고 상세의 `has_my_bid`, `my_bid` 정확한 응답 보장
- 전문가 인증 서버 검증

### 2순위

- 파일 다운로드 URL 권한/만료 정책 확정
- 전문가 회원가입 후 토큰 발급 정책 확정
- `issue_date` 필드 의미 문서화

### 추후 작업

- 공고 목록 `bid_count_desc`, `bid_count_asc` 정렬 옵션 추가
