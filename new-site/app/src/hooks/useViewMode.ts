import { useState, useEffect, useCallback } from 'react';

export type ViewMode = 'normal' | 'studio';

export function useViewMode() {
  const [mode, setMode] = useState<ViewMode>(() => {
    // 检查 URL 参数
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    if (urlMode === 'studio' || urlMode === 'normal') {
      return urlMode;
    }
    
    // 检查 localStorage
    try {
      const stored = localStorage.getItem('xyan_view_mode') as ViewMode;
      if (stored === 'studio' || stored === 'normal') {
        return stored;
      }
    } catch {
      // localStorage 不可用
    }
    
    return 'normal';
  });

  const setViewMode = useCallback((newMode: ViewMode) => {
    console.log('[DEBUG] setViewMode called with:', newMode);
    console.log('[DEBUG] Current mode:', mode);
    
    setMode(newMode);
    
    // 保存到 localStorage
    try {
      localStorage.setItem('xyan_view_mode', newMode);
      console.log('[DEBUG] Saved to localStorage');
    } catch {
      console.log('[DEBUG] Failed to save to localStorage');
    }
    
    // 更新 URL（不刷新页面）
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url);
    console.log('[DEBUG] URL updated');
    
    // 更新 body class
    if (newMode === 'studio') {
      document.body.classList.add('mode-studio');
      console.log('[DEBUG] Added mode-studio class. Body classes:', document.body.className);
    } else {
      document.body.classList.remove('mode-studio');
      console.log('[DEBUG] Removed mode-studio class. Body classes:', document.body.className);
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setViewMode(mode === 'normal' ? 'studio' : 'normal');
  }, [mode, setViewMode]);

  // 初始化 body class - 在 mode 变化时更新
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
