import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orderType: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
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
    
    if (fieldName === 'firstName' && !formData.firstName.trim()) {
      newErrors.firstName = 'Ce champ est requis';
    }
    if (fieldName === 'lastName' && !formData.lastName.trim()) {
      newErrors.lastName = 'Ce champ est requis';
    }
    if (fieldName === 'email' && !formData.email.trim()) {
      newErrors.email = 'Ce champ est requis';
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all required fields as touched
    const requiredFields = ['firstName', 'lastName', 'email'];
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);
    
    // Validate all required fields
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Ce champ est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Ce champ est requis';
    if (!formData.email.trim()) newErrors.email = 'Ce champ est requis';
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        orderType: '',
        category: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <>
      <Head>
        <title>Contact - Kamba Lhains</title>
        <meta name="description" content="Contactez Kamba Lhains pour toute question sur nos collections." />
      </Head>

      <Header />

      <main className="contact-page">
        <div className="container">
          <div className="contact-header">
            <h1>Contactez-nous en utilisant le formulaire ci-dessous</h1>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
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

            <div className="form-row">
              <div className="form-group full-width">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'error' : ''}
                />
                {errors.email && touched.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="country-select"
                >
                  <option value="">France +33</option>
                  <option value="fr">France +33</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="0678099876"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleChange}
                  className="dropdown"
                >
                  <option value="">Commande</option>
                  <option value="nouvelle">Nouvelle commande</option>
                  <option value="modification">Modification de commande</option>
                  <option value="annulation">Annulation</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="dropdown"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="produit">Question produit</option>
                  <option value="livraison">Livraison</option>
                  <option value="retour">Retour/Échange</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="contact-info-text">
              <p>Aucun sujet ne correspond à votre demande ? Écrivez à info@kambalahains.net ou appelez au +33 (0) 1 58 30 03 84 du Lundi au Vendredi de 10h00 à 13h00 et de 14h00 à 21h00, les samedis de 10h00 à 13h00 et de 14h00 à 18h00 CET.</p>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez ici votre message concernant une commande effectuée, n'oubliez pas d'indiquer son numéro"
                  rows="8"
                />
                <div className="char-count">400 caractère(s) restant(s)</div>
              </div>
            </div>

            <div className="form-row">
              <button type="submit" className="submit-btn">
                SOUMETTRE
              </button>
            </div>

            <div className="contact-info-footer">
              <p>Aucun sujet ne correspond à votre demande ? Écrivez à info@kambalahains.net ou appelez au +33 (0) 1 58 30 03 84 du Lundi au Vendredi de 10h00 à 13h00 et de 14h00 à 21h00, les samedis de 10h00 à 13h00 et de 14h00 à 18h00 CET.</p>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .contact-page {
          padding-top: 120px;
          min-height: 100vh;
          background: #fafafa;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .contact-header {
          margin-bottom: 40px;
        }

        .contact-header h1 {
          font-size: 11px;
          font-weight: 400;
          color: #333;
          margin-bottom: 40px;
          line-height: 1.4;
        }

        .contact-form {
          background: transparent;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
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
        .form-group select {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #ddd;
          background: transparent;
          font-size: 11px;
          color: #333;
          font-family: inherit;
          transition: border-color 0.3s ease;
          appearance: none;
        }

        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          background: transparent;
          font-size: 11px;
          color: #333;
          font-family: inherit;
          transition: border-color 0.3s ease;
          resize: vertical;
          min-height: 120px;
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

        .error-text {
          display: block;
          font-size: 10px;
          color: #e74c3c;
          margin-top: 5px;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #999;
          font-weight: 300;
        }

        .form-group select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0 center;
          background-repeat: no-repeat;
          background-size: 16px 12px;
          padding-right: 20px;
        }

        .form-group.country-select select {
          background: none;
        }


        .char-count {
          font-size: 10px;
          color: #999;
          text-align: right;
          margin-top: 5px;
        }

        .contact-info-text,
        .contact-info-footer {
          margin: 30px 0;
          padding: 20px 0;
        }

        .contact-info-text p,
        .contact-info-footer p {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .submit-btn {
          background: #333;
          color: white;
          border: none;
          padding: 15px 60px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease;
          border-radius: 0;
          width: 100%;
        }

        .submit-btn:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px;
          }

          .form-row {
            flex-direction: column;
            gap: 10px;
          }

          .contact-header h1 {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .form-row {
            gap: 0;
          }

          .form-group {
            margin-bottom: 25px;
          }
        }
      `}</style>
    </>
  );
}