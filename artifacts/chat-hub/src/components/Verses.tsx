import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

export function Verses() {
  const { t, isRtl } = useLanguage();

  const versesList = [
    { quote: t('verses.1.quote'), cite: t('verses.1.cite') },
    { quote: t('verses.2.quote'), cite: t('verses.2.cite') },
    { quote: t('verses.3.quote'), cite: t('verses.3.cite') },
    { quote: t('verses.4.quote'), cite: t('verses.4.cite') },
  ];

  return (
    <section className="py-32 bg-card border-y border-border/50 relative" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent ml-8 hidden md:block"></div>
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent mr-8 hidden md:block"></div>

      <div className="container mx-auto px-6 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {t('verses.title')}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-8 rounded-full opacity-80"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {versesList.map((verse, idx) => (
            <ScrollReveal key={idx} delay={idx % 2 === 0 ? '0' : '100'} className="h-full">
              <div className="h-full group relative">
                <div className="absolute -inset-4 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 h-full flex flex-col justify-center border-l-2 border-primary/20 group-hover:border-primary transition-colors duration-500">
                  <p className="text-2xl md:text-3xl font-serif text-foreground leading-snug mb-8 font-light italic">
                    «{verse.quote}»
                  </p>
                  <p className="text-xs font-bold text-primary uppercase tracking-[0.2em]">
                    {verse.cite}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
