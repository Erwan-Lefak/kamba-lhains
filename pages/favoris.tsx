import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Products.module.css';

export default function Favoris() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{t('favorites.title')} - Kamba Lhains</title>
        <meta name="description" content={t('favorites.metaDescription')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.favoritesPage}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 className={styles.pageTitle}>{t('favorites.title')}</h1>
          </div>

          {favorites.length === 0 ? (
            <div className={styles.emptyFavorites}>
              <p>{t('favorites.empty')}</p>
              <p>{t('favorites.emptyDescription')}</p>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {favorites.map(product => (
                <div key={`${product.id}-${(product as any).selectedColor || 'default'}`} className={styles.favoriteItem}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}