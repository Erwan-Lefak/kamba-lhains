import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/Products.module.css';

export default function Favoris() {
  const { favorites } = useFavorites();

  return (
    <>
      <Head>
        <title>Favoris - Kamba Lhains</title>
        <meta name="description" content="Vos produits favoris Kamba Lhains" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.favoritesPage}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Mes Favoris</h1>
          
          {favorites.length === 0 ? (
            <div className={styles.emptyFavorites}>
              <p>Vous n'avez encore ajouté aucun produit à vos favoris.</p>
              <p>Explorez nos collections et ajoutez vos coups de cœur !</p>
            </div>
          ) : (
            <div className={styles.favoritesGrid}>
              {favorites.map(product => (
                <div key={product.id} className={styles.favoriteItem}>
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