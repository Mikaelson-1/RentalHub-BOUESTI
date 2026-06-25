"use client";
import { useState, useEffect } from "react";
import type { UiListing } from "./api";

const MAX = 2;
const KEY = "rh_compare";

export function useCompare() {
  const [items, setItems] = useState<UiListing[]>([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
  }, []);

  const persist = (next: UiListing[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  };

  const add = (l: UiListing) =>
    setItems((prev) => prev.find((x) => x.id === l.id) || prev.length >= MAX ? prev : persist([...prev, l]));

  const remove = (id: string) =>
    setItems((prev) => persist(prev.filter((x) => x.id !== id)));

  const toggle = (l: UiListing) =>
    setItems((prev) => {
      const exists = prev.find((x) => x.id === l.id);
      return persist(exists ? prev.filter((x) => x.id !== l.id) : prev.length < MAX ? [...prev, l] : prev);
    });

  const clear = () => { try { localStorage.removeItem(KEY); } catch {} setItems([]); };
  const hasId = (id: string) => items.some((x) => x.id === id);
  const full = items.length >= MAX;

  return { items, add, remove, toggle, hasId, clear, full };
}
