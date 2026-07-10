import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListAdmins } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, MessageCircle, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminsPage() {
  const { data: admins, isLoading } = useListAdmins();
  const { t, isRtl } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background gradient-bg" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-32 max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('admins.team')}
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-serif">
              {t('admins.teamDesc')}
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admins?.map((admin, idx) => (
              <ScrollReveal key={admin.id} delay={String(idx * 100)}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="glass rounded-[2rem] p-8 text-center flex flex-col items-center border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 relative ${
                    admin.role === 'owner'
                      ? 'bg-primary/20 border-primary/50 glow-gold-sm'
                      : 'bg-muted/50 border-border'
                  }`}>
                    {admin.role === 'owner' ? (
                      <Crown className="w-10 h-10 text-primary" />
                    ) : (
                      <Shield className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                    {admin.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border ${
                    admin.role === 'owner'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted/50 text-muted-foreground border-border/50'
                  }`}>
                    {admin.role === 'owner' ? (
                      <><Crown className="w-3 h-3" /> {t('admins.founder')}</>
                    ) : (
                      <><Shield className="w-3 h-3" /> {t('admins.admin')}</>
                    )}
                  </span>
                  <Link
                    href="/messages"
                    className="mt-auto inline-flex items-center justify-center w-full h-12 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-semibold tracking-wide transition-all duration-300 gap-2 hover:glow-gold-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('admins.writeMessage')}
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
