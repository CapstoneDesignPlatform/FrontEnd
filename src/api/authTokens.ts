import Cookies from "js-cookie";

const ACCESS_TOKEN_COOKIE_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_COOKIE_KEY = "REFRESH_TOKEN";
const ACCESS_TOKEN_STORAGE_KEY = "serviceplatform.accessToken";
const REFRESH_TOKEN_STORAGE_KEY = "serviceplatform.refreshToken";

export interface AuthTokenPayload {
  accessToken?: string | null;
  access_token?: string | null;
  refreshToken?: string | null;
  refresh_token?: string | null;
}

function getLocalStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
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
}
