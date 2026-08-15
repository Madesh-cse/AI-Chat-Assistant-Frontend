import { create } from "zustand";

interface PluginStore {
  stackOverflowEnabled: boolean;
  toggleStackOverflow: () => void;
  enableStackOverflow: () => void;
  disableStackOverflow: () => void;
}

export const usePluginStore = create<PluginStore>((set) => ({
  stackOverflowEnabled: false,

  toggleStackOverflow: () => {
    set((state) => ({
      stackOverflowEnabled:
        !state.stackOverflowEnabled,
    }));
  },

  enableStackOverflow: () => {
    set({
      stackOverflowEnabled: true,
    });
  },

  disableStackOverflow: () => {
    set({
      stackOverflowEnabled: false,
    });
  },
}));