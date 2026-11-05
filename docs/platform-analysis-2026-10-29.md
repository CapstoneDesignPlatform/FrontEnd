# 진단매치 플랫폼 구현 현황과 개선 과제

> 2026-10-29 후속 검토: 최근 수정 사항, 2학기 신규 기능을 제외한 선행 보완 목록과 프론트 3인 분담 제안은 [프론트엔드 보완 계획](frontend-stabilization-review-2026-10-29.md)을 기준으로 확인한다. 아래는 최초 분석과 일부 후속 수정 이력을 보관한 기록이다.

분석 기준일: 2026년 10월 29일 · 저장소 `FrontEnd` · 브랜치 `main` · 기준 커밋 `b14545f` 및 서버 IP 변경 작업본.

진단매치는 기업의 면허 취득·실태 조사·진단 의뢰를 전문가 입찰과 연결하는 플랫폼이다. 의뢰인, 비회원 의뢰인, 전문가, 관리자가 각기 다른 화면을 이용한다. 현재 기업 정보와 의뢰 등록, 전문가 인증·입찰, 일부 관리자 조회·처리에는 실제 API 호출이 구현되어 있다. 그러나 **의뢰 등록 이후의 의뢰인 조회·전문가 선정·결제와 상당수 운영 기능은 정적 데이터 또는 화면 내부 상태에 머물러 있어 전체 거래 흐름이 완성되어 있지 않다.**

가장 먼저 해결해야 할 문제는 실제 승인 API와 샘플 신청서가 섞인 관리자 심사 화면, 의뢰 금액 필드 매핑, 실제 결제 없이 성공을 표시하는 화면이다. 타입 검사와 빌드 성공만으로 서비스 기능이 완성되었다고 판단할 수 없는 상태다.

## 확인 범위와 검증 결과

라우터, 페이지, 공통 레이아웃, 인증 가드, API 클라이언트·어댑터·매퍼, 관련 타입·Mock, 기존 API 문서를 검토했다. 초기 비로그인 검증 이후, 사용자가 제공한 승인 전문가 계정으로 로그인과 주요 조회 화면을 추가 확인했다. 백엔드 소스는 이 작업 폴더에 없으며 다른 역할의 인가·타인 데이터 소유권은 검증 범위 밖이다. 운영 서버에서는 로그인과 조회를 수행했으며 가입, 입찰 제출, 프로필 저장, 파일 업로드, 승인, 결제 등의 업무 데이터 변경은 하지 않았다.

| 검증 | 결과와 의미 |
|---|---|
| `npm ci --no-audit --no-fund` | 잠금 파일 기준 의존성 275개 설치 완료. 의존성 취약점 감사는 수행하지 않음 |
| `npm run typecheck` | 통과 |
| `npm run build` | 통과. Vite가 1,954개 모듈을 처리하고 배포 산출물 생성 |
| 새 서버 `13.209.55.96:8080` | 비인증 GET `/api/users/myInfo`, `/api/expert/job-posts?page=0&size=1`, `/api/admin/clients` 모두 JSON `401`, “로그인이 필요합니다.” 응답 |
| 로컬 프록시 | `127.0.0.1:5173/api/expert/job-posts?page=0&size=1`도 동일한 `401` 응답. 새 주소로 연결되는 설정과 응답 확인 |
| 브라우저 홈 | 로컬에서 정상 표시 |
| 커뮤니티 글쓰기 | 목록의 글쓰기 클릭 → `/community/write` → “게시글을 찾을 수 없습니다.” 재현 |
| 의뢰인 마이페이지 | 비로그인 상태에서도 샘플 의뢰·견적 화면 표시 재현 |
| 비회원 의뢰 조회 | 임의 코드 `AUDIT-NOT-A-REAL-CODE`로도 동일 샘플 의뢰·기업 화면 표시 재현 |
| 전문가 대시보드 | 비로그인 접근 시 로그인 이동 대신 “백엔드 연결 또는 API 모드를 확인” 오류 표시 재현 |
| 관리자 화면 | 플래그 없는 비로그인 접근은 `/admin/login`으로 이동 |
| 푸터 기관 이미지 | 중첩 URL에서 7개 이미지 모두 로드 완료 상태이지만 `naturalWidth=0`인 실패 확인 |
| 인증 상태 매퍼 실행 | `status:false, verification_status:"REJECTED"` → `PENDING`; `status:"REJECTED"` → `REJECTED` 확인 |

`401` 응답은 서버 접근 가능성과 비인증 요청 거부를 확인한 결과다. 보안 필터가 라우팅보다 먼저 응답할 수 있으므로 개별 API의 구현·정상 응답 계약까지 입증하지는 않는다. 아래의 **HTTP 구현**은 프론트에 실제 요청 코드가 있다는 뜻이다.

## 승인 전문가 계정으로 추가 확인한 결과

2026년 10월 29일 제공된 전문가 계정으로 로컬 앱에 로그인했다. 앱은 기본 HTTP 모드와 새 서버 IP를 사용했다. 비밀번호·토큰·개인 연락처는 이 문서에 기록하지 않았다.

