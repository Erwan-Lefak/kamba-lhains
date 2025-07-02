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
    updateQuantity(cartId, parseInt(newQuantity));
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    // Simulation d'un processus de checkout
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Panier - KAMBA LHAINS</title>
          <meta name="description" content="Votre panier KAMBA LHAINS" />
        </Head>

        <Header />

        <main className={styles.cartPage}>
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>🛒</div>
            <h1 className={styles.emptyTitle}>Votre panier est vide</h1>
            <p className={styles.emptyDescription}>
              Découvrez nos collections et ajoutez vos pièces préférées à votre panier.
            </p>
            <button 
              className={styles.continueButton}
              onClick={handleContinueShopping}
            >
              Continuer mes achats
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Panier ({items.length}) - KAMBA LHAINS</title>
        <meta name="description" content="Votre panier KAMBA LHAINS" />
      </Head>

      <Header />

      <main className={styles.cartPage}>
        <div className={styles.cartContainer}>
          <div className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>Mon Panier</h1>
            <button 
              className={styles.clearButton}
              onClick={clearCart}
            >
              Vider le panier
            </button>
          </div>

          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.cartId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.itemSpecs}>
                      <span className={styles.itemColor}>Couleur: {item.color}</span>
                      <span className={styles.itemSize}>Taille: {item.size}</span>
                    </div>
                    <div className={styles.itemPrice}>{item.price}</div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                      >
                        −
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
                <h2 className={styles.summaryTitle}>Résumé de commande</h2>
                
                <div className={styles.summaryRow}>
                  <span>Sous-total</span>
                  <span>{getFormattedTotal()}</span>
                </div>
                
                <div className={styles.summaryRow}>
                  <span>Livraison</span>
                  <span>{getTotalPrice() >= 150 ? 'Gratuite' : '9,90 €'}</span>
                </div>
                
                <div className={styles.summaryDivider}></div>
                
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(getTotalPrice() + (getTotalPrice() >= 150 ? 0 : 9.90))
                  }</span>
                </div>

                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Traitement...' : 'Finaliser ma commande'}
                </button>

                <button 
                  className={styles.continueShoppingButton}
                  onClick={handleContinueShopping}
                >
                  Continuer mes achats
                </button>

                <div className={styles.securityInfo}>
                  <div className={styles.securityIcon}>🔒</div>
                  <span>Paiement 100% sécurisé</span>
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