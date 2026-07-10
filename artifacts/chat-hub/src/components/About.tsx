import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { useContentDict } from '@/hooks/use-content';

export function About() {
  const { t, isRtl } = useLanguage();
  const { dict } = useContentDict();

  const logoImg = dict['site.logo'] || '/logo-source.jpg';

  const bullets = [
    t('about.bullet.1'),
    t('about.bullet.2'),
    t('about.bullet.3'),
    t('about.bullet.4'),
  ];

  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <ScrollReveal>
            <div className="relative group">
              <div className="aspect-[4/5] max-w-md mx-auto rounded-[2rem] bg-card border border-border shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="w-48 h-48 rounded-full border border-primary/20 bg-background shadow-xl flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-700">
                    <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-full opacity-90" />
                  </div>
                </div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-[radial-gradient(circle,hsl(var(--primary)/0.3)_2px,transparent_2px)] [background-size:16px_16px]"></div>
              <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-[radial-gradient(circle,hsl(var(--primary)/0.3)_2px,transparent_2px)] [background-size:16px_16px]"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="100">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8">
              {t('about.title')}
            </h2>
            <div className="w-16 h-1 bg-primary mb-10 rounded-full"></div>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 font-light">
              {t('about.desc')}
            </p>

            <ul className="space-y-6 mb-16">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-card border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-lg text-foreground font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="p-8 bg-card border-l-4 border-primary rounded-r-2xl shadow-sm">
              <p className="text-2xl font-serif italic text-foreground leading-snug">
                {t('about.closing')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
