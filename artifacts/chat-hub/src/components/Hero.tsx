import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/react';
import { Heart } from 'lucide-react';

export function Hero() {
  const { t, isRtl } = useLanguage();
  const { isSignedIn } = useUser();

  const pills = [
    t('pill.meaning'),
    t('pill.happiness'),
    t('pill.peace'),
    t('pill.purpose'),
    t('pill.hope'),
    t('pill.mercy'),
  ];

  return (
    <section
      className="relative min-h-[92dvh] flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-24 overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,hsl(var(--primary)/0.13),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-[radial-gradient(ellipse,hsl(220_80%_60%/0.06),transparent_70%)] blur-2xl" />
        <div className="absolute top-40 right-10 w-44 h-44 bg-[radial-gradient(ellipse,hsl(var(--primary)/0.08),transparent_70%)] blur-2xl" />
        {/* Subtle floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${15 + i * 16}%`,
              top: `${28 + (i % 3) * 18}%`,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3.5 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <ScrollReveal className="max-w-4xl mx-auto flex flex-col items-center relative z-10 w-full">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full border border-primary/35 bg-primary/8 text-primary text-xs font-bold tracking-widest uppercase mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t('hero.eyebrow')}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-serif text-foreground leading-[1.1] mb-8 tracking-tight"
        >
          {t('hero.headline')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 font-serif italic font-light leading-relaxed"
        >
          &ldquo;{t('hero.question')}&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl text-foreground/75 max-w-2xl mb-12 leading-relaxed font-medium"
        >
          {t('hero.invite')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2.5 max-w-4xl mb-14"
        >
          {pills.map((pill, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.07 }}
              className="px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur text-sm font-medium text-foreground/80 shadow-sm hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 cursor-default"
            >
              {pill}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/posts" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all glow-gold shadow-lg">
            {t('nav.posts')}
          </Link>
          {!isSignedIn && (
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border/60 bg-card/50 backdrop-blur text-foreground font-bold text-sm uppercase tracking-wider hover:border-primary/40 hover:text-primary transition-all">
              {t('nav.signup')}
            </Link>
          )}
          <a
            href="https://new.donatepay.ru/@PeacefulCall"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-primary/25 bg-primary/8 text-primary font-bold text-sm uppercase tracking-wider hover:bg-primary/15 hover:border-primary/50 transition-all"
          >
            <Heart className="w-4 h-4 fill-primary/40" />
            {t('nav.donate')}
          </a>
        </motion.div>
      </ScrollReveal>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 rounded-full border-2 border-border/40 flex items-center justify-center">
          <div className="w-1 h-2.5 rounded-full bg-primary/50" />
        </div>
      </motion.div>
    </section>
  );
}
