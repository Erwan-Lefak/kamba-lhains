import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Charte() {
  const router = useRouter();

  useEffect(() => {
    // Redirection immédiate vers la page kambavers/charte
    router.replace('/kambavers/charte');
  }, [router]);

  return (
    <>
      <Head>
        <title>Nos valeurs - Kamba Lhains</title>
        <meta name="description" content="Découvrez nos valeurs et notre engagement pour une mode éthique et responsable." />
      </Head>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '11px',
        color: '#666'
      }}>
        Redirection vers nos valeurs...
      </div>
    </>
  );
}