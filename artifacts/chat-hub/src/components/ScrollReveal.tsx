import { useState, useEffect } from 'react';

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = '0' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: string; 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    // Simple intersection observer or just reveal after short delay for now to ensure visibility
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasRevealed(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
