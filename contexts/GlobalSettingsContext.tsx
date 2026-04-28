'use client';

import { createContext, useContext } from 'react';
import { GlobalSettings } from '@/types/modules';

interface GlobalSettingsContextValue extends GlobalSettings {
  setButtonColor: (color: string) => void;
}

export const GlobalSettingsContext = createContext<GlobalSettingsContextValue>({
  buttonColor: '#6366f1',
  setButtonColor: () => {},
});

export function useGlobalSettings() {
  return useContext(GlobalSettingsContext);
}
