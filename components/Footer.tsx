import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../contexts/LanguageContext';
import { Language as LanguageType } from '../utils/translations';

interface OpenSections {
  [key: string]: boolean;
}

interface Country {
  flag: string;
  name: string;
  currency: string;
}

interface LanguageOption {
  code: LanguageType;
  label: string;
  flag: string;
}

interface FooterProps {
  isKambaversPage?: boolean;
  isMenuVisible?: boolean;
  isHomePage?: boolean;
}

export default function Footer({ isKambaversPage = false, isMenuVisible = false, isHomePage = false }: FooterProps): React.JSX.Element {
  const [openSections, setOpenSections] = useState<OpenSections>({});
  const [email, setEmail] = useState<string>('');
  const [showCountryModal, setShowCountryModal] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    flag: '🇫🇷',
    name: 'France Métropolitaine',
    currency: 'EUR'
  });
  
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);
  
  const languages: LanguageOption[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const toggleSection = (section: string): void => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [newsletterLoading, setNewsletterLoading] = useState<boolean>(false);
  const [newsletterMessage, setNewsletterMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'footer',
          language: currentLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewsletterMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setNewsletterMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setNewsletterMessage({ type: 'error', text: t('footer.newsletter.errorGeneric') });
    } finally {
      setNewsletterLoading(false);
    }
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

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };

  const isActiveLink = (href: string) => {
    return router.pathname === href;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.color = '#9f0909';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>, href: string) => {
    (e.target as HTMLElement).style.color = isActiveLink(href) ? '#9f0909' : '#888';
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="newsletter-section">
            <h3>Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={newsletterLoading}>
                <span>{newsletterLoading ? t('footer.newsletter.subscribing') : t('footer.newsletter.subscribe')}</span>
                <span className="arrow-right">⟶</span>
              </button>
            </form>
            {newsletterMessage && (
              <p className={`newsletter-message ${newsletterMessage.type}`}>
                {newsletterMessage.text}
              </p>
            )}
            <p className="newsletter-disclaimer">
              {t('footer.newsletter.disclaimer')}
            </p>
          </div>
          
          <div className="footer-right">
            <div className="service-client">
              <h4>{t('footer.customerService')}</h4>
              <ul>
                <li><Link href="/suivi-commande" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/suivi-commande') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/suivi-commande')}>{t('footer.customerServiceLinks.trackOrder')}</Link></li>
                <li><Link href="/contact" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/contact') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/contact')}>{t('footer.customerServiceLinks.contactForm')}</Link></li>
              </ul>
            </div>
            
            <div className="pays-region">
              <h4>{t('footer.countryRegion')}</h4>
              <div className="country-selector" onClick={() => setShowCountryModal(true)}>
                <span className="flag">{selectedCountry.flag}</span>
                <span>{selectedCountry.name} ({selectedCountry.currency})</span>
              </div>
              
              <h4 style={{ marginTop: '20px' }}>{t('footer.language')}</h4>
              <div className="language-dropdown-footer" ref={languageDropdownRef}>
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
              <li><Link href="/mentions-legales" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/mentions-legales') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/mentions-legales')}>{t('footer.links.legalNotices')}</Link></li>
              <li><Link href="/conditions-vente" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/conditions-vente') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/conditions-vente')}>{t('footer.links.salesConditions')}</Link></li>
              <li><Link href="/politique-confidentialite" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/politique-confidentialite') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/politique-confidentialite')}>{t('footer.links.privacyPolicy')}</Link></li>
              <li><Link href="/conditions-utilisation" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/conditions-utilisation') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/conditions-utilisation')}>{t('footer.links.termsOfUse')}</Link></li>
              <li><Link href="/accessibilite" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/accessibilite') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/accessibilite')}>{t('footer.links.accessibility')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('faq')}>
              <h4>{t('footer.links.faq')}</h4>
              <span className={`arrow ${openSections.faq ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.faq ? 'open' : ''}`}>
              <li><Link href="/connexion" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/connexion') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/connexion')}>{t('footer.links.account')}</Link></li>
              <li><Link href="/livraison" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/livraison') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/livraison')}>{t('footer.links.deliveryInfo')}</Link></li>
              <li><Link href="/commandes" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/commandes') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/commandes')}>{t('footer.links.orders')}</Link></li>
              <li><Link href="/paiements" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/paiements') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/paiements')}>{t('footer.links.payments')}</Link></li>
              <li><Link href="/retours" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/retours') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/retours')}>{t('footer.links.returns')}</Link></li>
              <li><Link href="/guide-tailles" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/guide-tailles') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/guide-tailles')}>{t('footer.links.sizeGuide')}</Link></li>
              <li><Link href="/carte-cadeau" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/carte-cadeau') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/carte-cadeau')}>{t('footer.links.giftCard')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('entreprise')}>
              <h4>{t('footer.links.company')}</h4>
              <span className={`arrow ${openSections.entreprise ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.entreprise ? 'open' : ''}`}>
              <li><Link href="/kambavers/marque" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/kambavers/marque') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/kambavers/marque')}>{t('footer.links.about')}</Link></li>
              <li><Link href="/contact" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/contact') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/contact')}>{t('footer.links.contactUs')}</Link></li>
              <li><Link href="/charte" style={{fontSize: '9px', textTransform: 'uppercase', color: isActiveLink('/charte') ? '#9f0909' : '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '/charte')}>{t('footer.links.ourValues')}</Link></li>
            </ul>
          </div>
          
          <div className="link-section">
            <div className="section-header" onClick={() => toggleSection('suivre')}>
              <h4>{t('footer.links.follow')}</h4>
              <span className={`arrow ${openSections.suivre ? 'open' : ''}`}>^</span>
            </div>
            <ul className={`section-content ${openSections.suivre ? 'open' : ''}`}>
              <li><a href="https://www.instagram.com/kambalhains/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{fontSize: '9px', textTransform: 'uppercase', color: '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '#')}>Instagram</a></li>
              <li><a href="https://www.facebook.com/share/1QP2wxTkDe/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{fontSize: '9px', textTransform: 'uppercase', color: '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '#')}>Facebook</a></li>
              <li><a href="https://www.tiktok.com/@kambalhains?_t=ZN-90okin6RHYk&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{fontSize: '9px', textTransform: 'uppercase', color: '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '#')}>TikTok</a></li>
              <li><a href="https://x.com/kambalhains?s=21" target="_blank" rel="noopener noreferrer" aria-label="X" style={{fontSize: '9px', textTransform: 'uppercase', color: '#888'}} onMouseEnter={handleMouseEnter} onMouseLeave={(e) => handleMouseLeave(e, '#')}>X</a></li>
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
              <h3>{t('footer.selectCountry')}</h3>
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
          position: relative;
          z-index: 100;
          ${!isHomePage ? 'margin-top: 80px;' : ''}
          ${isKambaversPage ? `
            margin-left: ${isMenuVisible ? '250px' : '0'};
            transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          ` : ''}
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
          font-size: 11px;
          font-weight: 400;
          margin-bottom: 15px;
          color: black;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
        }
        
        .newsletter-section p {
          line-height: 1.4;
          color: #888;
          font-size: 12px;
          margin-bottom: 15px;
          font-weight: 300;
          font-family: 'Manrope', sans-serif;
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
          font-family: 'Manrope', sans-serif;
        }
        
        .newsletter-form input:focus {
          border-bottom-color: black;
        }
        
        .newsletter-form button {
          width: 100%;
          padding: 8px 16px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 9px;
          transition: background-color 0.3s;
          font-family: 'Manrope', sans-serif;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-transform: uppercase;
        }
        
        .newsletter-form button:hover {
          background: #333;
        }

        .newsletter-form button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        .newsletter-message {
          font-size: 11px;
          margin: 10px 0;
          padding: 8px 12px;
          border-radius: 4px;
          font-weight: 400;
        }

        .newsletter-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .newsletter-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .arrow-right {
          font-size: 14px;
          line-height: 0.8;
          display: flex;
          align-items: center;
          font-weight: normal;
          transform: translateY(-1.75px);
        }
        
        .newsletter-disclaimer {
          font-size: 9px !important;
          color: #aaa;
          line-height: 1.3;
          font-weight: 300;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .footer-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        
        .service-client h4,
        .pays-region h4 {
          font-size: 11px;
          font-weight: 400;
          margin-bottom: 15px;
          color: black;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
        }
        
        .service-client ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .service-client li {
          margin-bottom: 4px;
        }
        
        .service-client a {
          color: #888;
          text-decoration: none;
          font-size: 10px;
          transition: color 0.3s;
          font-weight: 300;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .service-client a:hover {
          color: #9f0909 !important;
        }
        
        .service-client li:hover a {
          color: #9f0909 !important;
        }
        
        .country-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          font-weight: 300;
          cursor: pointer;
          padding: 8px 0;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
          color: #888;
        }
        
        .country-selector:hover {
          color: #9f0909 !important;
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
          font-size: 9px;
          font-weight: 300;
          color: #888;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .language-selected-footer:hover {
          color: #9f0909 !important;
        }
        
        .language-selected-footer .flag {
          font-size: 10px;
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
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
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
          font-size: 9px;
          font-weight: 300;
          color: #888;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .language-option-footer:hover {
          background: #f5f5f5;
          color: black;
        }
        
        .language-option-footer .flag {
          font-size: 10px;
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
          border-radius: 0;
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
          font-size: 11px;
          font-weight: 400;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
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
          font-size: 11px;
          font-weight: 400;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .country-option .currency {
          font-size: 11px;
          color: #666;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
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
          font-size: 11px;
          font-weight: 400;
          margin: 0;
          color: black;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
        }
        
        .arrow {
          font-size: 16px;
          color: #888;
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
          margin-bottom: 4px;
        }
        
        .section-content li a {
          color: #888;
          text-decoration: none;
          font-size: 10px;
          transition: color 0.3s;
          font-weight: 300;
          font-family: 'Manrope', sans-serif;
          text-transform: uppercase;
        }
        
        .section-content li a:hover {
          color: #9f0909 !important;
        }
        
        .section-content li:hover a {
          color: #9f0909 !important;
        }
        
        .service-client li a:hover {
          color: #9f0909 !important;
        }
        
        .footer-link-active {
          color: #9f0909 !important;
        }
        
        .footer-bottom {
          text-align: center;
          padding: 15px 0;
          border-top: 1px solid #e0e0e0;
        }
        
        .copyright {
          color: #888;
          font-size: 10px;
          margin: 0;
          font-weight: 300;
          font-family: 'Manrope', sans-serif;
        }
        
        @media (max-width: 1024px) and (min-width: 769px) {
          .footer {
            ${isKambaversPage ? `
              margin-left: ${isMenuVisible ? '200px' : '0'};
            ` : ''}
          }
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
            ${isKambaversPage ? 'margin-left: 0 !important;' : ''}
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
            font-size: 9px !important;
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
            margin-bottom: 3px;
          }
          
          .country-selector {
            font-size: 9px;
            padding: 6px 0;
          }
          
          .language-selected-footer {
            font-size: 9px;
            padding: 6px 0;
          }
          
          .language-selected-footer .flag {
            font-size: 10px;
          }
          
          .language-option-footer {
            font-size: 9px;
            padding: 6px 8px;
          }
          
          .language-option-footer .flag {
            font-size: 10px;
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
            margin-bottom: 3px;
          }
          
          .section-content li a {
            font-size: 9px;
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