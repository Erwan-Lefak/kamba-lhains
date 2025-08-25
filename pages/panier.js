import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Cart.module.css';

export default function Cart() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, getFormattedTotal, getTotalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
    } else {
      updateQuantity(cartId, parseInt(newQuantity));
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  const getShippingCost = () => {
    return getTotalPrice() >= 150 ? 0 : 9.90;
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost();
  };

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>panier - kamba lhains</title>
          <meta name="description" content="votre panier kamba lhains" />
        </Head>

        <Header />

        <main className={styles.cartPage}>
          <div className={styles.emptyCart}>
            <h1 className={styles.emptyTitle}>Votre panier est vide</h1>
            <p className={styles.emptyDescription}>
              Découvrez notre collection
            </p>
            <Link href="/" className={styles.continueButton}>
              Continuer
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>panier ({items.length}) - kamba lhains</title>
        <meta name="description" content="votre panier kamba lhains" />
      </Head>

      <Header />

      <main className={styles.cartPage}>
        <div className={styles.cartContainer}>
          <header className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>Panier</h1>
            <button 
              className={styles.clearButton}
              onClick={clearCart}
            >
              Vider
            </button>
          </header>

          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.cartId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image || item.product?.image} alt={item.name || item.product?.name} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name || item.product?.name}</h3>
                    <div className={styles.itemSpecs}>
                      <span className={styles.itemSpec}>Couleur {item.color || item.selectedColor}</span>
                      <span className={styles.itemSpec}>Taille {item.size || item.selectedSize}</span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.itemPrice}>
                      {typeof item.price === 'string' ? item.price : `${item.price} eur`}
                    </div>
                    
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                      >
                        –
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item.cartId)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Résumé</h2>
                
                <div className={styles.summaryRow}>
                  <span>Sous-total</span>
                  <span>{getFormattedTotal()}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>Livraison</span>
                  <span>{getShippingCost() === 0 ? 'Gratuite' : `${getShippingCost().toFixed(2)} eur`}</span>
                </div>
                
                <div className={styles.summaryDivider}></div>
                
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(getFinalTotal())}</span>
                </div>

                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Traitement...' : 'Commander'}
                </button>

                <div className={styles.securityInfo}>
                  Paiement sécurisé
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}