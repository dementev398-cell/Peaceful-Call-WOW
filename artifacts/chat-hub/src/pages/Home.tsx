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

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Redirect to="/portal" />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Hero />
        <Verses />
        <About />
        <RecentPosts />
        <Stats />
        <FAQ />
        <Donate />
      </main>
      <Footer />
    </div>
  );
}
