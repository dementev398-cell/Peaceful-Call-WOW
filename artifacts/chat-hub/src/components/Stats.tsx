import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollReveal } from './ScrollReveal';

export function Stats() {
  const { t, isRtl } = useLanguage();

  const statsList = [
    { value: '7M+', label: t('stats.views') },
    { value: '700+', label: t('stats.videos') },
    { value: '1000+', label: t('stats.hours') },
    { value: '120+', label: t('stats.faith') },
  ];

  return (
    <section className="py-24 bg-primary relative text-primary-foreground overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Refined elegant texture instead of grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,transparent_100%)]"></div>
      <div className="absolute inset-0 shimmer opacity-20"></div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 text-center divide-x divide-primary-foreground/10">
          {statsList.map((stat, idx) => (
            <ScrollReveal key={idx} delay={idx === 0 ? '0' : idx === 1 ? '100' : idx === 2 ? '200' : '300'}>
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 tracking-tighter drop-shadow-md">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                  {stat.label}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
