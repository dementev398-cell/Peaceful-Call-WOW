import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useContentDict } from '@/hooks/use-content';
import { SignOutButton, useUser } from '@clerk/react';
import { UserMenu } from './UserMenu';
import { Menu, X, LogOut, BookOpen, ScrollText, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dict } = useContentDict();
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoImg = dict['site.logo'] || '/logo-source.jpg';
  const siteName = dict['site.name'] || 'Peaceful Call';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-border/30 py-2.5'
          : 'bg-transparent py-4'
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 flex items-center justify-center overflow-hidden rounded-full border border-primary/30 group-hover:border-primary/60 transition-all shadow-sm bg-card/50">
            <img src={logoImg} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif font-semibold text-base tracking-wide text-foreground hidden sm:block group-hover:text-primary transition-colors">
            {siteName}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-5">
          <a href="#about" className="text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            {t('nav.about')}
          </a>
          <a href="#faq" className="text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            {t('nav.faq')}
          </a>
          <Link href="/posts" className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {t('nav.posts')}
          </Link>
          <Link href="/hadiths" className="text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase flex items-center gap-1.5">
            <ScrollText className="w-3.5 h-3.5" />
            {t('nav.hadiths')}
          </Link>
          <a href="#contact" className="text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            {t('nav.contact')}
          </a>
          {/* Donation button */}
          <a
            href="https://new.donatepay.ru/@PeacefulCall"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-primary/90 hover:text-primary transition-colors uppercase"
          >
            <Heart className="w-3.5 h-3.5 fill-primary/40" />
            {t('nav.donate')}
          </a>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-0.5 bg-muted/40 p-1 rounded-full border border-border/40">
            {(['RU', 'EN', 'AR'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-all duration-300 ${
                  language === lang
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Auth — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {isSignedIn ? (
              <>
                <Link
                  href="/admin"
                  className="h-8 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase hover:bg-primary/20 transition-all duration-300 inline-flex items-center border border-primary/20 hover:border-primary/40"
                >
                  {t('nav.admin')}
                </Link>
                <UserMenu />
              </>
            ) : (
              <Link
                href="/sign-in"
                className="h-8 px-4 rounded-full border border-primary/50 text-primary text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-flex items-center"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 glass-strong border-b border-border/30 px-5 py-5 flex flex-col gap-3.5 shadow-2xl"
          >
            <a href="#about" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase py-1.5 border-b border-border/20">
              {t('nav.about')}
            </a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase py-1.5 border-b border-border/20">
              {t('nav.faq')}
            </a>
            <Link href="/posts" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase py-1.5 border-b border-border/20">
              <BookOpen className="w-4 h-4" />
              {t('nav.posts')}
            </Link>
            <Link href="/hadiths" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-semibold tracking-widest text-muted-foreground hover:text-primary transition-colors uppercase py-1.5 border-b border-border/20">
              <ScrollText className="w-4 h-4" />
              {t('nav.hadiths')}
            </Link>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="text-sm font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase py-1.5 border-b border-border/20">
              {t('nav.contact')}
            </a>
            {/* Donation */}
            <a
              href="https://new.donatepay.ru/@PeacefulCall"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold tracking-widest text-primary uppercase py-1.5 border-b border-border/20"
            >
              <Heart className="w-4 h-4 fill-primary/40" />
              {t('nav.donate')}
            </a>
            <div className="pt-1.5">
              {isSignedIn ? (
                <div className="flex items-center gap-2.5">
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20">
                    {t('nav.admin')}
                  </Link>
                  <SignOutButton>
                    <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-border text-muted-foreground text-xs font-bold uppercase hover:text-destructive hover:border-destructive transition-all">
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav.signout')}
                    </button>
                  </SignOutButton>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="flex-1 inline-flex items-center justify-center h-10 rounded-full border border-primary/50 text-primary text-xs font-bold tracking-widest uppercase">
                    {t('nav.signin')}
                  </Link>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="flex-1 inline-flex items-center justify-center h-10 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-widest uppercase">
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
