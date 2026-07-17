import { create } from "zustand";
import * as bridge from "../services/bridge";
import type { Child } from "../types/models";

interface ChildState {
  children: Child[];
  currentChildId: string | null;
  loadChildren: () => Promise<void>;
  switchChild: (id: string) => Promise<void>;
  addChild: (p: { name: string; avatar: string; grade: number }) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  currentChildId: null,

  loadChildren: async () => {
    const list = await bridge.getChildren();
    set({
      children: list,
      currentChildId: get().currentChildId ?? list[0]?.id ?? null,
    });
  },

  switchChild: async (id) => {
    await bridge.switchChild(id);
    set({ currentChildId: id });
  },

  addChild: async (p) => {
    await bridge.addChild(p);
    await get().loadChildren();
  },

  deleteChild: async (id) => {
    await bridge.deleteChild(id);
    await get().loadChildren();
  },

  refresh: async () => {
    await get().loadChildren();
  },
}));

// 供 bridge.ts 在非 hook 上下文读取当前 childId
export function getCurrentChildId(): string | null {
  return useChildStore.getState().currentChildId;
}
