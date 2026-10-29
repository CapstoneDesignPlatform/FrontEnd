import test from 'node:test';
import assert from 'node:assert/strict';
import { announcementStatus, formatAmount, ownsAnnouncement, parseMyAnnouncements, parseAnnouncementDetail } from '../src/api/clientAnnouncementsModel.ts';
const current = { id: 3, announcement_code: '01012345678XE', registered_at: '2026-10-30', industry: '건설업', purpose: '필요 면허', business_owner_type: '법인', status: 'CLOSED', progress_step: 4, bids: [], capital_scale: 10 };

test('마감은 완료가 아니며 선정 이후 진행 단계와 취소를 우선한다', () => {
  assert.equal(announcementStatus(current), '진행 중');
  assert.equal(announcementStatus({ status: 'CLOSED', progress_step: 3 }), '전문가 선택');
  assert.equal(announcementStatus({ status: 'CLOSED' }), '마감');
  assert.equal(announcementStatus({ status: 'CLOSED', progress_step: 7 }), '완료');
  assert.equal(announcementStatus({ status: 'CANCELLED', progress_step: 7 }), '취소');
  assert.equal(announcementStatus({ status: 'UNKNOWN', progress_step: 4 }), '상태 확인 필요');
});
test('숫자 ID나 다른 의뢰 코드로 상세 소유 확인을 통과할 수 없다', () => {
  const list = parseMyAnnouncements({ current_announcement: current, past_announcements: [{ ...current, id: 2, announcement_code: undefined, progress_step: undefined }] });
  assert.equal(ownsAnnouncement(list, current.announcement_code), true);
  assert.equal(ownsAnnouncement(list, '3'), false);
  assert.equal(ownsAnnouncement(list, '2'), false);
  assert.equal(ownsAnnouncement(list, 'OTHER'), false);
});
test('빈 목록과 잘못된 응답을 구별한다', () => {
  assert.deepEqual(parseMyAnnouncements({ current_announcement: null, past_announcements: [] }), { current_announcement: null, past_announcements: [] });
  for (const value of [null, {}, { current_announcement: null }, { current_announcement: {}, past_announcements: [] }]) assert.throws(() => parseMyAnnouncements(value));
});
test('다른 코드의 상세 응답과 잘못된 입찰 금액은 표시하지 않는다', () => {
  const detail = { ...current, client_info: {} };
  assert.equal(parseAnnouncementDetail(detail, current.announcement_code).announcement_code, current.announcement_code);
  assert.throws(() => parseAnnouncementDetail(detail, 'OTHER'));
  assert.throws(() => parseAnnouncementDetail({ ...detail, bids: [{ bid_amount: 'invalid', final_amount: null }] }, current.announcement_code));
});
test('미제공 금액을 0으로 만들지 않고 자본금 단위를 유지한다', () => {
  assert.equal(formatAmount(null), '미제공');
  assert.equal(formatAmount(0), '0원');
  assert.equal(formatAmount(2, '억원'), '2억원');
  assert.equal(formatAmount(2500000), '2,500,000원');
});
