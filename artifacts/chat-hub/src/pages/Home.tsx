import { PageTransition } from '@/components/PageTransition';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Verses } from '@/components/Verses';
import { About } from '@/components/About';
import { Stats } from '@/components/Stats';
import { FAQ } from '@/components/FAQ';
import { Donate } from '@/components/Donate';
import { Footer } from '@/components/Footer';
import { RecentPosts } from '@/components/RecentPosts';
import { Redirect } from 'wouter';
import { useUser } from '@clerk/react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.05),transparent_40%)]" />
        <motion.div animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <Loader2 className="w-10 h-10 animate-spin text-primary drop-shadow-[0_0_15px_rgba(240,160,32,0.5)]" />
        </motion.div>
      </div>
    );
  }

  if (isSignedIn) {
    return <Redirect to="/portal" />;
  }

  return (
    <PageTransition className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col relative z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Hero />
        <Verses />
        <About />
        <RecentPosts />
        <Stats />
        <FAQ />
        <Donate />
      </main>
      <Footer />
    </PageTransition>
  );
}
