import { useState, useEffect, useCallback } from 'react';

export type ViewMode = 'normal' | 'studio';

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'studio' || urlMode === 'normal') {
      return urlMode;
    }

    // Force studio mode as default on every direct visit.
    return 'studio';
  });

  const setViewMode = useCallback((newMode: ViewMode) => {
    setMode(newMode);

    try {
      localStorage.setItem('xyan_view_mode', newMode);
    } catch {
      // ignore localStorage errors
    }

    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url);

    if (newMode === 'studio') {
      document.body.classList.add('mode-studio');
    } else {
      document.body.classList.remove('mode-studio');
    }
  }, []);

  const toggleMode = useCallback(() => {
    setViewMode(mode === 'normal' ? 'studio' : 'normal');
  }, [mode, setViewMode]);

  useEffect(() => {
    if (mode === 'studio') {
      document.body.classList.add('mode-studio');
    } else {
      document.body.classList.remove('mode-studio');
    }
  }, [mode]);

  return {
    mode,
    setMode: setViewMode,
    toggleMode,
    isStudio: mode === 'studio',
    isNormal: mode === 'normal',
  };
}
