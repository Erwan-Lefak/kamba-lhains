import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>KAMBA LHAINS</h3>
            <p>
              Marque de mode contemporaine proposant des vêtements élégants 
              et modernes pour hommes et femmes. Découvrez notre univers 
              alliant style et qualité exceptionnelle.
            </p>
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
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            © 2025 KAMBA LHAINS. Tous droits réservés.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: white;
          color: black;
          padding: 60px 0 20px;
          font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
        }
        
        .container {
          max-width: 100%;
          margin: 0;
          padding: 0 20px;
          width: 100%;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 40px;
        }
        
        .footer-brand h3 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          letter-spacing: 2px;
          color: black;
        }
        
        .footer-brand p {
          line-height: 1.6;
          color: #666;
          font-size: 14px;
        }
        
        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
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
          font-weight: 600;
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
          .footer-content {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .footer-brand {
            display: none;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </footer>
  );
}