import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import Head from 'next/head';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import ErrorBoundary from '../components/ErrorBoundary';

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps['pageProps'];
}

export default function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ErrorBoundary>
        <SessionProvider session={session}>
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <Component {...pageProps} />
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}