import { createContext, useContext, type ReactNode } from "react";
import { useSyncExternalStore } from "react";
import type { GameStore } from "@/game/store";
import type { Snap } from "@/game/types";

const Ctx = createContext<GameStore | null>(null);

export function GameProvider({ store, children }: { store: GameStore; children: ReactNode }) {
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useGameStore(): GameStore {
  const store = useContext(Ctx);
  if (!store) throw new Error("Game store missing");
  return store;
}

export function useSnap(): Snap {
  const store = useGameStore();
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
