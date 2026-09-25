import { create } from 'zustand';
import { DentoIroPaletteId } from '../types';
import { DENTO_IRO_PALETTES } from '../lib/constants';

interface ThemeState {
  currentPaletteId: DentoIroPaletteId;
  setPalette: (id: DentoIroPaletteId) => void;
}

// In-memory theme store (Strictly NO localStorage per user instruction)
export const useThemeStore = create<ThemeState>((set) => ({
  currentPaletteId: 'sakura',
  setPalette: (id: DentoIroPaletteId) => {
    document.documentElement.setAttribute('data-palette', id);
    set({ currentPaletteId: id });
  },
}));

export function getCurrentPaletteDetails(paletteId: DentoIroPaletteId) {
  return DENTO_IRO_PALETTES.find((p) => p.id === paletteId) || DENTO_IRO_PALETTES[0];
}
