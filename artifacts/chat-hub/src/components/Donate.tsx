import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { useContentDict } from '@/hooks/use-content';
import { Heart, ExternalLink } from 'lucide-react';

export function Donate() {
  const { t, isRtl } = useLanguage();
  const { dict } = useContentDict();

  const qrImage = dict['donation.qr_image'] || '/donate-qr.png';
  const walletNote = dict['donation.wallet_note'] || 'USDT (TRC20)';

  return (
    <section id="donate" className="py-24 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-primary/4 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 max-w-4xl relative z-10">
        <div className="bg-card border border-primary/20 rounded-[2rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-primary/15 to-transparent opacity-60 rounded-tl-[2rem]" />
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-primary/15 to-transparent opacity-60 rounded-br-[2rem]" />

          <ScrollReveal>
            <div className="text-center mb-10 relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                <Heart className="w-7 h-7 text-primary fill-primary/30" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                {t('support.title')}
              </h2>
              <div className="w-14 h-0.5 bg-primary mx-auto mb-5 rounded-full opacity-70" />
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-serif leading-relaxed">
                {t('support.text')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="100">
            <div className="flex flex-col items-center relative z-10 gap-6">
              {/* QR Code */}
              <div className="bg-white p-3.5 rounded-2xl shadow-lg border border-border/30">
                <img
                  src={qrImage}
                  alt="Donation QR Code"
                  className="w-44 h-44 md:w-56 md:h-56 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="bg-muted/60 px-5 py-2.5 rounded-full border border-border/50">
                <span className="font-mono text-sm font-medium text-foreground tracking-wide">
                  {walletNote}
                </span>
              </div>

              {/* Primary donation button */}
              <a
                href="https://new.donatepay.ru/@PeacefulCall"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all glow-gold shadow-lg"
              >
                <Heart className="w-4 h-4 fill-primary-foreground/60" />
                {t('support.button')}
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <p className="text-xs text-primary/70 font-medium uppercase tracking-widest text-center">
                {t('support.accepted')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
