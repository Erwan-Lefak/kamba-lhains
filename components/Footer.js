import Link from 'next/link';

export default function Footer() {
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
              <h4>Collections</h4>
              <ul>
                <li><Link href="/boutique/femme">Femme</Link></li>
                <li><Link href="/boutique/homme">Homme</Link></li>
                <li><Link href="/boutique/accessoires">Accessoires</Link></li>
                <li><Link href="/boutique/nouveautes">Nouveautés</Link></li>
              </ul>
            </div>
            
            <div className="link-section">
              <h4>Service Client</h4>
              <ul>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/livraison">Livraison</Link></li>
                <li><Link href="/retours">Retours</Link></li>
                <li><Link href="/guide-tailles">Guide des tailles</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="link-section">
              <h4>À Propos</h4>
              <ul>
                <li><Link href="/about">Notre Histoire</Link></li>
                <li><Link href="/kambayers">Kambayers</Link></li>
                <li><Link href="/durabilite">Durabilité</Link></li>
                <li><Link href="/presse">Presse</Link></li>
              </ul>
            </div>
            
            <div className="link-section">
              <h4>Adresse</h4>
              <div className="address">
                <p>KAMBA LHAINS</p>
                <p>123 Rue de la Mode</p>
                <p>75001 Paris, France</p>
                <p>+33 1 23 45 67 89</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-social">
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="YouTube">YouTube</a>
            <a href="#" aria-label="Twitter">Twitter</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="legal-links">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/cgv">CGV</Link>
          </div>
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
        
        .link-section h4 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: black;
        }
        
        .link-section ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .link-section ul li {
          margin-bottom: 12px;
        }
        
        .link-section ul li a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }
        
        .link-section ul li a:hover {
          color: black;
        }
        
        .address p {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .footer-social {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 30px;
        }
        
        .social-links a {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }
        
        .social-links a:hover {
          color: black;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .legal-links {
          display: flex;
          gap: 30px;
        }
        
        .legal-links a {
          color: #666;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.3s;
        }
        
        .legal-links a:hover {
          color: black;
        }
        
        .copyright {
          color: #666;
          font-size: 12px;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
          }
          
          .social-links {
            flex-wrap: wrap;
            gap: 20px;
          }
          
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          
          .legal-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .footer-links {
            grid-template-columns: 1fr;
          }
          
          .legal-links {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </footer>
  );
}