import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [openSections, setOpenSections] = useState({});
  const [email, setEmail] = useState('');

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="newsletter-section">
            <h3>S'abonner à la newsletter</h3>
            <p>Inscrivez-vous pour recevoir par e-mail toutes les informations sur nos dernières collections, nos produits, nos défilés de mode et nos projets.</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">S'inscrire</button>
            </form>
            <p className="newsletter-disclaimer">
              J'accepte de recevoir la newsletter de KAMBA LHAINS pour être informé(e) en avant-première des nouvelles collections, des événements de la marque et des offres spéciales. En m'abonnant, j'accepte la Politique de confidentialité de KAMBA LHAINS.
            </p>
          </div>
          
          <div className="footer-right">
            <div className="service-client">
              <h4>Service Client</h4>
              <ul>
                <li><Link href="/contact">Formulaire de contact</Link></li>
                <li><Link href="/suivi-commande">Suivre une commande</Link></li>
                <li><Link href="/retour">Enregistrer un retour</Link></li>
              </ul>
            </div>
            
            <div className="pays-region">
              <h4>Pays/Région</h4>
              <div className="country-selector">
                <span className="flag">🇫🇷</span>
                <span>France Métropolitaine (EUR)</span>
                <select>
                  <option>français</option>
                  <option>english</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('legal')}>
              <h4>Mentions légales et cookies</h4>
              <span className={`arrow ${openSections.legal ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.legal ? 'open' : ''}`}>
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/conditions-vente">Conditions de vente</Link></li>
              <li><Link href="/politique-confidentialite">Politique de confidentialité</Link></li>
              <li><Link href="/conditions-utilisation">Conditions générales d'utilisation</Link></li>
              <li><Link href="/accessibilite">Accessibilité</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('faq')}>
              <h4>FAQ</h4>
              <span className={`arrow ${openSections.faq ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.faq ? 'open' : ''}`}>
              <li><Link href="/compte">Compte</Link></li>
              <li><Link href="/livraison">Informations de livraison</Link></li>
              <li><Link href="/commandes">Commandes</Link></li>
              <li><Link href="/paiements">Paiements</Link></li>
              <li><Link href="/retours">Retours & échanges</Link></li>
              <li><Link href="/guide-tailles">Guide des tailles</Link></li>
              <li><Link href="/carte-cadeau">Carte Cadeau</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('entreprise')}>
              <h4>Entreprise</h4>
              <span className={`arrow ${openSections.entreprise ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.entreprise ? 'open' : ''}`}>
              <li><Link href="/contact">Nous contacter</Link></li>
              <li><Link href="/boutiques">Nos boutiques</Link></li>
              <li><Link href="/rendez-vous">Prendre un rendez-vous en boutique</Link></li>
              <li><Link href="/carriere">Carrière</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('suivre')}>
              <h4>Nous suivre</h4>
              <span className={`arrow ${openSections.suivre ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.suivre ? 'open' : ''}`}>
              <li><a href="#" aria-label="Instagram">Instagram</a></li>
              <li><a href="#" aria-label="Facebook">Facebook</a></li>
              <li><a href="#" aria-label="TikTok">TikTok</a></li>
              <li><a href="#" aria-label="X">X</a></li>
              <li><a href="#" aria-label="Pinterest">Pinterest</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © KAMBA LHAINS 2025
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: white;
          color: black;
          padding: 60px 0 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
          padding-bottom: 60px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .newsletter-section h3 {
          font-size: 18px;
          font-weight: 400;
          margin-bottom: 20px;
          color: black;
        }
        
        .newsletter-section p {
          line-height: 1.6;
          color: #666;
          font-size: 14px;
          margin-bottom: 20px;
          font-weight: 300;
        }
        
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .newsletter-form input {
          padding: 15px;
          border: none;
          border-bottom: 1px solid #ccc;
          background: transparent;
          font-size: 14px;
          outline: none;
          font-weight: 300;
          font-family: inherit;
        }
        
        .newsletter-form input:focus {
          border-bottom-color: black;
        }
        
        .newsletter-form button {
          align-self: flex-start;
          padding: 12px 24px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .newsletter-form button:hover {
          background: #333;
        }
        
        .newsletter-disclaimer {
          font-size: 12px;
          color: #999;
          line-height: 1.4;
          font-weight: 300;
        }
        
        .footer-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .service-client h4,
        .pays-region h4 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 20px;
          color: black;
        }
        
        .service-client ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .service-client li {
          margin-bottom: 12px;
        }
        
        .service-client a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
          font-weight: 300;
        }
        
        .service-client a:hover {
          color: black;
        }
        
        .country-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 300;
        }
        
        .country-selector select {
          border: none;
          background: transparent;
          font-size: 14px;
          cursor: pointer;
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          margin-bottom: 40px;
        }
        
        .link-section {
          position: relative;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 15px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .section-header h4 {
          font-size: 16px;
          font-weight: 400;
          margin: 0;
          color: black;
        }
        
        .arrow {
          font-size: 16px;
          color: #666;
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }
        
        .arrow.open {
          transform: rotate(0deg);
        }
        
        .section-content {
          list-style: none;
          margin: 0;
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .section-content.open {
          max-height: 500px;
          padding: 15px 0;
        }
        
        .section-content li {
          margin-bottom: 12px;
        }
        
        .section-content li a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
          font-weight: 300;
        }
        
        .section-content li a:hover {
          color: black;
        }
        
        .footer-bottom {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #e0e0e0;
        }
        
        .copyright {
          color: #666;
          font-size: 12px;
          margin: 0;
          font-weight: 300;
        }
        
        @media (min-width: 769px) {
          .section-header {
            cursor: default;
            border-bottom: none;
            padding: 0 0 20px 0;
          }
          
          .arrow {
            display: none;
          }
          
          .section-content {
            max-height: none;
            overflow: visible;
            padding: 0;
          }
        }
        
        @media (max-width: 768px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 40px;
            padding-bottom: 40px;
          }
          
          .footer-right {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .newsletter-form {
            gap: 10px;
          }
          
          .newsletter-form input {
            padding: 12px 0;
          }
        }
      `}</style>
    </footer>
  );
}