export function requireClientInfoId(value: unknown): number {
  const id = value && typeof value === 'object' && 'id' in value ? value.id : undefined;
  if (typeof id !== 'number' || !Number.isSafeInteger(id) || id <= 0) {
    throw new Error('기업 정보 식별자를 확인할 수 없습니다. 다시 조회해 주세요.');
  }
  return id;
}

export function isMissingCompany(status: number, message: string) {
  return status === 404 && message === '기업 정보를 찾을 수 없습니다.';
}
