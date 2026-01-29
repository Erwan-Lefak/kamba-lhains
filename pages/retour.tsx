import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Retour() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/contact');
  }, [router]);

  return (
    <>
      <Head>
        <title>Faire un retour - Kamba Lhains</title>
        <meta name="description" content="Redirection vers la page contact" />
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '14px'
      }}>
        Redirection vers la page contact...
      </div>
    </>
  );
}

/*
// Code original conservé en commentaire
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RetourOld() {
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    reason: '',
    items: '',
    message: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name);
  };

  const validateField = (fieldName: string) => {
    const newErrors = { ...errors };
    
    if (fieldName === 'orderNumber' && !formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Ce champ est requis';
    }
    if (fieldName === 'email' && !formData.email.trim()) {
      newErrors.email = 'Ce champ est requis';
    }
    if (fieldName === 'firstName' && !formData.firstName.trim()) {
      newErrors.firstName = 'Ce champ est requis';
    }
    if (fieldName === 'lastName' && !formData.lastName.trim()) {
      newErrors.lastName = 'Ce champ est requis';
    }
    if (fieldName === 'reason' && !formData.reason.trim()) {
      newErrors.reason = 'Ce champ est requis';
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const requiredFields = ['orderNumber', 'email', 'firstName', 'lastName', 'reason'];
    const newTouched: {[key: string]: boolean} = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    const newErrors: {[key: string]: string} = {};
    if (!formData.orderNumber.trim()) newErrors.orderNumber = 'Ce champ est requis';
    if (!formData.email.trim()) newErrors.email = 'Ce champ est requis';
    if (!formData.firstName.trim()) newErrors.firstName = 'Ce champ est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Ce champ est requis';
    if (!formData.reason.trim()) newErrors.reason = 'Ce champ est requis';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      console.log('Demande de retour:', formData);
    }
  };

  const resetForm = () => {
    setFormData({
      orderNumber: '',
      email: '',
      firstName: '',
      lastName: '',
      reason: '',
      items: '',
      message: ''
    });
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

  return (
    <>
      <Head>
        <title>Retour - Kamba Lhains</title>
        <meta name="description" content="Retournez facilement vos articles Kamba Lhains. Politique de retour et formulaire de demande." />
      </Head>

      <Header />

      <main className="retour">
        <div className="container">
          <h1>RETOURS</h1>

          <section className="policy-section">
            <h2>NOTRE POLITIQUE DE RETOUR</h2>
            <div className="policy-content">
              <p>Vous disposez de <strong>14 jours</strong> à compter de la réception de votre commande pour nous retourner un article qui ne vous conviendrait pas.</p>
              
              <h3>CONDITIONS DE RETOUR</h3>
              <ul>
                <li><strong>Articles acceptés :</strong> vêtements, chaussures et accessoires dans leur état d'origine</li>
                <li><strong>État requis :</strong> non portés, non lavés, avec toutes les étiquettes attachées</li>
                <li><strong>Articles non acceptés :</strong> produits personnalisés ou modifiés</li>
                <li><strong>Frais de retour :</strong> à la charge du client, sauf en cas d'erreur de notre part</li>
              </ul>

              <h3>PROCESSUS DE RETOUR</h3>
              <ol>
                <li><strong>Demande :</strong> Remplissez le formulaire ci-dessous ou connectez-vous à votre compte</li>
                <li><strong>Étiquette :</strong> Recevez l'étiquette de retour prépayée par email</li>
                <li><strong>Emballage :</strong> Préparez votre colis selon les instructions fournies</li>
                <li><strong>Expédition :</strong> Déposez le colis dans un bureau de poste ou point de collecte</li>
                <li><strong>Remboursement :</strong> Remboursement sous 14 jours après réception et validation</li>
              </ol>

              <h3>REMBOURSEMENT</h3>
              <p>Une fois le retour reçu et validé, le remboursement sera effectué sur le mode de paiement utilisé lors de la commande, dans un délai de 14 jours.</p>
            </div>
          </section>

          {!isSubmitted ? (
            <section className="form-section">
              <h2>DEMANDE DE RETOUR</h2>
              <div className="form-intro">
                <p>Remplissez ce formulaire pour initier votre demande de retour. Vous recevrez par email toutes les instructions nécessaires.</p>
              </div>

              <form onSubmit={handleSubmit} className="return-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Numéro de commande *</label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ex: KL2024080100123"
                      className={errors.orderNumber && touched.orderNumber ? 'error' : ''}
                    />
                    {errors.orderNumber && touched.orderNumber && (
                      <span className="error-text">{errors.orderNumber}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Email de commande *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="votre@email.com"
                      className={errors.email && touched.email ? 'error' : ''}
                    />
                    {errors.email && touched.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.firstName && touched.firstName ? 'error' : ''}
                    />
                    {errors.firstName && touched.firstName && (
                      <span className="error-text">{errors.firstName}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.lastName && touched.lastName ? 'error' : ''}
                    />
                    {errors.lastName && touched.lastName && (
                      <span className="error-text">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Motif de retour *</label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.reason && touched.reason ? 'error' : ''}
                  >
                    <option value="">Sélectionnez un motif</option>
                    <option value="taille">Problème de taille</option>
                    <option value="couleur">Couleur différente</option>
                    <option value="qualite">Problème de qualité</option>
                    <option value="defaut">Produit défectueux</option>
                    <option value="erreur">Erreur de commande</option>
                    <option value="autre">Autre motif</option>
                  </select>
                  {errors.reason && touched.reason && (
                    <span className="error-text">{errors.reason}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Articles à retourner</label>
                  <input
                    type="text"
                    name="items"
                    value={formData.items}
                    onChange={handleChange}
                    placeholder="Ex: T-shirt noir taille M, Pantalon bleu taille L"
                  />
                </div>

                <div className="form-group">
                  <label>Message complémentaire</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre problème ou ajoutez des précisions..."
                    rows={4}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  ENVOYER MA DEMANDE
                </button>
              </form>
            </section>
          ) : (
            <section className="confirmation-section">
              <h2>DEMANDE REÇUE</h2>
              <div className="confirmation-content">
                <p>Merci <strong>{formData.firstName}</strong>, votre demande de retour pour la commande <strong>{formData.orderNumber}</strong> a bien été reçue.</p>
                <p>Vous recevrez sous peu un email avec :</p>
                <ul>
                  <li>L'étiquette de retour prépayée</li>
                  <li>Les instructions détaillées pour l'emballage</li>
                  <li>L'adresse de retour</li>
                </ul>
                <p>Si vous ne recevez pas cet email dans les prochaines heures, vérifiez vos spams ou contactez-nous.</p>
                <button onClick={resetForm} className="reset-btn">
                  NOUVELLE DEMANDE
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .retour {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: white;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        h1 {
          font-size: 11px;
          font-weight: 400;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 40px;
          text-align: center;
          font-family: 'Manrope', sans-serif;
        }

        h2 {
          font-size: 10px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 25px;
        }

        h3 {
          font-size: 9px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 20px 0 15px 0;
        }

        .policy-section,
        .form-section,
        .confirmation-section,
        .contact-section {
          margin-bottom: 50px;
          padding: 40px;
          background: white;
          border: 1px solid #eee;
        }

        .policy-content p,
        .form-intro p,
        .confirmation-content p,
        .contact-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .policy-content ul,
        .policy-content ol,
        .confirmation-content ul,
        .contact-content ul {
          margin: 15px 0;
          padding-left: 20px;
        }

        .policy-content li,
        .confirmation-content li,
        .contact-content li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .policy-content strong,
        .confirmation-content strong {
          font-weight: 500;
          color: #333;
        }

        .return-form {
          margin-top: 30px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }

        .form-group {
          flex: 1;
          position: relative;
        }

        .form-group.full-width {
          flex: none;
          width: 100%;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          font-weight: 400;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #ddd;
          background: transparent;
          font-size: 11px;
          color: #333;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        .form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          resize: vertical;
          min-height: 100px;
        }

        .form-group select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0 center;
          background-repeat: no-repeat;
          background-size: 16px 12px;
          padding-right: 20px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-bottom-color: #333;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #333;
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #e74c3c;
        }

        .form-group input.error {
          border-bottom-color: #e74c3c;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #999;
          font-weight: 300;
        }

        .error-text {
          display: block;
          font-size: 10px;
          color: #e74c3c;
          margin-top: 5px;
        }

        .submit-btn {
          background: black;
          color: white;
          border: none;
          padding: 8px 16px;
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 100%;
          margin-top: 20px;
        }

        .submit-btn:hover {
          background: #333;
        }

        .reset-btn {
          background: transparent;
          color: #333;
          border: 1px solid #333;
          padding: 8px 16px;
          font-size: 9px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }

        .reset-btn:hover {
          background: #333;
          color: white;
        }

        @media (max-width: 768px) {
          .retour {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          .policy-section,
          .form-section,
          .confirmation-section,
          .contact-section {
            padding: 25px 20px;
            margin-bottom: 30px;
          }

          .form-row {
            flex-direction: column;
            gap: 0;
          }

          .form-group {
            margin-bottom: 25px;
          }

          h1 {
            font-size: 10px;
            margin-bottom: 30px;
          }

          h2 {
            font-size: 9px;
          }

          h3 {
            font-size: 8px;
          }

          .policy-content p,
          .form-intro p,
          .confirmation-content p,
          .contact-content p,
          .policy-content li,
          .confirmation-content li,
          .contact-content li {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
*/