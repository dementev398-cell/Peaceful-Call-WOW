import { PageTransition } from '@/components/PageTransition';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useListPosts } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostsPage() {
  const { t, isRtl } = useLanguage();
  const { data: posts = [], isLoading } = useListPosts();

  return (
    <PageTransition className="min-h-screen flex flex-col bg-background gradient-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold tracking-wider uppercase mb-6">
                <BookOpen className="w-4 h-4" />
                {t('posts.title')}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                {t('posts.title')}
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 mx-auto mb-6 rounded-full" />
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif">
                {t('posts.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <ScrollReveal>
              <div className="text-center py-24 glass rounded-3xl border border-border/50">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground font-serif text-xl">{t('posts.noArticles')}</p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, idx) => (
                <ScrollReveal key={post.id} delay={String((idx % 4) * 100)}>
                  <Link href={`/posts/${post.slug}`} className="block h-full group">
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="h-full glass rounded-3xl border border-border/50 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
                    >
                      {post.coverImageUrl ? (
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={post.coverImageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-20 bg-gradient-to-br from-primary/10 via-accent/20 to-transparent relative overflow-hidden">
                          <div className="absolute inset-0 shimmer" />
                        </div>
                      )}

                      <div className="p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20">
                            {t('posts.title').slice(0, -1) || 'Статья'}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString(
                              isRtl ? 'ar' : undefined,
                              { year: 'numeric', month: 'long', day: 'numeric' }
                            )}
                          </span>
                        </div>

                        <h2 className="text-xl font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-5 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
                          {post.authorName && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-3 h-3 text-primary" />
                              </div>
                              <span>{post.authorName}</span>
                            </div>
                          )}
                          <span className="flex items-center gap-1 text-sm font-semibold text-primary uppercase tracking-wide ml-auto">
                            {t('posts.readMore')}
                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
