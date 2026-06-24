"use client";

import { useEffect, useState } from "react";
import type { UiListing } from "@/lib/rh/api";

const STORAGE_KEY = "rh_saved";

function readSaved(): Record<string, UiListing> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

export function useSaved() {
  const [saved, setSaved] = useState<Record<string, UiListing>>({});

  useEffect(() => { setSaved(readSaved()); }, []);

  const toggle = (l: UiListing) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[l.id]) { delete next[l.id]; } else { next[l.id] = l; }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return { saved, items: Object.values(saved), toggle, isSaved: (id: string) => !!saved[id] };
}
