import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { Language } from '@/types';
import { t } from '@/services/translation';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface RefreshIndicatorProps {
  lastRefresh: Date | null;
  isRefreshing: boolean;
  language: Language;
}

export function RefreshIndicator({ lastRefresh, isRefreshing, language }: RefreshIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const dateLocale = language === 'zh' ? zhCN : enUS;

  useEffect(() => {
    const updateTimeAgo = () => {
      if (lastRefresh) {
        const distance = formatDistanceToNow(lastRefresh, {
          addSuffix: true,
          locale: dateLocale,
        });
        setTimeAgo(distance);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastRefresh, dateLocale]);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? (
        <span>{t('refresh.refreshing', language)}</span>
      ) : lastRefresh ? (
        <span>
          {t('refresh.last-updated', language)}: {timeAgo}
        </span>
      ) : null}
    </div>
  );
}
