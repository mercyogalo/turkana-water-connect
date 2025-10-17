import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'luo', name: 'Luo', nativeName: 'Dholuo' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ' },
  { code: 'tuv', name: 'Turkana', nativeName: 'Ngaturkana' },
  { code: 'kln', name: 'Kalenjin', nativeName: 'Kalenjin' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLang(langCode);
    localStorage.setItem('i18nextLng', langCode);
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLang);
    return lang ? lang.nativeName : 'English';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getCurrentLanguageName()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLang === language.code ? 'bg-accent' : ''}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
