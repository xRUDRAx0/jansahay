// ============================================================
// JANSAHAY — App Mode Management
// Manages Live vs Demo mode via localStorage
// ============================================================

export const APP_MODE_KEY = 'jansahay_mode';
export const LIVE_PROFILE_KEY = 'jansahay_live_profile';
export const LIVE_CONVERSATIONS_KEY = 'jansahay_live_conversations';

export type AppMode = 'live' | 'demo';

export function getStoredMode(): AppMode {
  if (typeof window === 'undefined') return 'live';
  const stored = localStorage.getItem(APP_MODE_KEY);
  if (stored === 'demo' || stored === 'live') return stored;
  return 'live';
}

export function setStoredMode(mode: AppMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APP_MODE_KEY, mode);
}

export function clearLiveSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LIVE_PROFILE_KEY);
  localStorage.removeItem(LIVE_CONVERSATIONS_KEY);
}