| 확인 항목 | 실제 화면 결과 | 연결된 요청 또는 판단 |
|---|---|---|
| 로그인 | 성공 후 `/expert/dashboard`로 이동, 사용자 이름 표시 | POST `/api/auth/login`, GET `/api/users/myInfo`를 사용하는 실제 로그인 흐름 정상 |
| 전문가 인증 | 대시보드와 상태 화면에서 인증 완료, 프로필은 `APPROVED` 표시 | GET `/api/expert/me/verification-status`와 프로필의 승인 표시가 일치 |
| 대시보드 | 이름·소속·계정 표시, 선정된 의뢰 없음 | 프로필·내 입찰 조회를 거쳐 정상 렌더링 |
| 내 입찰 | 현재 조회 결과 1건, 대기 중 1건, 선정 0건, 거절 0건 | GET `/api/expert/me/bids` 기반 화면 정상 |
| 기존 입찰 내용 | 건설업 필요 면허, 100,000원, 입찰일 표시 05-27, 총 입찰자 1명 | 금액·상태·인원 표시 확인. 미선정이므로 의뢰인 정보는 `-` |
| 의뢰 목록 | 전체 20건, 표시 20건, 1/1 페이지 | GET `/api/expert/job-posts` 기반 목록 정상 |
| 검색 | `전기공사업` 검색 시 표시 2건, 전체 20건 | 현재 불러온 데이터의 검색 동작 확인 |
| 기존 입찰 공고 상세 | 목록과 상세 모두 입찰 완료 버튼 비활성, 현재 입찰 수 1개 | `JOB-0008`에 해당하는 공고에서 프론트 중복 입찰 진입 차단 확인 |
| 신규 공고 상세 | `JOB-0020`, 2026-09-09 등록, 실내건축공사업, 자산 15억원, 입찰 0명 | 목록과 상세 표시 일치 |
| 신규 입찰 화면 | 의뢰번호·내용·금액 입력·주의사항·체크박스 표시, 초기 제출 버튼 비활성 | 화면 진입까지 확인. 동의·입찰 제출은 수행하지 않음 |
| 프로필 | 이름·소속·연락처 조회, 이메일 읽기 전용, 저장 버튼 존재 | GET `/api/expert/me/profile` 정상 표시. PATCH 저장은 검증하지 않음 |
| 새로고침 | 프로필 새로고침 후 로그인 사용자와 정보 유지 | 일반 로그인 세션 복원은 이 계정에서 정상 |
| 승인 후 재신청 접근 | `/expert/verification/apply` 접근 시 `/expert/jobs?status=APPROVED`로 이동 | 승인된 계정에 대한 신청 화면 가드 정상 |

이 계정에서는 **승인된 전문가의 로그인 → 의뢰 조회·상세 → 입찰 화면 진입 → 기존 입찰 조회 → 프로필 조회가 실제로 연결된다.** 기존 보고서의 전문가 HTTP 구현 항목 중 이 조회 흐름은 브라우저로 검증된 상태로 보완한다.

여전히 남는 문제와 검증 한계는 다음과 같다.

- 내 입찰의 관리 칸은 `-`이고 의뢰명도 링크가 아니다. 현재 입찰 내역에서 해당 상세로 바로 이동하거나 수정·취소할 동작이 없다. [표 구현](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/expert/MyBids.tsx:255)
- 프로필에는 인증 상태가 `APPROVED`로 그대로 표시되고 “이메일은 계정 설정에서 별도로 관리”한다고 안내하지만 라우터에 사용자 계정 설정 화면은 없다. [프로필 안내](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/expert/ExpertProfileForm.tsx:63)
- 의뢰 데이터가 현재 20건으로 한 페이지에 들어가므로, 페이지를 넘는 검색 누락과 페이지 번호 계약 문제는 이번 계정 화면에서 재현했다고 볼 수 없다. 현재 페이지 필터링이라는 코드상 제한은 유지된다.
- 선정된 입찰이 없어 선정 후 의뢰인 연락처 노출·복사, 선정 의뢰 상세 흐름은 검증하지 못했다. 미선정 화면에서 연락처가 숨겨진 것만 확인했으며 서버 응답 자체의 개인정보 필터링까지 확인한 것은 아니다.
- 승인 계정만 제공되어 미신청·대기·반려 상태 및 반려 응답 형식 문제는 실제 계정으로 검증하지 못했다. 앞서 매퍼에 넣은 반려 응답 사례는 코드 실행 결과로 구분한다.
- 입찰 제출, 프로필 저장, 인증 서류 제출은 업무 데이터를 변경하므로 이번 조회 점검에 포함하지 않았다. 서버의 중복 입찰 차단과 쓰기 요청 성공을 보장하는 결과가 아니다.

## 서비스 구조와 핵심 사용자 흐름

기술 구성은 React 18, TypeScript, React Router, Vite 6, Tailwind CSS 4, Radix UI다. 페이지는 지연 로딩하고, 전문가 영역은 타입·응답 매퍼·HTTP/Mock 어댑터·비동기 훅을 나눠 구성했다. 의뢰인·관리자 영역은 Axios `userInstance`를, 전문가 영역은 fetch 기반 `ApiClient`를 사용한다.

- 회원 의뢰인: 가입·로그인 → 기업 정보 등록 → 업종·목적별 의뢰 등록 → 의뢰 코드 확인 → 내 의뢰 조회 → 입찰 비교 → 전문가 선정 → 결제 → 진행·완료. **실제 서버 데이터 연결은 등록까지이며 이후 의뢰인 화면은 데모 중심이다.**
- 비회원 의뢰인: 기업 정보 등록 → 의뢰 등록 → 코드 보관 → 코드 조회 → 전문가 선정·결제. 등록 API는 있으나 코드 조회·선정·결제가 연결되지 않았다.
- 전문가: 가입 → 로그인 → 자격·사업자 서류 등록 → 인증 신청 → 관리자 심사 → 승인 → 의뢰 검색·상세 → 신규 입찰 → 선정 결과·연락처 확인. HTTP 호출이 가장 일관되게 구현된 영역이지만 반려 상태 계약과 관리자 심사 화면이 전체 흐름을 막을 수 있다.
- 관리자: 관리자 로그인 → 의뢰·회원 조회 → 전문가 승인·반려 → 의뢰 상태 변경 → 수수료·회원권·알림 관리. 앞부분 일부에 HTTP 호출이 있으며 운영 설정·통계는 대체로 데모다.

## 화면별 사용자 흐름과 구현 상태

### 공통 화면과 인증

