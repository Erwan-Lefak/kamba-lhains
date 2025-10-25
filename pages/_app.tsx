import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import Head from 'next/head';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { TikTokPixel } from '../components/TikTokPixel';

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
          <LanguageProvider>
            <CartProvider>
              <FavoritesProvider>
                <TikTokPixel />
                <Component {...pageProps} />
              </FavoritesProvider>
            </CartProvider>
          </LanguageProvider>
        </SessionProvider>
      </ErrorBoundary>
    </>
  );
}