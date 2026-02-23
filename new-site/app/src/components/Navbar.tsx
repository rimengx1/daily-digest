import { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Theme, Language } from '@/types';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'rss', labelZh: 'RSS文章', labelEn: 'RSS' },
  { id: 'ai-hot', labelZh: 'AI热点', labelEn: 'AI Hot' },
  { id: 'recommended', labelZh: '个人推荐', labelEn: 'Recommended' },
  { id: 'history', labelZh: '往日回顾', labelEn: 'History' },
  { id: 'favorites', labelZh: '我的收藏', labelEn: 'Favorites' },
];

export function Navbar({
  theme,
  toggleTheme,
  language,
  toggleLanguage,
  activeSection,
  onSectionChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2'
          : 'py-4'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ${
          scrolled
            ? 'max-w-4xl px-4 py-2 rounded-full backdrop-blur-xl bg-background/80 border shadow-lg'
            : 'max-w-7xl px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-base hidden sm:block">AI News</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`px-2 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {language === 'zh' ? section.labelZh : section.labelEn}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full"
              title={language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Globe className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full"
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