| 화면 | 경로 | 사용자 흐름 | 구현 상태 |
|---|---|---|---|
| 홈 | `/` | 서비스 설명 → 의뢰인·전문가 시작, 내 의뢰 조회 | 정적 소개·링크. 관리자 접속 데모 링크 존재 |
| 로그인 | `/login` | 이메일·비밀번호 → 사용자 정보 조회 → 역할별 화면 또는 `next` | HTTP 구현. 내부 경로만 허용하는 `next` 검사 있음 |
| 일반 회원가입 | `/register` | 역할 → 약관 → 계정 입력 → 가입 완료 | HTTP 구현. 비밀번호 확인·동의 전송·가입 후 세션 복원 문제 |
| 소셜 콜백 | `/oauth/callback/{kakao,naver,google}` | 제공자 인증 → 신규/기존 사용자 분기 | 플랫폼 토큰 발급과 소셜 계정 연결 미완성 |
| 전문가 검색 | `/bids/search-experts` | 이름·업체·지역 검색 → 상세 모달 | 고정 전문가 5명. 서버 검색·프로필 조회 없음 |
| 공지사항 | `/bids/notice` | 검색 → 내용 펼치기 | 정적 공지 5개 |
| 커뮤니티 목록 | `/community` | 카테고리·검색 → 게시글·글쓰기 | 정적 게시글 6개 |
| 커뮤니티 상세 | `/community/:id` | 글·댓글 조회, 좋아요·댓글 작성 | 상세 샘플은 2개뿐. 좋아요는 state, 댓글은 console 출력 후 입력 초기화 |
| 커뮤니티 글쓰기 | 의도된 `/community/write` | 제목·카테고리·본문 입력 → 목록 이동 | 컴포넌트와 lazy 정의는 있지만 라우트 누락. 현재 상세의 `id=write`로 해석 |
| 고객센터 | `/support` | 문의 입력 → 접수 안내 | API 없이 성공 toast 후 입력 초기화 |
| FAQ | `/support/faq` | 질문 펼치기 | 정적 안내 |
| Q&A | `/support/qna` | 문의 작성·비밀글 선택 → 목록·답변 조회 | 샘플 + state. 사용자도 `CURRENT_USER="나"` 고정. 새로고침 시 작성 내용 소실 |
| 자료실 | `/support/archive` | 검색 → 다운로드 | 샘플 자료 2개, 다운로드 버튼 동작 없음 |
| 없는 페이지 | `*` | 404 → 홈 | 구현 |
| 예약코드 조회 | 라우트 없음 | 코드 입력 → 안내 | `RegisterLookup.tsx`는 미연결 화면 |

### 의뢰인 화면

| 화면 | 경로 | 사용자 흐름 | 구현 상태 |
|---|---|---|---|
| 시작 | `/client/start` | 가입·로그인·비회원 선택 | 토큰·기업 ID 쿠키가 있으면 의뢰 작성으로 이동 |
| 기업 정보 등록 | `/client/company-info` | 기업·대표자·연락처·주소 입력 → 의뢰 작성 | 회원/비회원 POST, 회원 기존 정보 GET 구현 |
| 의뢰 등록 | `/client/create-project`, `/:industry/:tab?` | 업종 → 목적 → 사업자 유형·필요 면허·금액 등 → 제출 | 회원/비회원 POST 구현. `:tab`은 사용하지 않음. 자본금 필드 오류 |
| 등록 완료 | `/client/project-success/:projectCode` | 코드 확인·복사 → 홈·가입 | URL 코드 표시. 서버 저장 여부를 다시 조회하지 않음 |
| 마이페이지 레이아웃 | `/client/mypage` | 진행 의뢰·기업 정보 탭 | 회원·역할 가드 없음 |
| 진행·과거 의뢰 | `/client/mypage` | 견적 상세 → 마감 → 전문가·금액 선택 | 고정 의뢰 + state. 마감·선정·취소 미저장, 결제 비활성 |
| 기업 정보 조회·수정 | `/client/mypage/company-info` | 조회 → 편집 → 저장 | GET/PUT 구현. 저장 시 폼 제약 검증 미실행 |
| 기타 | `/client/mypage/other` | 내용 표시 | 자리표시 문구만 존재 |
| 내 의뢰 목록 | `/client/projects` | 목록 → 상세·입찰 | 정적 의뢰 4개, 실제 등록 결과 미반영 |
| 의뢰 상세 | `/client/projects/:id` | 의뢰·기업 정보 → 입찰 목록 | ID에 관계없이 같은 샘플 상세 |
| 입찰 목록 | `/client/projects/:id/bids` | 가격순 정렬 → 전문가 선택 → 결제 | 정적 입찰 5개, 선택은 state. 선정 전문가·금액이 결제에 전달되지 않음 |
| 비회원 코드 입력 | `/check-request` | 코드 입력 → 조회 | 빈 값만 검사, 조회 API 없음 |
| 비회원 의뢰 조회 | `/client/guest-request-view/:projectCode` | 진행·견적·회사 확인 → 선택 | 샘플 + state. URL 코드 조회 없음, 기업 수정·결제 미구현 |
| 결제 | `/payment/:projectId` | 결제수단 선택 → 완료 안내 | 샘플 금액, PG·결제 API 없음. 타이머 성공 후 없는 `/client/dashboard`로 이동 |

의뢰 업종은 건설업, 전기공사업, 정보통신공사업, 소방시설공사업, 의약품도매상, 기타로 나뉜다. 목적은 면허 취득·실태 조사·기타이며 전기공사업에는 주기적 신고가 추가된다. 화면에 표시되는 진단 시작·협회 경유·작성·발송·수령 단계는 실제 진행 관리와 연결되지 않았다.

### 전문가 화면

| 화면 | 경로 | 사용자 흐름 | 구현 상태 |
|---|---|---|---|
| 전문가 가입 | `/signup/expert` | 약관 → 계정 → 인증 신청 또는 로그인 | HTTP 구현. 비밀번호 일치 검사 있음. 동의 항목은 미전송 |
| 인증 신청 | `/expert/verification`, `/expert/verification/apply` | 자격·등록증·사업자등록증 → 미리보기 → 제출 | 업로드·서류 등록·신청 HTTP 구현. 미신청·반려만 접근 |
| 인증 상태 | `/expert/verification/status`, `/expert/pending` | 대기·승인·반려 안내 → 재신청·의뢰 | HTTP 조회. 자동 갱신·재조회 버튼 없음, 대기 중 수정 링크와 가드 충돌 |
| 대시보드 | `/expert/dashboard` | 프로필·입찰·선정 의뢰·연락처 확인 | HTTP 구현. 입찰 조회 실패 시 프로필은 유지 |
| 의뢰 목록 | `/expert/jobs`, `/expert/projects` | 검색·유형·정렬·페이지 이동 → 상세 | HTTP 구현. 검색·유형·입찰인원 정렬은 현재 페이지 내에서만 적용 |
| 의뢰 상세 | 위 목록 경로의 `/:id` | 의뢰 조건 → 신규 입찰 | HTTP 구현. `id`는 공고 코드 역할 |
| 입찰 | 위 상세 경로의 `/bid` | 금액·동의 → 입찰 → 내 입찰 | 신규 POST 구현. 수정·취소 미구현 |
| 내 입찰 | `/expert/bids`, `/expert/my-bids` | 상태·검색 → 선정 결과·연락처 | HTTP 구현. 페이지 정보 폐기 및 일부 통계 계산 범위 문제 |
| 프로필 | `/expert/profile` | 이름·소속·전화 수정 | GET/PATCH 구현. 이메일 읽기 전용, 승인 상태만 접근 |

