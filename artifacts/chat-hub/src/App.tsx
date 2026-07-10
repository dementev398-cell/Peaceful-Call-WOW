import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import AdminPage from '@/pages/AdminPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminsPage from '@/pages/AdminsPage';
import PortalPage from '@/pages/PortalPage';
import SinglePostPage from '@/pages/SinglePostPage';
import PostsPage from '@/pages/PostsPage';
import MessagesPage from '@/pages/MessagesPage';
import HadithsPage from '@/pages/HadithsPage';
import SingleHadithPage from '@/pages/SingleHadithPage';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useEffect, useRef } from 'react';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.png`,
  },
  variables: {
    colorPrimary: 'hsl(40 88% 55%)',
    colorForeground: 'hsl(216 28% 95%)',
    colorMutedForeground: 'hsl(220 12% 58%)',
    colorDanger: 'hsl(0 70% 52%)',
    colorBackground: 'hsl(224 18% 7%)',
    colorInput: 'hsl(224 14% 16%)',
    colorInputForeground: 'hsl(216 28% 95%)',
    colorNeutral: 'hsl(224 14% 20%)',
    colorText: 'hsl(216 28% 95%)',
    colorTextSecondary: 'hsl(220 12% 58%)',
    colorTextOnPrimaryBackground: 'hsl(224 18% 7%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'rounded-3xl w-[440px] max-w-full overflow-hidden shadow-2xl border border-white/10',
    card: '!shadow-none !border-0 !bg-[hsl(224_18%_10%)] !rounded-none',
    footer: '!shadow-none !border-0 !bg-[hsl(224_18%_10%)] !rounded-none',
    headerTitle: 'font-serif text-2xl font-bold',
    formButtonPrimary: 'rounded-full h-11 text-sm font-bold',
    socialButtonsBlockButton: 'rounded-xl h-11 !border-white/15 !text-[hsl(216_28%_95%)] hover:!bg-white/8',
    socialButtonsBlockButtonText: '!text-[hsl(216_28%_95%)] font-medium',
    formFieldInput: 'rounded-xl h-11',
    identityPreviewText: '!text-[hsl(216_28%_95%)]',
    dividerText: '!text-[hsl(220_12%_58%)]',
    dividerLine: '!bg-white/10',
    alternativeMethodsBlockButton: '!text-[hsl(216_28%_95%)]',
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden gradient-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none" />
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 relative overflow-hidden gradient-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none" />
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/posts" component={PostsPage} />
      <Route path="/posts/:slug" component={SinglePostPage} />
      <Route path="/hadiths" component={HadithsPage} />
      <Route path="/hadiths/:id" component={SingleHadithPage} />

      <Route path="/portal">
        <Show when="signed-in"><PortalPage /></Show>
        <Show when="signed-out"><SignInPage /></Show>
      </Route>
      <Route path="/messages">
        <Show when="signed-in"><MessagesPage /></Show>
        <Show when="signed-out"><SignInPage /></Show>
      </Route>
      <Route path="/profile">
        <Show when="signed-in"><ProfilePage /></Show>
        <Show when="signed-out"><SignInPage /></Show>
      </Route>
      <Route path="/admin" component={AdminPage} />
      <Route path="/admins" component={AdminsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: 'С возвращением',
            subtitle: 'Войдите в свой аккаунт',
            actionText: 'Нет аккаунта?',
          },
        },
        signUp: {
          start: {
            title: 'Создайте аккаунт',
            subtitle: 'Присоединяйтесь к Peaceful Call',
            actionText: 'Уже есть аккаунт?',
          },
        },
        socialButtonsBlockButton: 'Продолжить через {{provider|titleize}}',
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Router />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <ClerkProviderWithRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
