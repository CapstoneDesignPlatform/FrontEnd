import { useCallback, useEffect, useRef } from "react";

import { revokeFilePreview } from "./filePreview";

export function useVerificationPreviewUrls() {
  const previewUrlsRef = useRef(new Set<string>());

  const trackPreviewUrl = useCallback((previewUrl: string) => {
    if (previewUrl) {
      previewUrlsRef.current.add(previewUrl);
    }
  }, []);

  const releasePreviewUrl = useCallback((previewUrl: string) => {
    if (!previewUrl || !previewUrlsRef.current.has(previewUrl)) return;

    revokeFilePreview(previewUrl);
    previewUrlsRef.current.delete(previewUrl);
  }, []);

  const releaseAllPreviewUrls = useCallback(() => {
    previewUrlsRef.current.forEach(revokeFilePreview);
    previewUrlsRef.current.clear();
  }, []);

  useEffect(() => releaseAllPreviewUrls, [releaseAllPreviewUrls]);

  return {
    releasePreviewUrl,
    trackPreviewUrl,
  };
}
