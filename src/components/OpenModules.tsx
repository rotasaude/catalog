import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// Quais módulos estão abertos na lista, e de qual módulo o leitor veio por último.
// Sobrevive à troca de rota (contexto) e ao recarregar a aba (sessionStorage).
const KEY = "catalog.openModules";

function load(): Set<string> {
  try {
    const raw = sessionStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function save(open: Set<string>) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify([...open]));
  } catch {
    /* armazenamento indisponível: fica só em memória */
  }
}

interface OpenModulesValue {
  isOpen: (id: string) => boolean;
  setOpen: (id: string, open: boolean) => void;
  lastVisited: string | null;
  setLastVisited: (id: string | null) => void;
}

const Ctx = createContext<OpenModulesValue | null>(null);

export function OpenModulesProvider({ children }: { children: ReactNode }) {
  const [open, setOpenSet] = useState<Set<string>>(load);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  const setOpen = useCallback((id: string, value: boolean) => {
    setOpenSet((prev) => {
      if (prev.has(id) === value) return prev;
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      save(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isOpen: (id: string) => open.has(id), setOpen, lastVisited, setLastVisited }),
    [open, setOpen, lastVisited]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOpenModules(): OpenModulesValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useOpenModules fora do OpenModulesProvider");
  return value;
}
