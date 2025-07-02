import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartProvider } from '../contexts/CartContext';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <LanguageProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}