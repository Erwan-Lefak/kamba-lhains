import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';
import ErrorBoundary from '../components/ErrorBoundary';

interface MyAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps['pageProps'];
}

export default function App({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <LanguageProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </LanguageProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}