import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Cart.module.css';

export default function Cart() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, getFormattedTotal, getTotalPrice } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
    } else {
      updateQuantity(cartId, parseInt(String(newQuantity)));
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
          <title>{t('cart.title').toLowerCase()} - kamba lhains</title>
          <meta name="description" content={`${t('cart.title').toLowerCase()} kamba lhains`} />
        </Head>

        <Header />

        <main className={styles.cartPage}>
          <div className={styles.emptyCart}>
            <h1 className={styles.emptyTitle}>{t('cart.empty')}</h1>
            <p className={styles.emptyDescription}>
              {t('cart.emptyDescription')}
            </p>
            <Link href="/" className={styles.continueButton}>
              {t('cart.continueButton')}
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
        <title>{t('cart.title').toLowerCase()} ({items.length}) - kamba lhains</title>
        <meta name="description" content={`${t('cart.title').toLowerCase()} kamba lhains`} />
      </Head>

      <Header />

      <main className={styles.cartPage}>
        <div className={styles.cartContainer}>
          <header className={styles.cartHeader}>
            <h1 className={styles.cartTitle}>{t('cart.title')}</h1>
            <button
              className={styles.clearButton}
              onClick={clearCart}
            >
              {t('cart.clear')}
            </button>
          </header>

          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.cartId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <Image src={item.image || item.product?.image} alt={item.name || item.product?.name} width={120} height={150} style={{ objectFit: 'cover' }} />
                  </div>

                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name || item.product?.name}</h3>
                    <div className={styles.itemSpecs}>
                      <span className={styles.itemSpec}>{t('cart.color')} {item.color || item.selectedColor}</span>
                      <span className={styles.itemSpec}>{t('cart.size')} {item.size || item.selectedSize}</span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.itemPrice}>
                      {typeof item.price === 'string' ? item.price : `${item.price} EUR`}
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
                      {t('cart.remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>{t('cart.summary')}</h2>

                <div className={styles.summaryRow}>
                  <span>{t('cart.subtotal')}</span>
                  <span>{getFormattedTotal()}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>{t('cart.shipping')}</span>
                  <span>{getShippingCost() === 0 ? t('cart.freeShipping') : `${getShippingCost().toFixed(2)} EUR`}</span>
                </div>

                <div className={styles.summaryDivider}></div>

                <div className={styles.summaryTotal}>
                  <span>{t('cart.total')}</span>
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
                  {isProcessing ? t('cart.processing') : t('cart.checkout')}
                </button>

                <div className={styles.securityInfo}>
                  {t('cart.securePayment')}
                </div>

                <div className={styles.paymentMethods}>
                  <Image src="/pay.png" alt="Payment methods" width={200} height={40} className={styles.paymentMethodsImage} />
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
