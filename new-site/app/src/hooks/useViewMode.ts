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
    setMode(newMode);
    
    // 保存到 localStorage
    try {
      localStorage.setItem('xyan_view_mode', newMode);
    } catch {
      // 忽略错误
    }
    
    // 更新 URL（不刷新页面）
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url);
    
    // 更新 body class
    if (newMode === 'studio') {
      document.body.classList.add('mode-studio');
    } else {
      document.body.classList.remove('mode-studio');
    }
  }, []);

  const toggleMode = useCallback(() => {
    setViewMode(mode === 'normal' ? 'studio' : 'normal');
  }, [mode, setViewMode]);

  // 初始化 body class
  useEffect(() => {
    if (mode === 'studio') {
      document.body.classList.add('mode-studio');
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
