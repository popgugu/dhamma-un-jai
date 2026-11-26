import { ArrowLeft } from 'lucide-react';
import type { MouseEvent } from 'react';
import { t, type Locale } from '../i18n';
import { buildUrl, type Route } from '../utils/routing';

interface BackButtonProps {
  locale: Locale;
  to: Route;
  onNavigate: (route: Route) => void;
}

export function BackButton({ locale, to, onNavigate }: BackButtonProps) {
  const href = buildUrl(to, locale);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    onNavigate(to);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group inline-flex items-center gap-2 min-h-[44px] py-2 pr-4 -ml-1 text-[16px] text-[#6C655C] dark:text-[#B6AEA2] hover:text-[#3E3A35] dark:hover:text-[#EFEAE0] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8963E] rounded-lg whitespace-nowrap shrink-0"
    >
      <ArrowLeft
        className="w-4 h-4 text-[#C8963E] dark:text-[#DFB15E] transition-transform duration-150 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      <span>{t(locale, 'nav.back')}</span>
    </a>
  );
}
