import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Contact - KAMBA LHAINS</title>
        <meta name="description" content="Contactez KAMBA LHAINS pour toute question sur nos collections, commandes ou partenariats." />
      </Head>

      <Header />

      <main className="contact-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Nous Contacter</h1>
            <p>Nous sommes là pour répondre à toutes vos questions</p>
          </div>
        </div>

        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Informations de Contact</h2>
              
              <div className="info-item">
                <h3>📧 Email</h3>
                <p>contact@kamba-lhains.com</p>
                <p>support@kamba-lhains.com</p>
              </div>

              <div className="info-item">
                <h3>📞 Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
                <p>Lundi - Vendredi: 9h - 18h</p>
              </div>

              <div className="info-item">
                <h3>📍 Adresse</h3>
                <p>123 Rue de la Mode</p>
                <p>75001 Paris, France</p>
              </div>

              <div className="info-item">
                <h3>🕒 Horaires d'Ouverture</h3>
                <p>Lundi - Vendredi: 9h - 19h</p>
                <p>Samedi: 10h - 18h</p>
                <p>Dimanche: Fermé</p>
              </div>

              <div className="social-links">
                <h3>Suivez-nous</h3>
                <div className="social-icons">
                  <a href="#" aria-label="Instagram">📷</a>
                  <a href="#" aria-label="Facebook">📘</a>
                  <a href="#" aria-label="Twitter">🐦</a>
                  <a href="#" aria-label="LinkedIn">💼</a>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Envoyez-nous un Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Information produit</option>
                    <option value="livraison">Livraison</option>
                    <option value="retour">Retour/Échange</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Envoyer le Message
                </button>
              </form>
            </div>
          </div>

          <div className="faq-section">
            <h2>Questions Fréquentes</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Quels sont les délais de livraison ?</h3>
                <p>Les commandes sont expédiées sous 2-3 jours ouvrables. La livraison prend ensuite 3-5 jours en France métropolitaine.</p>
              </div>
              <div className="faq-item">
                <h3>Puis-je retourner un produit ?</h3>
                <p>Oui, vous avez 30 jours pour retourner un produit non porté avec ses étiquettes dans son emballage d'origine.</p>
              </div>
              <div className="faq-item">
                <h3>Comment entretenir mes vêtements ?</h3>
                <p>Chaque produit contient des instructions d'entretien spécifiques. En général, nous recommandons un lavage à froid et un séchage à l'air libre.</p>
              </div>
              <div className="faq-item">
                <h3>Proposez-vous des tailles sur mesure ?</h3>
                <p>Oui, nous proposons un service de personnalisation pour certaines pièces. Contactez-nous pour plus d'informations.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .contact-page {
          padding-top: 80px;
        }

        .hero-section {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                      url('https://via.placeholder.com/1920x400/8B4513/FFFFFF?text=Contact');
          background-size: cover;
          background-position: center;
          padding: 6rem 0;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .hero-content p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 20px;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .contact-info h2 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 300;
        }

        .info-item {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8f8f8;
          border-radius: 10px;
        }

        .info-item h3 {
          color: #8B4513;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .info-item p {
          color: #666;
          margin-bottom: 0.25rem;
        }

        .social-links {
          margin-top: 2rem;
        }

        .social-links h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .social-icons {
          display: flex;
          gap: 1rem;
        }

        .social-icons a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: #8B4513;
          color: white;
          border-radius: 50%;
          text-decoration: none;
          transition: background 0.3s;
        }

        .social-icons a:hover {
          background: #654321;
        }

        .contact-form-section h2 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 300;
        }

        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8B4513;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .submit-btn {
          width: 100%;
          background: #8B4513;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.3s;
          font-weight: 500;
        }

        .submit-btn:hover {
          background: #654321;
        }

        .faq-section {
          margin-top: 4rem;
        }

        .faq-section h2 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 300;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .faq-item {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .faq-item h3 {
          color: #8B4513;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .faq-item p {
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .contact-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .hero-content h1 {
            font-size: 2rem;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .social-icons {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}