### 관리자 화면

| 화면 | 경로 | 사용자 흐름 | 구현 상태 |
|---|---|---|---|
| 로그인 | `/admin/login` | 비밀번호 → 의뢰 목록 | POST 구현, 관리자 ID 11 고정 |
| 의뢰 목록 | `/admin/projects` | 검색·필터 → 상세·엑셀 | GET 구현. 회원/비회원 구분은 전부 회원으로 고정 |
| 의뢰 상세 | `/admin/projects/:id` | 상세 → 상태 변경 | GET/PATCH 구현, 상태 enum 대소문자 계약 확인 필요 |
| 전문가 관리 | `/admin`, `/admin/experts` | 통계·검색 → 심사·상세 | GET 구현. 첫 20명, 인증 상태를 계정 상태로 오해 |
| 전문가 목록 | `/admin/experts/list` | 검색·필터 → 상세·심사 | 위와 동일한 첫 페이지 제한 |
| 전문가 승인 | `/admin/experts/approval/:id` | 신청서 확인 → 승인·반려 | **실제 GET/PATCH와 샘플 신청서 표시가 혼재** |
| 전문가 상세 | `/admin/experts/detail/:id` | 개인정보·자격·사업자 정보 | GET 구현. 서류 다운로드·탈퇴 해지 미구현 |
| 의뢰인 목록 | `/admin/clients` | 목록 → 상세·엑셀 | GET 구현. 계정 상태 모두 active로 고정 |
| 의뢰인 상세 | `/admin/clients/:id` | 정보·의뢰 → 정지·복구 | 조회 HTTP 구현, 정지·복구는 state만 변경 |
| 커뮤니티 목록 | `/admin/community` | 검색·삭제 → 상세 | 샘플 + state |
| 커뮤니티 상세 | `/admin/community/:id` | 글·댓글 관리 | 샘플 + state |
| 플랫폼 설정 | `/admin/settings` | 수수료·덤핑·중앙값·노출수 설정 | 저장 표시만 변경, 정책 API 없음 |
| 알림 통계 | `/admin/notifications/stats` | 기간별 집계·엑셀 | 정적 records의 필터·로컬 엑셀 |
| 알림 사용관리 | `/admin/notifications/manage` | 중단·재개·횟수 충전 | 샘플 + state |
| 회원 알림내역 | `/admin/notifications/:memberNumber` | 회원별 기록·날짜 조회 | 번호만 URL 반영, 내용 고정. 날짜 필터 미적용 |
| 중개수수료 통계 | `/admin/fees/stats` | 기간별 집계·엑셀 | 정적 records의 필터·로컬 엑셀 |
| 회원 수수료내역 | `/admin/fees/:memberNumber` | 회원별 수수료 조회 | 내용 고정, 날짜 필터 미적용 |
| 회원비 납입관리 | `/admin/membership/manage` | 회원권·기간·엑셀 | 정적 records |
| 회원비 통계 | `/admin/membership/stats` | 기간별 수납 합계 | 정적 records, 날짜 선택이 합계·행에 미반영 |

## API 연동 현황

개발에서는 Vite `/api` 프록시, 배포에서는 Vercel `/api` rewrite가 `http://13.209.55.96:8080`으로 전달한다. 전문가 클라이언트만 `VITE_API_BASE_URL` 설정을 우선 사용한다. 따라서 배포 환경에 이전 주소의 환경변수가 남아 있다면 설정 파일 변경만으로 전문가 호출까지 바뀐다고 보장할 수 없다. 로컬 `.env` 파일은 발견되지 않았다.

아래 경로는 모두 `/api`를 접두사로 한다. HTTP 구현 표시가 서버와의 계약 일치 또는 요청 성공을 의미하지는 않는다.

| 영역 | 메서드와 경로 | 연결 상태 |
|---|---|---|
| 계정 | POST `/auth/login`, POST `/auth/signup`, GET `/users/myInfo` | 호출 구현 |
| 관리자 로그인 | POST `/admin/login` | 호출 구현 |
| 기업 정보 | GET·POST·PUT `/client-info`, POST `/client-info/guest` | 호출 구현 |
| 의뢰 등록 | POST `/announcements`, POST `/announcements/guest` | 호출 구현 |
| 전문가 의뢰 | GET `/expert/job-posts`, GET `/expert/job-posts/{announcementCode}` | 호출 구현 |
| 전문가 입찰 | POST `/expert/job-posts/{announcementCode}/bids`, GET `/expert/me/bids` | 신규 입찰·조회 구현. 수정·취소 없음 |
| 전문가 프로필 | GET·PATCH `/expert/me/profile` | 호출 구현 |
| 전문가 인증 | GET `/expert/me/verification-status`, POST `/expert/me/verification-requests` | 호출 구현. 상태 응답 계약 충돌 |
| 인증 서류 | POST `/files?purpose=...`, POST `/expert/me/certificates`, POST `/expert/me/business-registration-info` | 순차·병렬 조합 호출, 재시도 시 중복 등록 가능 |
| 관리자 전문가 | GET `/admin/experts`, GET `/admin/experts/{userId}`, GET `.../{userId}/certificates`, GET `.../{userId}/business-registration-info` | 호출 구현 |
| 관리자 심사 | PATCH `/admin/experts/{userId}/verification-status` | 호출 구현. 화면 데이터 교체가 선행되어야 함 |
| 관리자 의뢰인 | GET `/admin/clients`, GET `/admin/clients/{userId}`, GET `.../{userId}/announcements` | 조회 구현, 정지·복구 호출 없음 |
| 관리자 의뢰 | GET `/admin/announcements`, GET `.../{announcementCode}`, PATCH `.../{announcementCode}/status` | 호출 구현 |
| 관리자 엑셀 | GET `/admin/excel/experts`, `.../experts/{userId}`, `.../clients`, `.../announcements`, `.../announcements/{code}` | 다운로드 구현, 실패 응답 판별 오류 |
| 의뢰인 거래 후속 | 내 의뢰·상세·입찰 목록·마감·전문가 선정·취소 | 해당 의뢰인 화면에 호출 없음 |
| 결제 | 주문·승인·검증·취소·환불 | 프론트 연동 없음 |
| 기타 운영 | 게시판·문의·자료실·회원권·알림·수수료·정책 저장 | 대부분 호출 없음 |

