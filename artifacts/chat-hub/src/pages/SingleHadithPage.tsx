import { PageTransition } from '@/components/PageTransition';
import { useGetHadith } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Loader2, ArrowLeft, BookMarked } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import NotFound from './not-found';
import { useLanguage } from '@/contexts/LanguageContext';
import { GRADE_META } from '@/lib/hadithGrades';

export default function SingleHadithPage() {
  const { id } = useParams();
  const { t, isRtl, language } = useLanguage();
  const hadithId = Number(id);
  const { data: hadith, isLoading, error } = useGetHadith(hadithId, {
    query: { enabled: Number.isFinite(hadithId), queryKey: ['/api/hadiths', hadithId] },
  });

  if (isLoading) {
    return (
      <PageTransition className="min-h-screen flex flex-col bg-background gradient-bg">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
      </PageTransition>
  );
}

  if (error || !hadith || !Number.isFinite(hadithId)) {
    return <NotFound />;
  }

  const meta = GRADE_META[hadith.grade] || GRADE_META.sahih;

  return (
    <PageTransition className="min-h-screen flex flex-col bg-background gradient-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow pt-24 pb-32">
        <article className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <ScrollReveal>
            <Link href="/hadiths" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-10 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('posts.back')}
            </Link>

            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${meta.className}`}>
                {meta.label[language] || meta.label.EN}
              </span>
              {hadith.topic && (
                <span className="text-sm text-muted-foreground">{hadith.topic}</span>
              )}
            </div>

            <div className="glass rounded-3xl border border-border/50 p-8 sm:p-12 mb-8 relative overflow-hidden">
              <BookMarked className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
              <p className="font-serif text-2xl sm:text-3xl text-foreground leading-relaxed whitespace-pre-wrap">
                {hadith.text}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground border-t border-border/30 pt-6">
              {hadith.narrator && (
                <div>
                  <span className="font-semibold text-foreground">{t('hadiths.narrator')}: </span>
                  {hadith.narrator}
                </div>
              )}
              {hadith.source && (
                <div>
                  <span className="font-semibold text-foreground">{t('hadiths.source')}: </span>
                  {hadith.source}
                </div>
              )}
            </div>
          </ScrollReveal>
        </article>
      </main>
      <Footer />
    </PageTransition>
  );
}
