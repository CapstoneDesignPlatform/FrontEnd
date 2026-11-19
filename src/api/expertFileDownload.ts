/** Fetch only authenticated API paths; metadata download_url is not trusted. */
export async function fetchExpertFile(
  fileId: number,
  accessToken: string | undefined,
  signal: AbortSignal,
  baseUrl = '/api',
): Promise<{ blob: Blob; filename: string }> {
  if (!Number.isSafeInteger(fileId) || fileId <= 0) throw new Error('다운로드할 파일 정보가 없습니다.');
  if (!accessToken) throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.');
  const path = `${baseUrl.replace(/\/$/, '')}/files/${fileId}`;
  const options = { headers: { Authorization: `Bearer ${accessToken}` }, credentials: 'include' as const, signal, redirect: 'error' as const };
  const checkStatus = (response: Response) => {
    if (response.status === 401) throw new Error('로그인이 만료되었습니다. 다시 로그인해 주세요.');
    if (response.status === 403) throw new Error('본인이 제출한 서류만 다운로드할 수 있습니다.');
    if (response.status === 404) throw new Error('서류를 찾을 수 없습니다. 파일이 교체되거나 삭제되었을 수 있습니다.');
    if (!response.ok) throw new Error('서류를 다운로드하지 못했습니다. 다시 시도해 주세요.');
  };
  const metadataResponse = await fetch(`${path}/download-url`, options);
  checkStatus(metadataResponse);
  const metadata = await metadataResponse.json();
  const file = metadata?.data?.file;
  if (metadata?.success !== true || file?.id !== fileId || typeof file.original_name !== 'string') {
    throw new Error('파일 정보를 확인할 수 없습니다. 다시 시도해 주세요.');
  }
  const response = await fetch(`${path}/download`, options);
  checkStatus(response);
  const type = response.headers.get('content-type')?.toLowerCase() ?? '';
  // JSON/HTML error responses must never be saved as documents, even with HTTP 200.
  if (type.includes('json') || type.startsWith('text/')) throw new Error('서버가 파일 대신 오류 응답을 반환했습니다.');
  const blob = await response.blob();
  if (!blob.size) throw new Error('다운로드할 파일이 비어 있습니다.');
  const filename = file.original_name.replace(/[\\/\u0000-\u001f\u007f]/g, '_').replace(/^\.+/, '').trim() || `제출서류-${fileId}`;
  return { blob, filename };
}