API 근거: [Axios 클라이언트](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/instance.ts:14), [fetch 클라이언트](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/apiClient.ts:115), [전문가 API](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertHttpApi.ts:25), [인증 API](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertVerificationHttpApi.ts:22), [관리자 전문가 API](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/admin/expertApi.ts:42), [관리자 의뢰인·의뢰 API](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/admin/clientApi.ts:24).

## 권한과 인증 처리

| 구간 | 현재 검사 | 판단 |
|---|---|---|
| 회원 의뢰인 화면 | 일부 동작에서 쿠키 존재 확인, 라우트 공통 가드 없음 | 비로그인 마이페이지 접근 재현. 지금 보이는 정보는 샘플이므로 실제 개인정보 유출로 단정할 수 없음 |
| 전문가 활동 | 서버 인증 상태가 APPROVED일 때만 렌더링 | 방향은 적절함. 401·403 안내, 상태 계약, 역할 검증은 보완 필요 |
| 전문가 인증 신청 | NOT_APPLIED 또는 REJECTED만 허용 | 대기 중 수정 버튼과 모순 |
| 관리자 화면 | `sessionStorage.admin-auth === "true"` | UI 표시용 값으로만 통제. 서버 토큰·역할·만료 검사와 동기화 필요 |
| 서버 비인증 조회 | 점검한 3개 요청 모두 401 | 무인증 차단은 확인. 일반회원의 관리자 접근과 타인 데이터 접근은 별도 계정 검증 필요 |
| 토큰 | 쿠키와 localStorage 이중 저장 | Axios와 fetch가 다른 저장소 우선순위를 사용하며 401 정리도 불일치 |
| 비밀 Q&A | 고정 작성자 문자열 비교 | 현재 데모 기능. 실데이터 연결 시 서버 작성자 검증 필요 |

전문가 가드의 `?status=APPROVED`와 세션 데모 상태는 Mock 어댑터에서 사용된다. 현재 기본 HTTP 어댑터는 override 인자를 무시하고 서버를 조회한다. **이 파라미터만으로 운영 전문가 인증을 우회한다고 판단하는 것은 부정확하다.** [HTTP 인증 조회](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertVerificationHttpApi.ts:111)

## 우선 수정할 확정 문제

우선순위 P1은 실제 데이터의 정확성·거래·심사에 직접 영향을 주는 문제, P2는 기능 완성도·상태 일관성·사용성 문제로 분류했다. 서버 계약에 따라 달라지는 항목은 별도로 명시했다.

### P1 관리자 심사 대상과 표시 정보가 다름

**2026-10-29 후속 수정:** 관리자 심사 화면의 샘플 신청자·서류·엑셀을 제거하고 상세·자격증 전체·사업자등록 조회 결과로 교체했다. 상세 사용자 ID와 URL 일치 및 세 응답의 성공 여부를 확인하고, 실패 시 오류·재시도를 표시한다. 오래된 조회 결과는 화면 전환 후 반영하지 않는다. 현재 관리자용 원본 서류 열람 API가 없어 승인·반려 및 원본 열람 버튼은 비활성화했다. 따라서 잘못된 샘플을 근거로 실제 사용자를 처리하는 경로는 제거했으며, 실제 심사 완료 흐름은 [API 요청서의 API-002·API-003](backend-api-requests.md) 구현·배포 후 연동이 필요하다. 조회 검증 테스트 8개와 타입 검사·빌드가 통과했으며 실제 관리자 계정으로의 운영 심사는 수행하지 않았다. 아래 내용은 수정 전 분석 기록이다.

승인 화면은 URL ID에 대응하는 샘플이 없으면 첫 번째 샘플 전문가를 표시한다. 실제 상세·자격증·사업자 정보를 GET으로 가져오지만 제목, 이름, 인증 내용, 서류 목록, 엑셀은 여전히 샘플 객체를 사용한다. 승인·반려는 URL의 실제 사용자 ID로 PATCH한다. 조회 실패도 빈 catch로 무시한다.

예를 들어 실제 신청자 ID 42를 열어 샘플 인물과 샘플 서류를 보고 승인해도 처리 대상은 42다. 확인 대화상자에서 실제 이메일이 나올 수 있지만 심사 근거가 되는 본문은 잘못된 상태다. 실제 API 응답으로 화면을 구성하고 조회 성공·대상 일치 전에는 심사 동작을 막아야 한다.

근거: [샘플 선택과 조회](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExpertApproval.tsx:307), [실제 승인 요청](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExpertApproval.tsx:341), [샘플 제목](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExpertApproval.tsx:440).

### P1 자본금과 자본 규모 매핑 오류

