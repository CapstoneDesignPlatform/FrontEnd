type QueryValue = string | number | boolean | null | undefined;

export interface ApiErrorPayload {
  code?: string;
  details?: unknown;
  message?: string;
}

export class ApiError extends Error {
  code?: string;
  details?: unknown;
  payload: unknown;
  status: number;

  constructor(status: number, payload: unknown) {
    super(getErrorMessage(payload, status));
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;

    if (isRecord(payload)) {
      this.code = typeof payload.code === "string" ? payload.code : undefined;
      this.details = payload.details;
    }
  }
}

interface ApiClientOptions {
  baseUrl?: string;
  credentials?: RequestCredentials;
  getAccessToken?: () => string | undefined;
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, QueryValue>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(payload: unknown, status: number) {
  if (isRecord(payload) && typeof payload.message === "string") {
    return payload.message;
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  return `API request failed with status ${status}`;
}

function getDefaultAccessToken() {
  return window.localStorage.getItem("serviceplatform.accessToken") ?? undefined;
}

function isBodyInit(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams
  );
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>) {
  const url = path.startsWith("http")
    ? new URL(path)
    : new URL(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly credentials: RequestCredentials;
  private readonly getAccessToken: () => string | undefined;

  constructor({
    baseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api",
    credentials = "include",
    getAccessToken = getDefaultAccessToken,
  }: ApiClientOptions = {}) {
    this.baseUrl = baseUrl;
    this.credentials = credentials;
    this.getAccessToken = getAccessToken;
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const { body, headers: optionHeaders, query, ...requestOptions } = options;
    const headers = new Headers(optionHeaders);
    const token = this.getAccessToken();
    let requestBody: BodyInit | undefined;

    headers.set("Accept", "application/json");

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (body !== undefined) {
      if (isBodyInit(body)) {
        requestBody = body;
      } else {
        headers.set("Content-Type", "application/json");
        requestBody = JSON.stringify(body);
      }
    }

    const response = await fetch(buildUrl(this.baseUrl, path, query), {
      credentials: this.credentials,
      ...requestOptions,
      body: requestBody,
      headers,
    });
    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(response.status, payload);
    }

    return payload as T;
  }

  get<T>(path: string, options?: ApiRequestOptions) {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  patch<T>(path: string, options?: ApiRequestOptions) {
    return this.request<T>(path, { ...options, method: "PATCH" });
  }

  post<T>(path: string, options?: ApiRequestOptions) {
    return this.request<T>(path, { ...options, method: "POST" });
  }
}

export const apiClient = new ApiClient();
