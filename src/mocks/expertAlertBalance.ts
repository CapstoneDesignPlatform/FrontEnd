import { useSyncExternalStore } from "react";
import { shouldUseMockApi } from "../api/apiMode";
import { mockExpertMembership } from "./expert";

const storageKey = `jindanmatch.mock.alertBalance.v1.${mockExpertMembership.memberNumber}`;
const initialBalance = { remainingCount: mockExpertMembership.initialRemainingAlerts };

interface AlertBalance {
  remainingCount: number;
  lastAdjustment?: { delta: number; reason: string };
}

function readBalance(raw: string | null): AlertBalance {
  if (!raw) return initialBalance;
  try {
    const saved = JSON.parse(raw);
    if (!Number.isSafeInteger(saved?.remainingCount) || saved.remainingCount < 0) return initialBalance;
    const adjustment = saved.lastAdjustment;
    return {
      remainingCount: saved.remainingCount,
      lastAdjustment: Number.isSafeInteger(adjustment?.delta) && typeof adjustment.reason === "string"
        ? { delta: adjustment.delta, reason: adjustment.reason }
        : undefined,
    };
  } catch {
    return initialBalance;
  }
}

function getSnapshot() {
  if (!shouldUseMockApi) return null;
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function subscribe(notify: () => void) {
  if (!shouldUseMockApi) return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) notify();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(storageKey, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(storageKey, notify);
  };
}

export function useMockExpertAlertBalance() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return shouldUseMockApi ? readBalance(raw) : null;
}

export async function saveMockExpertAlertBalance(before: number, after: number, reason: string) {
  function save() {
    if (readBalance(window.localStorage.getItem(storageKey)).remainingCount !== before) {
      return false;
    }
    const balance: AlertBalance = {
      remainingCount: after,
      lastAdjustment: { delta: after - before, reason },
    };
    window.localStorage.setItem(storageKey, JSON.stringify(balance));
    window.dispatchEvent(new Event(storageKey));
    return true;
  }

  return navigator.locks ? navigator.locks.request(storageKey, save) : save();
}
