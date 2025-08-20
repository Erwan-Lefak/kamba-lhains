import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function SuiviCommande() {
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name);
  };

  const validateField = (fieldName) => {
    const newErrors = { ...errors };
    
    if (fieldName === 'orderNumber' && !formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Ce champ est requis';
    }
    if (fieldName === 'email' && !formData.email.trim()) {
      newErrors.email = 'Ce champ est requis';
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requiredFields = ['orderNumber', 'email'];
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    const newErrors = {};
    if (!formData.orderNumber.trim()) newErrors.orderNumber = 'Ce champ est requis';
    if (!formData.email.trim()) newErrors.email = 'Ce champ est requis';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      // Ici on pourrait ajouter l'appel API
      console.log('Recherche de commande:', formData);
    }
  };

  const resetForm = () => {
    setFormData({ orderNumber: '', email: '' });
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  };

  return (
    <>
      <Head>
        <title>Suivi de commande - Kamba Lhains</title>
        <meta name="description" content="Suivez votre commande Kamba Lhains en temps réel." />
      </Head>

      <Header />

      <main className="suivi-commande">
        <div className="container">
          <h1>SUIVI DE COMMANDE</h1>

          {!isSubmitted ? (
            <>
              <div className="intro">
                <p>Saisissez votre numéro de commande et votre adresse email pour suivre l'état de votre commande.</p>
              </div>

              <form onSubmit={handleSubmit} className="tracking-form">
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
                  <label>Adresse email *</label>
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

                <button type="submit" className="submit-btn">
                  SUIVRE MA COMMANDE
                </button>
              </form>

              <div className="info-section">
                <h2>INFORMATIONS IMPORTANTES</h2>
                <div className="info-content">
                  <p><strong>Votre numéro de commande</strong> vous a été envoyé par email lors de la confirmation de votre achat.</p>
                  <p><strong>Délais de traitement :</strong></p>
                  <ul>
                    <li>Préparation de commande : 1-2 jours ouvrés</li>
                    <li>Expédition France : 2-4 jours ouvrés (Colissimo) ou 1-2 jours (DHL Express)</li>
                    <li>Expédition internationale : 2-6 jours ouvrés selon destination</li>
                  </ul>
                  <p><strong>Suivi transporteur :</strong> Un email avec le numéro de suivi vous sera envoyé dès l'expédition.</p>
                </div>
              </div>

              <div className="contact-section">
                <h2>BESOIN D'AIDE ?</h2>
                <div className="contact-content">
                  <p>Vous ne trouvez pas votre numéro de commande ou rencontrez des difficultés ?</p>
                  <p><strong>Contactez-nous :</strong></p>
                  <ul>
                    <li>Email : info@kambalahains.net</li>
                    <li>Téléphone : +33 (0) 1 58 30 03 84</li>
                    <li>Du lundi au vendredi : 10h-13h et 14h-21h</li>
                    <li>Samedi : 10h-13h et 14h-18h</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="result-section">
              <h2>RECHERCHE EN COURS</h2>
              <div className="result-content">
                <p>Nous recherchons les informations de votre commande <strong>{formData.orderNumber}</strong>.</p>
                <p>Cette fonctionnalité sera bientôt disponible. En attendant, vous pouvez :</p>
                <ul>
                  <li>Vérifier votre email pour le numéro de suivi transporteur</li>
                  <li>Suivre directement sur les sites de nos transporteurs (Colissimo, DHL)</li>
                  <li>Nous contacter pour obtenir des informations</li>
                </ul>
                <button onClick={resetForm} className="reset-btn">
                  NOUVELLE RECHERCHE
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .suivi-commande {
          padding-top: 120px;
          min-height: 100vh;
          background: #fafafa;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        h1 {
          font-size: 11px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 40px;
          text-align: center;
        }

        h2 {
          font-size: 10px;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
        }

        .intro {
          text-align: center;
          margin-bottom: 40px;
        }

        .intro p {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
        }

        .tracking-form {
          background: white;
          padding: 40px;
          border: 1px solid #eee;
          margin-bottom: 50px;
        }

        .form-group {
          margin-bottom: 30px;
          position: relative;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          font-weight: 400;
        }

        .form-group input {
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

        .form-group input:focus {
          outline: none;
          border-bottom-color: #333;
        }

        .form-group input.error {
          border-bottom-color: #e74c3c;
        }

        .form-group input::placeholder {
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
          background: #333;
          color: white;
          border: none;
          padding: 15px 40px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 100%;
        }

        .submit-btn:hover {
          background: #555;
        }

        .reset-btn {
          background: transparent;
          color: #333;
          border: 1px solid #333;
          padding: 12px 30px;
          font-size: 11px;
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

        .info-section,
        .contact-section,
        .result-section {
          margin-bottom: 40px;
          padding: 30px;
          background: white;
          border: 1px solid #eee;
        }

        .info-content p,
        .contact-content p,
        .result-content p {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .info-content ul,
        .contact-content ul,
        .result-content ul {
          margin: 12px 0;
          padding-left: 20px;
        }

        .info-content li,
        .contact-content li,
        .result-content li {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .info-content strong,
        .contact-content strong,
        .result-content strong {
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .suivi-commande {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px 60px;
          }

          .tracking-form,
          .info-section,
          .contact-section,
          .result-section {
            padding: 20px;
          }

          h1 {
            font-size: 10px;
            margin-bottom: 30px;
          }

          h2 {
            font-size: 9px;
          }

          .intro p,
          .info-content p,
          .contact-content p,
          .result-content p,
          .info-content li,
          .contact-content li,
          .result-content li {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}