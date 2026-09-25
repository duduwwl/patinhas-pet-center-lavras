"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

const storageKey = "patinhas:favorites:v1";
const changeEvent = "patinhas:favorites:changed";
let sessionSnapshot = "[]";
type FavoritesContextValue = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function parseIds(snapshot: string): string[] {
  try {
    const value: unknown = JSON.parse(snapshot);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? sessionSnapshot;
  } catch {
    return sessionSnapshot;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(changeEvent, onChange);
  };
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const ids = useMemo(() => parseIds(snapshot), [snapshot]);

  const toggle = useCallback((id: string) => {
    const current = parseIds(getSnapshot());
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    sessionSnapshot = JSON.stringify(next);
    try {
      window.localStorage.setItem(storageKey, sessionSnapshot);
    } catch {
      // Mantém os favoritos nesta sessão quando o armazenamento estiver bloqueado.
    }
    window.dispatchEvent(new Event(changeEvent));
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used inside FavoritesProvider");
  return context;
}