**2026-10-29 후속 수정:** 실제 의뢰 등록 화면에서 자본금 입력값 `assetScale`을 요청의 `capital`에, 자본 규모 입력값 `capitalScale`을 동명 요청 필드에 연결했다. 백엔드 DTO·엔티티에서 두 값 모두 억원 단위임을 확인해 환산하지 않는다. 창업 예정은 자본금을 보존하고 자본 규모만 null로 보내며, 업종은 NONE으로 전환한다. 법인·개인의 자본 규모는 현재 업종이 없어도 서버 검증에 맞춰 필수 입력으로 변경했다. 누락된 금액을 0으로 대체하는 동작을 제거했다. 과거 저장 데이터의 확인·보정은 [API-004](backend-api-requests.md)에 요청하며 이번 프론트 수정으로 기존 데이터를 변경하지 않는다. 아래 내용은 수정 전 분석 기록이다.

화면의 자본금은 `assetScale`, 자본 규모는 `capitalScale`에 저장하지만 요청에서는 `capital=capitalScale`, `capitalScale=assetScale`을 보낸다. 자본금 2, 자본 규모 10 입력 시 `{capital:10, capitalScale:2}`가 된다. 특히 창업 예정자는 자본 규모 입력을 비워 두도록 하므로 입력한 자본금이 `{capital:0, capitalScale:null}`로 사라진다. 서버가 기대하는 필드 의미와 단위도 함께 확정한 뒤 매핑을 수정해야 한다.

근거: [입력값 연결](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/CreateProject.tsx:236), [전송 payload](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/CreateProject.tsx:410).

### P1 실제 의뢰 등록 이후 조회와 선정이 이어지지 않음

의뢰 등록은 서버에 보내지만 내 의뢰 목록·상세·마이페이지·입찰 목록은 고정 데이터다. 마감·선정·가격 변경·취소는 React state만 바꾸므로 새로고침 시 복원되지 않는다. 전문가가 실제 입찰을 제출해도 의뢰인이 이 화면에서 그 결과를 확인할 연결이 없다.

근거: [고정 의뢰 목록](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/ProjectList.tsx:9), [고정 상세](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/ProjectDetail.tsx:11), [로컬 선정](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/ClientMyPage.tsx:77).

### P1 결제 없이 성공 안내 후 없는 페이지로 이동

결제는 서버·PG 호출 없이 타이머로 성공 toast를 표시한다. 전문가·합의 금액·수수료는 고정이며 앞 화면의 선정 결과를 받지 않는다. 완료 후 `/client/dashboard`로 이동하지만 해당 라우트는 없다. 의뢰인 마이페이지 결제 버튼은 비활성이고 비회원 결제 버튼에는 핸들러가 없다. 서버 주문·결제 검증·상태 반영이 연결되기 전에는 실제 결제 완료로 안내하면 안 된다.

근거: [결제 처리](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Payment.tsx:18), [마이페이지 비활성 버튼](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/ClientMyPage.tsx:240), [비회원 버튼](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/GuestRequestView.tsx:250).

### P1 소셜 인증과 플랫폼 인증 연결 미완성

콜백이 제공자 토큰·프로필을 받아도 플랫폼 토큰을 발급받는 흐름이 없다. 기존 회원 여부는 프로젝트에서 저장 코드가 없는 `localStorage["social_provider_id"]` 형식의 키로 판단한다. 소셜 가입은 제공자 인증 증명 없이 일반 가입 API에 고정 전화번호와 `SOCIAL_` + 소셜 ID 형식의 비밀번호를 보낸다. 제공자 인증을 서버에서 검증하고 소셜 식별자와 플랫폼 계정을 연결하는 계약이 필요하다.

또한 인가 요청은 현재 origin의 callback을, 토큰 교환은 `VITE_REDIRECT_URI`를 사용하므로 설정에 따라 URI가 어긋날 수 있다. OAuth state 생성·검증도 보완 대상이다. 제공자별 실제 성공·CORS·비밀키 요구는 검증하지 않았다.

근거: [콜백 처리](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/OauthCallback.tsx:83), [신규 판단](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/OauthCallback.tsx:114), [소셜 가입 payload](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Register.tsx:137).

### P1 인증 반려 상태 계약 불일치

매퍼는 `status`만 읽는다. 기존 boolean `status:false`와 새 `verification_status:"REJECTED"`를 함께 보내는 문서상의 응답은 `PENDING`으로 매핑된다. 이 경우 반려 사유 표시와 재신청 진입이 막힌다. 함수 실행으로 이 변환을 확인했다. 서버가 문자열 `status:"REJECTED"`를 보내면 정상 처리되므로 현재 운영 응답 확인이 필요하다.

근거: [상태 매퍼](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertVerificationMappers.ts:52), [백엔드 응답 제안](/Users/imin-yeong/CAPSTONE/FrontEnd/docs/expert-verification-status-backend-request.md:72).

### P2 관리자 세션과 로그아웃 관리 미완성

UI 가드는 브라우저 플래그만 확인하고, 관리자 로그인은 ID 11로 고정되어 있다. 쿠키 저장용 dynamic import를 기다리지 않고 페이지를 이동하므로 첫 조회와 토큰 저장 사이에 경쟁이 생길 수 있다. 관리자 화면에는 로그아웃 동작이 없고 일반 로그아웃도 `admin-auth`를 지우지 않는다. UI 플래그 우회가 곧 서버 권한 우회라는 뜻은 아니지만 세션 상태를 서버 역할·만료와 일치시켜야 한다.

근거: [관리자 가드](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/admin/AdminAuthGuard.tsx:6), [로그인 순서](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminLogin.tsx:19), [일반 로그아웃](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Root.tsx:195).

### P2 비회원 코드 조회와 회원 화면 접근 검사 미구현

임의의 비어 있지 않은 코드가 모두 조회 화면으로 이동한다. 조회 화면은 URL 코드로 서버를 요청하지 않고 이동 state 또는 기본 코드를 표시하며 고정 기업·의뢰를 보여 준다. 비로그인 의뢰인 마이페이지도 접근 가능하다. 실제 코드 인증, 만료·실패 처리, 의뢰 소유권 확인 및 회원 전용 라우트 보호를 구현해야 한다. 현재 표시 정보는 샘플이다.

근거: [코드 입력 처리](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/CheckRequest.tsx:18), [비회원 상세](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/GuestRequestView.tsx:10), [의뢰인 라우트](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/routes.tsx:346).

