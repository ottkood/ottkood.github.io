import { useState, useEffect, useCallback } from "react";
import type { Phone } from "@/types/phone";

const STORAGE_KEY = "phone-ranking-data";

const loadFromStorage = (): Phone[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function usePhoneList() {
  const [phones, setPhones] = useState<Phone[]>(loadFromStorage);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phones));
    setLastSaved(new Date());
  }, [phones]);

  const addPhone = useCallback((phone: Omit<Phone, "id">) => {
    setPhones((prev) => [...prev, { ...phone, id: crypto.randomUUID() }]);
  }, []);

  const updatePhone = useCallback((id: string, data: Omit<Phone, "id">) => {
    setPhones((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const removePhone = useCallback((id: string) => {
    setPhones((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reorder = useCallback((startIndex: number, endIndex: number) => {
    setPhones((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const loadPhones = useCallback((data: Phone[]) => {
    setPhones(data);
  }, []);

  return { phones, addPhone, updatePhone, removePhone, reorder, loadPhones, lastSaved };
}
