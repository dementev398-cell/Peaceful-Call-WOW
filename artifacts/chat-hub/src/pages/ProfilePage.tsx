import { Link } from "wouter";
import { UserProfile } from "@clerk/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-24 sm:py-32 max-w-4xl flex flex-col items-center">
        <div className="w-full flex justify-start mb-8">
          <Link href="/portal" className="text-muted-foreground hover:text-primary transition-colors flex items-center text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Вернуться на портал
          </Link>
        </div>
        
        <div className="w-full">
          <UserProfile routing="hash" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
