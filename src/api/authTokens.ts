import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_COOKIE_KEY = "REFRESH_TOKEN";
const ACCESS_TOKEN_STORAGE_KEY = "serviceplatform.accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "serviceplatform.refreshToken";
const ADMIN_SESSION_STORAGE_KEY = "admin-auth";

export interface AuthTokenPayload {
  accessToken?: string | null;
  access_token?: string | null;
  refreshToken?: string | null;
  refresh_token?: string | null;
}

function getLocalStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function getSessionStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

/** 관리자 로그인 성공 후 호출. 토큰이 바뀌면 clearAuthTokens()가 함께 해제한다. */
export function markAdminSession() {
  getSessionStorage()?.setItem(ADMIN_SESSION_STORAGE_KEY, "true");
}

/** 관리자 플래그와 실제 토큰이 모두 있어야 관리자 세션으로 본다. */
export function hasAdminSession() {
  return getSessionStorage()?.getItem(ADMIN_SESSION_STORAGE_KEY) === "true"
    && Boolean(getStoredAccessToken());
}

export function getStoredAccessToken() {
  return (
    getLocalStorage()?.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
    Cookies.get(ACCESS_TOKEN_COOKIE_KEY)
  );
}

export function persistAuthTokens(payload: AuthTokenPayload) {
  const accessToken = payload.accessToken ?? payload.access_token;
  const refreshToken = payload.refreshToken ?? payload.refresh_token;
  const storage = getLocalStorage();

  if (accessToken) {
    storage?.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    Cookies.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, { expires: 1 });
  }

  if (refreshToken) {
    storage?.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    Cookies.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, { expires: 7 });
  }

  return Boolean(accessToken);
}

export function clearAuthTokens() {
  const storage = getLocalStorage();

  storage?.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  storage?.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  Cookies.remove(ACCESS_TOKEN_COOKIE_KEY);
  Cookies.remove(REFRESH_TOKEN_COOKIE_KEY);
  Cookies.remove("USER_ROLE");
  Cookies.remove("CLIENT_INFO_ID");
  getSessionStorage()?.removeItem(ADMIN_SESSION_STORAGE_KEY);
}
