import { SessionProvider, useSession } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { HeaderProvider } from '../contexts/HeaderContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { TikTokPixel } from '../components/TikTokPixel';
import { MetaPixel } from '../components/MetaPixel';
// Contentsquare script is now loaded directly in _document.tsx for better reliability
// import { ContentsquareDebugger } from '../components/ContentsquareDebugger'; // Temporarily disabled
import MaintenanceOverlay from '../components/MaintenanceOverlay';
import { trackPageView } from '../utils/sessionManager';

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps['pageProps'];
}

// Component to track page views
function PageViewTracker({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Track initial page view
    const userId = session?.user?.email;
    trackPageView(router.pathname, userId);

    // Track route changes
    const handleRouteChange = (url: string) => {
      trackPageView(url, userId);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname, router.events, session]);

  return <>{children}</>;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  // Vérifier si le mode maintenance est activé
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="icon-heart-kamba" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="black"/>
          </symbol>
          <symbol id="icon-heart-kamba-plain" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="black" strokeWidth="1.5"/>
          </symbol>
          <symbol id="icon-heart-kamba-red" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#b91c1c"/>
          </symbol>
        </defs>
      </svg>
      <ErrorBoundary>
        <SessionProvider session={session}>
          <PageViewTracker>
            {/* <ContentsquareDebugger /> */} {/* Temporarily disabled for deployment */}
            <HeaderProvider>
              <LanguageProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <TikTokPixel />
                    <MetaPixel />
                  {/* Overlay de maintenance désactivé */}
                  <Component {...pageProps} />
                </FavoritesProvider>
              </CartProvider>
            </LanguageProvider>
            </HeaderProvider>
          </PageViewTracker>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}