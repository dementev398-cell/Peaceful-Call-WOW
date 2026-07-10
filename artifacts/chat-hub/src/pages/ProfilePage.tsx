import { PageTransition } from '@/components/PageTransition';
import { Link } from "wouter";
import { UserProfile } from "@clerk/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfilePage() {
  const { t, isRtl } = useLanguage();
  return (
    <PageTransition className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24 sm:py-32 max-w-4xl flex flex-col items-center">
        <div className="w-full flex justify-start mb-8" dir={isRtl ? 'rtl' : 'ltr'}>
          <Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors flex items-center text-sm font-medium">
            <ArrowLeft className={`w-4 h-4 mr-2 ${isRtl ? 'rotate-180 ml-2 mr-0' : 'mr-2'}`} /> {t('auth.backHome')}
          </Link>
        </div>
        
        <div className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
          <UserProfile routing="hash" />
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
