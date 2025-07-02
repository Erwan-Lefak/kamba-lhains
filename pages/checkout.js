import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Checkout.module.css';

export default function Checkout() {
  const router = useRouter();
  const { items, getFormattedTotal, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Adresse de livraison
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Informations de paiement
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Options
    saveInfo: false,
    newsletter: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
      if (!formData.email) newErrors.email = 'L\'email est requis';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    } else if (step === 2) {
      if (!formData.address) newErrors.address = 'L\'adresse est requise';
      if (!formData.city) newErrors.city = 'La ville est requise';
      if (!formData.postalCode) newErrors.postalCode = 'Le code postal est requis';
    } else if (step === 3) {
      if (!formData.cardNumber) newErrors.cardNumber = 'Le numéro de carte est requis';
      if (!formData.expiryDate) newErrors.expiryDate = 'La date d\'expiration est requise';
      if (!formData.cvv) newErrors.cvv = 'Le CVV est requis';
      if (!formData.cardName) newErrors.cardName = 'Le nom sur la carte est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsProcessing(true);

    try {
      // Simulation d'un processus de paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart after successful payment
      clearCart();
      
      // Redirect to success page
      router.push('/commande-confirmee');
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Erreur de paiement. Veuillez réessayer.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = getTotalPrice() >= 150 ? 0 : 9.90;
  const totalPrice = getTotalPrice() + shippingCost;

  if (items.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout - KAMBA LHAINS</title>
        </Head>
        <Header />
        <main className={styles.checkoutPage}>
          <div className={styles.emptyCheckout}>
            <h1>Votre panier est vide</h1>
            <p>Ajoutez des articles à votre panier avant de procéder au checkout.</p>
            <button onClick={() => router.push('/')} className={styles.continueButton}>
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
        <title>Checkout - KAMBA LHAINS</title>
        <meta name="description" content="Finaliser votre commande KAMBA LHAINS" />
      </Head>

      <Header />

      <main className={styles.checkoutPage}>
        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutContent}>
            <div className={styles.checkoutForm}>
              <div className={styles.stepIndicator}>
                <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
                  <span className={styles.stepNumber}>1</span>
                  <span className={styles.stepLabel}>Informations</span>
                </div>
                <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
                  <span className={styles.stepNumber}>2</span>
                  <span className={styles.stepLabel}>Livraison</span>
                </div>
                <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>
                  <span className={styles.stepNumber}>3</span>
                  <span className={styles.stepLabel}>Paiement</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className={styles.stepContent}>
                    <h2 className={styles.stepTitle}>Informations personnelles</h2>
                    
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Prénom *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                          placeholder="Votre prénom"
                        />
                        {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Nom *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                          placeholder="Votre nom"
                        />
                        {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.input}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className={styles.stepContent}>
                    <h2 className={styles.stepTitle}>Adresse de livraison</h2>
                    
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Adresse *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                        placeholder="123 Rue de la Paix"
                      />
                      {errors.address && <span className={styles.error}>{errors.address}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Ville *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                          placeholder="Paris"
                        />
                        {errors.city && <span className={styles.error}>{errors.city}</span>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Code postal *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.postalCode ? styles.inputError : ''}`}
                          placeholder="75001"
                        />
                        {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Pays</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={styles.input}
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className={styles.stepContent}>
                    <h2 className={styles.stepTitle}>Informations de paiement</h2>
                    
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Numéro de carte *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Date d'expiration *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.expiryDate ? styles.inputError : ''}`}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Nom sur la carte *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={`${styles.input} ${errors.cardName ? styles.inputError : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.cardName && <span className={styles.error}>{errors.cardName}</span>}
                    </div>

                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="saveInfo"
                          checked={formData.saveInfo}
                          onChange={handleInputChange}
                          className={styles.checkbox}
                        />
                        Sauvegarder mes informations pour mes prochains achats
                      </label>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className={styles.submitError}>{errors.submit}</div>
                )}

                <div className={styles.stepActions}>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className={styles.prevButton}
                    >
                      Retour
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className={styles.nextButton}
                    >
                      Continuer
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Traitement...' : `Payer ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPrice)}`}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className={styles.orderSummary}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Résumé de commande</h2>
                
                <div className={styles.orderItems}>
                  {items.map((item) => (
                    <div key={item.cartId} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.itemSpecs}>
                          {item.color} • {item.size} • Qté: {item.quantity}
                        </p>
                      </div>
                      <div className={styles.itemPrice}>{item.price}</div>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryCalculations}>
                  <div className={styles.summaryRow}>
                    <span>Sous-total</span>
                    <span>{getFormattedTotal()}</span>
                  </div>
                  
                  <div className={styles.summaryRow}>
                    <span>Livraison</span>
                    <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}</span>
                  </div>
                  
                  <div className={styles.summaryDivider}></div>
                  
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPrice)}</span>
                  </div>
                </div>

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