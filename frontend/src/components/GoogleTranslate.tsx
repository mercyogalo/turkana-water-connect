import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById('google-translate-script')) {
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,sw,luo,ki,tuv,kln',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    const unsupportedLanguages = ['luo', 'ki', 'tuv', 'kln'];
    if (unsupportedLanguages.includes(i18n.language)) {
      addGoogleTranslateScript();
    }
  }, [i18n.language]);

  const unsupportedLanguages = ['luo', 'ki', 'tuv', 'kln'];
  const shouldShow = unsupportedLanguages.includes(i18n.language);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="hidden">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
