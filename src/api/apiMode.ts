export type ApiMode = "mock" | "http";

function getApiMode(): ApiMode {
  const mode = import.meta.env.VITE_API_MODE;

  if (mode === "mock" || mode === "http") {
    return mode;
  }

  return import.meta.env.DEV ? "mock" : "http";
}

export const apiMode = getApiMode();
export const shouldUseMockApi = apiMode === "mock";
