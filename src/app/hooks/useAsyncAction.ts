import { useCallback, useEffect, useRef, useState } from "react";

type UseAsyncActionOptions<TResult> = {
  onError?: (error: Error) => void;
  onSuccess?: (result: TResult) => void;
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: UseAsyncActionOptions<TResult> = {},
) {
  const { onError, onSuccess } = options;
  const isMountedRef = useRef(true);
  const pendingRef = useRef(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | undefined> => {
      if (pendingRef.current) return undefined;

      pendingRef.current = true;
      if (isMountedRef.current) {
        setError(null);
        setIsPending(true);
      }

      try {
        const result = await action(...args);
        if (isMountedRef.current) {
          onSuccess?.(result);
        }
        return result;
      } catch (caughtError: unknown) {
        const nextError = toError(caughtError);
        if (isMountedRef.current) {
          setError(nextError);
          onError?.(nextError);
        }
        return undefined;
      } finally {
        pendingRef.current = false;
        if (isMountedRef.current) {
          setIsPending(false);
        }
      }
    },
    [action, onError, onSuccess],
  );

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isPending,
    reset,
    run,
  };
}
