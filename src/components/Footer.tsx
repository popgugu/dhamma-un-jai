import { t, type Locale } from '../i18n';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-[#E7DFD0] dark:border-[#36312A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-[15px] text-[#6C655C] dark:text-[#B6AEA2] leading-[1.8]">
          {t(locale, 'site.footer')}
        </p>
      </div>
    </footer>
  );
}