### P2 가입과 만료 처리의 세션 불일치

일반 가입에서 토큰은 저장하지만 `USER_ROLE` 쿠키를 설정하지 않는다. 공통 레이아웃은 토큰과 역할 쿠키가 모두 있어야 새로고침 후 사용자를 복원한다. 가입 응답에 토큰이 없는 의뢰인도 화면에서는 로그인한 사용자처럼 처리된다.

Axios는 쿠키 토큰을, 전문가 fetch는 localStorage 토큰을 우선 사용한다. Axios 401과 사용자 복원 실패는 쿠키만 일부 삭제하여 localStorage·관리자 플래그와 어긋날 수 있다. refresh token은 저장하지만 갱신 API 호출이 없다. 공통 인증 저장·삭제·갱신 처리와 401/403 화면 동작을 통합해야 한다.

근거: [가입 후 처리](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Register.tsx:153), [사용자 복원](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Root.tsx:155), [토큰 우선순위](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/authTokens.ts:19), [Axios 401](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/instance.ts:37).

### P2 입력 검증과 동의 결과 누락

일반 가입 `/register`는 비밀번호 확인값 비교와 안내된 비밀번호 강도 검증이 없다. 전용 전문가 가입 `/signup/expert`에는 비밀번호 일치 검사가 있어 두 가입 경로의 검증이 다르다. 양쪽 모두 사용자 동의 선택값을 가입 API payload에 포함하지 않는다. 서버에서 동의 선택을 구분할 수 있는 계약이 필요하다.

기업정보 수정은 `<form>` 안에 있지만 저장 버튼이 `type="button"`이며 별도 검증 없이 PUT을 호출한다. 따라서 `required`·이메일·URL 브라우저 검증을 거치지 않는다.

근거: [일반 가입 요청](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Register.tsx:128), [전문가 가입 요청](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/expert/ExpertSignup.tsx:198), [기업 수정 저장](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/CompanyInfoView.tsx:124), [저장 버튼](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/CompanyInfoView.tsx:311).

### P2 인증 상태를 계정 정지와 탈퇴로 표시

관리자 전문가 목록은 `REJECTED`를 정지, 미제출 등을 탈퇴로 표시한다. 인증 반려·미신청은 계정 정지·탈퇴와 다른 상태다. 신규 전문가가 탈퇴자로 표시되고 잘못된 통계·조치 UI가 나온다. 인증 상태와 계정 상태를 분리해야 한다.

근거: [관리자 목록 매핑](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExperts.tsx:26), [전문가 상세 매핑](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExpertDetail.tsx:42).

### P2 검색과 통계의 데이터 범위 제한

전문가 의뢰 목록은 20건씩 가져온 뒤 현재 배열에만 검색·유형 필터·입찰 인원 정렬을 적용한다. 다음 페이지의 일치 의뢰를 현재 페이지 검색에서 찾을 수 없다. 관리자 전문가 목록도 첫 20명만 가져오고 다음 페이지 이동이 없어 목록·집계가 잘린다.

내 입찰은 페이지 인자를 보내지 않고 응답의 `items`만 취한다. 서버가 페이지를 나누면 과거 입찰·선정 의뢰와 이를 기준으로 계산한 성공률이 일부 데이터만 반영한다. 서버 검색·정렬·페이지 계약과 전체 집계 기준이 필요하다.

근거: [의뢰 조회·필터](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/expert/ProjectListExpert.tsx:56), [관리자 목록 조회](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminExperts.tsx:61), [내 입찰 API](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertHttpApi.ts:79).

### P2 성공 안내만 있는 저장 기능

고객센터 문의는 접수 성공 toast만, Q&A는 state만, 커뮤니티 작성·댓글은 console 출력 또는 state만 변경한다. 관리자 회원 정지·복구, 설정 저장, 알림 중단·재개·충전도 서버에 저장되지 않는다. 운영 기능이 성공한 듯 보이는 동작은 실제 API와 연결하거나 데모 상태를 명확히 표시해야 한다.

근거: [고객센터 문의](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Support.tsx:37), [Q&A 작성](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/category/support/SupportQna.tsx:79), [계정 정지](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminClientDetail.tsx:153), [설정 저장](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/admin/AdminSettings.tsx:27).

### P2 깨진 이동과 파일 동작

커뮤니티 글쓰기 라우트가 없어 상세 페이지로 잘못 매칭된다. 목록 6개 중 상세 샘플이 없는 3~6번도 조회 실패한다. 자료실 다운로드와 관리자 일부 서류 다운로드는 파일을 내려받지 않는다. 전문가 헤더의 커뮤니티 링크는 `/community` 대신 `/`로 연결된다.

엑셀 API는 `validateStatus: () => true`로 401·500도 성공 분기로 받고 내용을 검사하지 않고 `.xlsx`로 저장한다. 공통 푸터는 `src/assets/svg/...` 상대 URL을 사용하여 중첩 경로에서 이미지 7개가 깨지는 것을 확인했다.

근거: [글쓰기 링크](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/category/community/Community.tsx:107), [상세 조회](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/category/community/CommunityDetail.tsx:88), [엑셀 응답 처리](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/admin/excelApi.ts:4), [푸터 이미지](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Root.tsx:469), [전문가 커뮤니티 링크](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/Root.tsx:325).

## 추가 기능 문제와 계약 확인 항목

