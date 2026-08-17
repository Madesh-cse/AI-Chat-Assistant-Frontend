import { create } from "zustand";

interface PluginStore {
  stackOverflowEnabled: boolean;
  toggleStackOverflow: () => void;
  enableStackOverflow: () => void;
  disableStackOverflow: () => void;

  notionEnabled: boolean;
  toggleNotion: () => void;
  enableNotion: () => void;
  disableNotion: () => void;
}

export const usePluginStore = create<PluginStore>((set) => ({
  stackOverflowEnabled: false,

  toggleStackOverflow: () => {
    set((state) => ({
      stackOverflowEnabled: !state.stackOverflowEnabled,
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

  notionEnabled: false,

  toggleNotion: () => {
    set((state) => ({
      notionEnabled: !state.notionEnabled,
    }));
  },

  enableNotion: () => {
    set({
      notionEnabled: true,
    });
  },

  disableNotion: () => {
    set({
      notionEnabled: false,
    });
  },
}));
