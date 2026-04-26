import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type AsyncDataState<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

type UseAsyncDataOptions<T> = {
  initialData?: T;
  keepPreviousData?: boolean;
};

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function useAsyncData<T>(
  load: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {},
) {
  const initialData = options.initialData ?? null;
  const keepPreviousData = options.keepPreviousData ?? false;
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<AsyncDataState<T>>({
    data: initialData,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let isActive = true;

    setState((current) => ({
      data: keepPreviousData ? current.data : initialData,
      error: null,
      isLoading: true,
    }));

    void load()
      .then((data) => {
        if (!isActive) return;
        setState({ data, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setState((current) => ({
          ...current,
          error: toError(error),
          isLoading: false,
        }));
      });

    return () => {
      isActive = false;
    };
  }, [initialData, keepPreviousData, load, reloadKey]);

  const setData: Dispatch<SetStateAction<T | null>> = useCallback((nextData) => {
    setState((current) => ({
      ...current,
      data:
        typeof nextData === "function"
          ? (nextData as (currentData: T | null) => T | null)(current.data)
          : nextData,
    }));
  }, []);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  return {
    ...state,
    reload,
    setData,
  };
}
