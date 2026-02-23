import { FileX, BookmarkX } from 'lucide-react';
import type { Language } from '@/types';
import { t } from '@/services/translation';

interface EmptyStateProps {
  type: 'articles' | 'favorites';
  language: Language;
}

export function EmptyState({ type, language }: EmptyStateProps) {
  const Icon = type === 'favorites' ? BookmarkX : FileX;
  const message = type === 'favorites' ? 'empty.no-favorites' : 'empty.no-articles';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm">{t(message, language)}</p>
    </div>
  );
}
