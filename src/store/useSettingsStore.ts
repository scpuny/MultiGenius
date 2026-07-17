import { create } from "zustand";
import * as bridge from "../services/bridge";
import type { Settings } from "../types/models";

interface SettingsState {
  settings: Settings | null;
  load: () => Promise<void>;
  save: (s: Settings) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  load: async () => {
    const s = await bridge.getSettings();
    set({ settings: s });
  },
  save: async (s) => {
    const updated = await bridge.updateSettings(s);
    set({ settings: updated });
  },
}));
