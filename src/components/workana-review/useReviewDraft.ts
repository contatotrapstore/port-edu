"use client";

import { useCallback, useSyncExternalStore } from "react";

const namespace = "edh-workana-review-v1:";
const changeEvent = "edh-workana-review-draft-changed";
const memoryDrafts = new Map<string, string>();
const failedStorage = new Set<string>();

function subscribe(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === null) {
      memoryDrafts.clear();
      failedStorage.clear();
    } else if (event.key.startsWith(namespace)) {
      memoryDrafts.delete(event.key);
      failedStorage.delete(event.key);
    } else {
      return;
    }
    notify();
  }

  window.addEventListener(changeEvent, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, notify);
    window.removeEventListener("storage", onStorage);
  };
}

export function useReviewDraft(key: string, initialValue: string) {
  const storageKey = `${namespace}${key}`;
  const getSnapshot = useCallback(() => {
    const memoryValue = memoryDrafts.get(storageKey);
    if (memoryValue !== undefined) return memoryValue;
    try {
      return window.localStorage.getItem(storageKey) ?? initialValue;
    } catch {
      failedStorage.add(storageKey);
      return initialValue;
    }
  }, [storageKey, initialValue]);
  // The server and first hydration pass always render the supplied original.
  // React then reads the browser snapshot without an effect-driven reset.
  const getServerSnapshot = useCallback(() => initialValue, [initialValue]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storageUnavailable = useSyncExternalStore(
    subscribe,
    () => failedStorage.has(storageKey),
    () => false,
  );

  const setValue = useCallback((nextValue: string) => {
    memoryDrafts.set(storageKey, nextValue);
    try {
      window.localStorage.setItem(storageKey, nextValue);
      failedStorage.delete(storageKey);
    } catch {
      // Keep the edit usable even if storage is blocked or its quota is full.
      failedStorage.add(storageKey);
    }
    window.dispatchEvent(new Event(changeEvent));
  }, [storageKey]);

  const reset = useCallback(() => {
    memoryDrafts.set(storageKey, initialValue);
    try {
      window.localStorage.removeItem(storageKey);
      failedStorage.delete(storageKey);
    } catch {
      failedStorage.add(storageKey);
    }
    window.dispatchEvent(new Event(changeEvent));
  }, [storageKey, initialValue]);

  return { value, setValue, reset, storageUnavailable, changed: value !== initialValue };
}
