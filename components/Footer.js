import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
                <li><Link href="/contact" style={{fontSize: isMobile ? '9px' : '10px'}}>{t('footer.customerServiceLinks.contactForm')}</Link></li>
                <li><Link href="/suivi-commande" style={{fontSize: isMobile ? '9px' : '10px'}}>{t('footer.customerServiceLinks.trackOrder')}</Link></li>
                <li><Link href="/retour" style={{fontSize: isMobile ? '9px' : '10px'}}>{t('footer.customerServiceLinks.registerReturn')}</Link></li>
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
              <li><Link href="/mentions-legales" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.legalNotices')}</Link></li>
              <li><Link href="/conditions-vente" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.salesConditions')}</Link></li>
              <li><Link href="/politique-confidentialite" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.privacyPolicy')}</Link></li>
              <li><Link href="/conditions-utilisation" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.termsOfUse')}</Link></li>
              <li><Link href="/accessibilite" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.accessibility')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('faq')}>
              <h4>{t('footer.links.faq')}</h4>
              <span className={`arrow ${openSections.faq ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.faq ? 'open' : ''}`}>
              <li><Link href="/compte" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.account')}</Link></li>
              <li><Link href="/livraison" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.deliveryInfo')}</Link></li>
              <li><Link href="/commandes" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.orders')}</Link></li>
              <li><Link href="/paiements" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.payments')}</Link></li>
              <li><Link href="/retours" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.returns')}</Link></li>
              <li><Link href="/guide-tailles" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.sizeGuide')}</Link></li>
              <li><Link href="/carte-cadeau" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.giftCard')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('entreprise')}>
              <h4>{t('footer.links.company')}</h4>
              <span className={`arrow ${openSections.entreprise ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.entreprise ? 'open' : ''}`}>
              <li><Link href="/contact" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.contactUs')}</Link></li>
              <li><Link href="/boutiques" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.stores')}</Link></li>
              <li><Link href="/rendez-vous" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.appointment')}</Link></li>
              <li><Link href="/carriere" style={{fontSize: isMobile ? '9px' : '12px'}}>{t('footer.links.career')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('suivre')}>
              <h4>{t('footer.links.follow')}</h4>
              <span className={`arrow ${openSections.suivre ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.suivre ? 'open' : ''}`}>
              <li><a href="#" aria-label="Instagram" style={{fontSize: isMobile ? '9px' : '12px'}}>Instagram</a></li>
              <li><a href="#" aria-label="Facebook" style={{fontSize: isMobile ? '9px' : '12px'}}>Facebook</a></li>
              <li><a href="#" aria-label="TikTok" style={{fontSize: isMobile ? '9px' : '12px'}}>TikTok</a></li>
              <li><a href="#" aria-label="X" style={{fontSize: isMobile ? '9px' : '12px'}}>X</a></li>
              <li><a href="#" aria-label="Pinterest" style={{fontSize: isMobile ? '9px' : '12px'}}>Pinterest</a></li>
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
          padding: 30px 0 15px;
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          font-weight: 300;
          letter-spacing: 0.3px;
        }
        
        .container {
          max-width: 100%;
          margin: 0;
          padding: 0 20px;
        }
        
        .footer-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .newsletter-section h3 {
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 15px;
          color: black;
        }
        
        .newsletter-section p {
          line-height: 1.4;
          color: #666;
          font-size: 12px;
          margin-bottom: 15px;
          font-weight: 300;
        }
        
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .newsletter-form input {
          padding: 10px;
          border: none;
          border-bottom: 1px solid #ccc;
          background: transparent;
          font-size: 12px;
          outline: none;
          font-weight: 300;
          font-family: inherit;
        }
        
        .newsletter-form input:focus {
          border-bottom-color: black;
        }
        
        .newsletter-form button {
          align-self: flex-start;
          padding: 8px 16px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s;
        }
        
        .newsletter-form button:hover {
          background: #333;
        }
        
        .newsletter-disclaimer {
          font-size: 10px;
          color: #999;
          line-height: 1.3;
          font-weight: 300;
        }
        
        .footer-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .service-client h4,
        .pays-region h4 {
          font-size: 14px;
          font-weight: 400;
          margin-bottom: 15px;
          color: black;
        }
        
        .service-client ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .service-client li {
          margin-bottom: 8px;
        }
        
        .service-client a {
          color: #666;
          text-decoration: none;
          font-size: 10px;
          transition: color 0.3s;
          font-weight: 300;
        }
        
        .service-client a:hover {
          color: black;
        }
        
        .country-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 300;
          cursor: pointer;
          padding: 8px 0;
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
          gap: 8px;
          padding: 8px 0;
          cursor: pointer;
          font-size: 12px;
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
          font-size: 14px;
        }
        
        .language-selected-footer .arrow {
          margin-left: auto;
          font-size: 10px;
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
          gap: 8px;
          padding: 8px 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
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
          font-size: 14px;
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
          margin-bottom: 20px;
        }
        
        .link-section {
          position: relative;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .section-header h4 {
          font-size: 14px;
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
          padding: 10px 0;
        }
        
        .section-content li {
          margin-bottom: 8px;
        }
        
        .section-content li a {
          color: #666;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.3s;
          font-weight: 300;
        }
        
        .section-content li a:hover {
          color: black;
        }
        
        .footer-bottom {
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #e0e0e0;
        }
        
        .copyright {
          color: #666;
          font-size: 10px;
          margin: 0;
          font-weight: 300;
        }
        
        @media (min-width: 769px) {
          .section-header {
            cursor: default;
            border-bottom: none;
            padding: 0 0 15px 0;
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
          .footer {
            padding: 25px 0 10px;
          }
          
          .footer-top {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 20px;
            padding-bottom: 20px;
          }
          
          .newsletter-section h3 {
            font-size: 12px;
            margin-bottom: 10px;
          }
          
          .newsletter-section p {
            font-size: 10px;
            margin-bottom: 10px;
            line-height: 1.3;
          }
          
          .newsletter-form {
            gap: 8px;
            margin-bottom: 10px;
          }
          
          .newsletter-form input {
            padding: 8px 0;
            font-size: 11px;
          }
          
          .newsletter-form button {
            padding: 6px 12px;
            font-size: 11px;
          }
          
          .newsletter-disclaimer {
            font-size: 9px;
            line-height: 1.2;
          }
          
          .footer-right {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .service-client h4,
          .pays-region h4 {
            font-size: 12px;
            margin-bottom: 10px;
          }
          
          
          .service-client li {
            margin-bottom: 6px;
          }
          
          .country-selector {
            font-size: 10px;
            padding: 6px 0;
          }
          
          .language-selected-footer {
            font-size: 10px;
            padding: 6px 0;
          }
          
          .language-selected-footer .flag {
            font-size: 12px;
          }
          
          .language-option-footer {
            font-size: 10px;
            padding: 6px 8px;
          }
          
          .language-option-footer .flag {
            font-size: 12px;
          }
          
          .footer-links {
            grid-template-columns: 1fr;
            gap: 0;
            margin-bottom: 15px;
          }
          
          .section-header {
            padding: 8px 0;
          }
          
          .section-header h4 {
            font-size: 12px;
          }
          
          .section-content.open {
            padding: 8px 0;
          }
          
          .section-content li {
            margin-bottom: 6px;
          }
          
          .section-content li a {
            font-size: 10px;
          }
          
          .footer-bottom {
            padding: 10px 0;
          }
          
          .copyright {
            font-size: 9px;
          }
        }
      `}</style>
    </footer>
  );
}