| 항목 | 확인된 동작·영향 | 필요한 후속 작업 |
|---|---|---|
| 인증 대기 중 수정 | 수정 버튼은 신청 화면으로 보내지만 가드가 다시 대기 화면으로 돌림 | 대기 중 수정 정책에 맞춰 버튼·가드 통일 |
| 인증 제출 재시도 | 파일 업로드 → 자격증 등록 → 사업자등록 → 신청 → 상태 조회를 재실행 | 중간 성공 보존·중복 요청 방지. 서버 중복 처리 계약 확인 |
| 최종 신청 후 조회 실패 | 신청 POST가 성공해도 후속 GET 실패를 전체 실패로 표시 | 신청 성공과 조회 실패 구분 |
| 기존 첨부파일 | `fileId/fileName` 복원 후에도 previewKind가 없어 업로드 전 UI 표시 | 기존 파일명·첨부 상태 표시와 다운로드 연결 |
| 입찰 가능 상태 | 정확히 “입찰 마감”만 차단, 미정 상태는 허용 | 명시적인 허용 상태와 서버 마감·중복 검증 |
| 입찰 수정·취소 | 수정 API는 오류를 던지며 UI도 차단, 취소 호출 없음 | 제품 요구와 서버 계약 확정 후 구현 |
| 전문가 알림 버튼 | 클릭 동작 없음 | 서비스 신청·관리 연결 또는 비활성 안내 |
| 기업 ID 복원 | 기존 기업 조회 후 기업 ID 쿠키를 복원하지 않고 작성 화면 이동 | 응답 ID 복원 및 서버 기준 상태 조회 |
| 창업 예정 전환 | 현재 업종을 자동으로 “없음” 처리한다는 안내와 달리 이전 값 유지 | 사업자 유형 변경 시 관련 필드 정리 |
| 관리자 의뢰 상태 변경 | 응답은 대문자 상태로 해석, PATCH는 소문자 전송 | 서버 enum 수용 범위 확인 |
| 연락처 공개 | 전문가 화면은 선정 여부로 노출을 결정 | 서버 응답도 선정된 본인에게만 연락처를 주는지 검증 |
| 역할·소유권 | 비인증 차단만 확인 | 일반회원→관리자, 미승인 전문가→입찰, 타인 ID 접근을 테스트 계정으로 검증 |
| 결제 정책 | 화면에 수수료·가격·결제 입력은 있으나 서버 주문·검증 없음 | 주문·금액 검증·중복 결제 방지·취소·환불 범위 확정 |

참조: [대기 중 수정 링크](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/expert/ExpertVerificationStatusCard.tsx:208), [신청 가드](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/expert/ExpertVerificationApplyGuard.tsx:37), [인증 제출 순서](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/expertVerificationHttpApi.ts:93), [기존 첨부 표시](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/expert/verification/VerificationFileUpload.tsx:43), [입찰 상태 판정](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/components/expert/jobStatus.ts:8), [기업 정보 복원](/Users/imin-yeong/CAPSTONE/FrontEnd/src/app/pages/client/CompanyInfo.tsx:39).

## 문서와 코드의 불일치 및 유지보수

- API 계약 문서는 로컬 기본 모드를 Mock이라고 설명하지만 [실제 코드](/Users/imin-yeong/CAPSTONE/FrontEnd/src/api/apiMode.ts:10)는 HTTP다. Mock 모드로 바꿔도 의뢰인·관리자·일반 로그인까지 Mock으로 전환되지는 않는다.
- 전문가 Mock은 입찰·프로필·인증 제출 응답만 만들고 상태를 저장하지 않는다. 인증 제출 후 재조회 시 기본 미신청 상태로 돌아갈 수 있어 전체 시연에도 제한이 있다.
- 인증 업로드 purpose, 인증 신청 body, 전문가 가입 경로·회사 필드, 날짜 의미에 대한 문서가 현 HTTP 구현과 다르다. 백엔드와 하나의 최신 계약으로 정리해야 한다.
- 실제 라우터가 사용하는 `pages/client/CreateProject.tsx`와 별개로 `createProject/CreateProjectForms.tsx` 안에 다른 작성 화면 구현이 남아 있다. `buildCreateProjectPayload`, `useCreateProjectState`도 실제 작성 화면과 분리되어 있어 수정 지점을 혼동하기 쉽다.
- `CommunityWrite` lazy 정의와 `RegisterLookup` 등 미연결 코드가 남아 있다. 테스트·lint 실행 스크립트는 없고 현재 검증 명령은 typecheck와 build다.
- 실제 화면은 상세 검증이 필요한 요청·응답에 `any`와 고정값을 사용하는 곳이 많다. 특히 심사·금액·상태·동의 값을 우선적으로 타입과 서버 계약에 맞춰 정리하는 것이 효과적이다.

## 권장 작업 순서와 완료 기준

1. **실데이터 정확성 확보:** 관리자 심사 화면을 실제 신청 데이터로 교체하고 조회 실패 시 승인 차단. 자본금·규모 매핑과 창업 예정 필드 정리. 완료 기준은 요청 ID, 표시 신청자, 첨부 서류, 승인 대상이 일치하고 입력 금액이 정확히 저장되는 것이다.
2. **계정·인증 계약 정리:** 로그인/가입/로그아웃/만료 처리를 통합하고 소셜 인증을 서버 계정과 연결. 인증 enum, 역할, 동의 기록을 확정. 완료 기준은 새로고침·만료·반려·재신청에서도 일관된 상태를 유지하는 것이다.
3. **의뢰인 거래 흐름 연결:** 내 의뢰 GET, 상세·입찰 GET, 마감·선정·취소 API를 연결하고 비회원 코드 인증을 구현. 완료 기준은 실제 등록한 의뢰가 조회되고 전문가 입찰이 같은 의뢰에 나타나며 선정 결과가 새로고침 후 유지되는 것이다.
4. **결제와 진행 상태 구현:** 서버 주문 금액과 PG 승인 검증, 결제 결과 재조회, 실패·취소 처리를 연결. 완료 기준은 서버 검증된 결제에만 성공을 표시하고 의뢰·입찰·선정 상태가 일치하는 것이다.
5. **운영 기능과 사용성 완성:** 관리자 설정·회원 관리·통계·알림, 게시판·문의·자료실을 연결하고 검색·페이지·엑셀·라우트·이미지 문제를 해결. 실제 기능과 데모 범위를 화면에서도 구분한다.

후속 통합 검증에는 의뢰인, 비회원, 미신청·대기·승인·반려 전문가, 관리자 계정과 서로 다른 소유자의 의뢰가 필요하다. 최소 완료 시나리오는 “의뢰 등록 → 전문가 인증 승인 → 입찰 → 의뢰인 선정 → 결제 검증 → 진행 완료”이며, 각 단계에서 새로고침·권한 없는 접근·실패 후 재시도를 함께 확인해야 한다.
