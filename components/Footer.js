import Link from 'next/link';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const [openSections, setOpenSections] = useState({});
  const [email, setEmail] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    flag: '🇫🇷',
    name: 'France Métropolitaine',
    currency: 'EUR'
  });
  
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' }
  ];

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

  const countries = [
    { flag: '🇫🇷', name: 'France Métropolitaine', currency: 'EUR' },
    { flag: '🇺🇸', name: 'États-Unis', currency: 'USD' },
    { flag: '🇬🇧', name: 'Royaume-Uni', currency: 'GBP' },
    { flag: '🇰🇷', name: 'Corée du Sud', currency: 'KRW' },
    { flag: '🇯🇵', name: 'Japon', currency: 'JPY' },
    { flag: '🇨🇦', name: 'Canada', currency: 'CAD' },
    { flag: '🇦🇺', name: 'Australie', currency: 'AUD' },
    { flag: '🇩🇪', name: 'Allemagne', currency: 'EUR' },
    { flag: '🇮🇹', name: 'Italie', currency: 'EUR' },
    { flag: '🇪🇸', name: 'Espagne', currency: 'EUR' }
  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="newsletter-section">
            <h3>{t('footer.newsletter.title')}</h3>
            <p>{t('footer.newsletter.description')}</p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">{t('footer.newsletter.subscribe')}</button>
            </form>
            <p className="newsletter-disclaimer">
              {t('footer.newsletter.disclaimer')}
            </p>
          </div>
          
          <div className="footer-right">
            <div className="service-client">
              <h4>{t('footer.customerService')}</h4>
              <ul>
                <li><Link href="/contact">{t('footer.customerServiceLinks.contactForm')}</Link></li>
                <li><Link href="/suivi-commande">{t('footer.customerServiceLinks.trackOrder')}</Link></li>
                <li><Link href="/retour">{t('footer.customerServiceLinks.registerReturn')}</Link></li>
              </ul>
            </div>
            
            <div className="pays-region">
              <h4>{t('footer.countryRegion')}</h4>
              <div className="country-selector" onClick={() => setShowCountryModal(true)}>
                <span className="flag">{selectedCountry.flag}</span>
                <span>{selectedCountry.name} ({selectedCountry.currency})</span>
              </div>
              
              <h4 style={{ marginTop: '20px' }}>{t('footer.language')}</h4>
              <div className="language-dropdown-footer">
                <div 
                  className="language-selected-footer" 
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <span className="flag">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
                  <span>{languages.find(lang => lang.code === currentLanguage)?.label}</span>
                  <span className="arrow">{showLanguageDropdown ? '▲' : '▼'}</span>
                </div>
                {showLanguageDropdown && (
                  <div className="language-options-footer">
                    {languages.filter(lang => lang.code !== currentLanguage).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setShowLanguageDropdown(false);
                        }}
                        className="language-option-footer"
                      >
                        <span className="flag">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-links">
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('legal')}>
              <h4>{t('footer.links.legal')}</h4>
              <span className={`arrow ${openSections.legal ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.legal ? 'open' : ''}`}>
              <li><Link href="/mentions-legales">{t('footer.links.legalNotices')}</Link></li>
              <li><Link href="/conditions-vente">{t('footer.links.salesConditions')}</Link></li>
              <li><Link href="/politique-confidentialite">{t('footer.links.privacyPolicy')}</Link></li>
              <li><Link href="/conditions-utilisation">{t('footer.links.termsOfUse')}</Link></li>
              <li><Link href="/accessibilite">{t('footer.links.accessibility')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('faq')}>
              <h4>{t('footer.links.faq')}</h4>
              <span className={`arrow ${openSections.faq ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.faq ? 'open' : ''}`}>
              <li><Link href="/compte">{t('footer.links.account')}</Link></li>
              <li><Link href="/livraison">{t('footer.links.deliveryInfo')}</Link></li>
              <li><Link href="/commandes">{t('footer.links.orders')}</Link></li>
              <li><Link href="/paiements">{t('footer.links.payments')}</Link></li>
              <li><Link href="/retours">{t('footer.links.returns')}</Link></li>
              <li><Link href="/guide-tailles">{t('footer.links.sizeGuide')}</Link></li>
              <li><Link href="/carte-cadeau">{t('footer.links.giftCard')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('entreprise')}>
              <h4>{t('footer.links.company')}</h4>
              <span className={`arrow ${openSections.entreprise ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.entreprise ? 'open' : ''}`}>
              <li><Link href="/contact">{t('footer.links.contactUs')}</Link></li>
              <li><Link href="/boutiques">{t('footer.links.stores')}</Link></li>
              <li><Link href="/rendez-vous">{t('footer.links.appointment')}</Link></li>
              <li><Link href="/carriere">{t('footer.links.career')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('suivre')}>
              <h4>{t('footer.links.follow')}</h4>
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

      {/* Country Selection Modal */}
      {showCountryModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowCountryModal(false)} />
          <div className="country-modal">
            <div className="modal-header">
              <h3>Sélectionner un pays</h3>
              <button className="close-btn" onClick={() => setShowCountryModal(false)}>×</button>
            </div>
            <div className="countries-list">
              {countries.map((country, index) => (
                <div 
                  key={index}
                  className={`country-option ${selectedCountry.name === country.name ? 'selected' : ''}`}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="flag">{country.flag}</span>
                  <span className="country-name">{country.name}</span>
                  <span className="currency">({country.currency})</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
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
          cursor: pointer;
          padding: 10px 0;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        
        .country-selector:hover {
          border-bottom-color: #ccc;
        }
        
        .language-dropdown-footer {
          position: relative;
          margin-top: 10px;
        }
        
        .language-selected-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          cursor: pointer;
          font-size: 14px;
          font-weight: 300;
          color: #666;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }
        
        .language-selected-footer:hover {
          color: black;
          border-bottom-color: #ccc;
        }
        
        .language-selected-footer .flag {
          font-size: 16px;
        }
        
        .language-selected-footer .arrow {
          margin-left: auto;
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        
        .language-options-footer {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #eee;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          margin-top: 5px;
        }
        
        .language-option-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 300;
          color: #666;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }
        
        .language-option-footer:hover {
          background: #f5f5f5;
          color: black;
        }
        
        .language-option-footer .flag {
          font-size: 16px;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        
        .country-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          z-index: 1001;
          max-height: 80vh;
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 400;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .countries-list {
          padding: 20px 0;
          max-height: 60vh;
          overflow-y: auto;
        }
        
        .country-option {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 30px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .country-option:hover {
          background-color: #f5f5f5;
        }
        
        .country-option.selected {
          background-color: #f0f0f0;
          font-weight: 500;
        }
        
        .country-option .flag {
          font-size: 18px;
          width: 25px;
        }
        
        .country-option .country-name {
          flex: 1;
          font-size: 14px;
        }
        
        .country-option .currency {
          font-size: 14px;
          color: #666;
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