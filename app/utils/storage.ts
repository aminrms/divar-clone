// /utils/storage.ts

const isBrowser = typeof window !== "undefined";

// ---------- Local Storage ----------

export const setLocalStorage = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`setLocalStorage error for key "${key}":`, err);
  }
};

export const getLocalStorage = <T>(key: string, fallback: T | null = null): T | null => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`getLocalStorage parse error for key "${key}":`, err);
    return fallback;
  }
};

export const removeLocalStorage = (key: string): void => {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`removeLocalStorage error for key "${key}":`, err);
  }
};

// ---------- Session Storage ----------

export const setSessionStorage = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`setSessionStorage error for key "${key}":`, err);
  }
};

export const getSessionStorage = <T>(key: string, fallback: T | null = null): T | null => {
  if (!isBrowser) return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`getSessionStorage parse error for key "${key}":`, err);
    return fallback;
  }
};

export const removeSessionStorage = (key: string): void => {
  if (!isBrowser) return;
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.error(`removeSessionStorage error for key "${key}":`, err);
  }
};

// ---------- Cookies ----------

export type CookieOptions = {
  /** Days until expiration; omit for a session cookie */
  days?: number;
  /** Path scope, default "/" */
  path?: string;
  /** Domain scope, optional */
  domain?: string;
  /** Use secure cookies over HTTPS only */
  secure?: boolean;
  /** SameSite policy */
  sameSite?: "Strict" | "Lax" | "None";
};

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (!isBrowser) return;

  const { days, path = "/", domain, secure, sameSite = "Lax" } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path};`;

  if (days !== undefined) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie += ` expires=${date.toUTCString()};`;
  }

  if (domain) {
    cookie += ` domain=${domain};`;
  }

  // SameSite
  cookie += ` SameSite=${sameSite};`;

  // If SameSite=None, Secure MUST be set (browser requirement)
  if (secure || sameSite === "None") {
    cookie += " Secure;";
  }

  document.cookie = cookie;
};

export const getCookie = (name: string): string | null => {
  if (!isBrowser) return null;

  const target = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const c of cookies) {
    if (c.startsWith(target)) {
      return decodeURIComponent(c.substring(target.length));
    }
  }
  return null;
};

export const removeCookie = (name: string, options: Omit<CookieOptions, "days"> = {}): void => {
  // set it to expired date
  setCookie(name, "", { ...options, days: -1 });
};
