import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Compte() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
    
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmez votre mot de passe';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: formData.email,
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      newsletter: false
    });
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>{isLogin ? 'Connexion réussie' : 'Inscription réussie'} - Kamba Lhains</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            {isLogin ? 'CONNEXION RÉUSSIE' : 'INSCRIPTION RÉUSSIE'}
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            {isLogin 
              ? 'Vous êtes maintenant connecté à votre compte Kamba Lhains.'
              : 'Votre compte a été créé avec succès. Bienvenue chez Kamba Lhains !'
            }
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              fontSize: '11px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif'
            }}
          >
            CONTINUER VOS ACHATS
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{isLogin ? 'Connexion' : 'Inscription'} - Kamba Lhains</title>
        <meta name="description" content={`${isLogin ? 'Connectez-vous' : 'Créez votre compte'} Kamba Lhains pour accéder à votre espace client.`} />
      </Head>
      <Header />
      <main style={{ padding: '60px 20px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
              {isLogin ? 'CONNEXION' : 'CRÉER UN COMPTE'}
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              {isLogin 
                ? 'Connectez-vous pour accéder à votre espace client et suivre vos commandes.'
                : 'Créez votre compte pour profiter d\'une expérience d\'achat personnalisée.'
              }
            </p>
          </div>

          {!isLogin && (
            <div style={{ backgroundColor: '#f8f8f8', padding: '25px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                AVANTAGES DU COMPTE CLIENT
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '8px' }}>• Suivi en temps réel de vos commandes</div>
                <div style={{ marginBottom: '8px' }}>• Historique de vos achats</div>
                <div style={{ marginBottom: '8px' }}>• Adresses de livraison enregistrées</div>
                <div style={{ marginBottom: '8px' }}>• Accès prioritaire aux ventes privées</div>
                <div>• Newsletter personnalisée selon vos goûts</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '30px' }}>
            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      backgroundColor: 'transparent',
                      fontSize: '11px',
                      color: '#333',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  {errors.firstName && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.firstName}</span>}
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      backgroundColor: 'transparent',
                      fontSize: '11px',
                      color: '#333',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  {errors.lastName && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.lastName}</span>}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Adresse email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  fontSize: '11px',
                  color: '#333',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
              />
              {errors.email && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.email}</span>}
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: 'transparent',
                    fontSize: '11px',
                    color: '#333',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Mot de passe *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: 'none',
                  borderBottom: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  fontSize: '11px',
                  color: '#333',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
              />
              {errors.password && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.password}</span>}
              {!isLogin && (
                <span style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: '5px' }}>
                  Minimum 8 caractères
                </span>
              )}
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: 'transparent',
                    fontSize: '11px',
                    color: '#333',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.3s ease'
                  }}
                />
                {errors.confirmPassword && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.confirmPassword}</span>}
              </div>
            )}

            {!isLogin && (
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Je souhaite recevoir la newsletter Kamba Lhains
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#999' : '#333',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'background-color 0.3s ease',
                width: '100%',
                marginBottom: '20px'
              }}
            >
              {isSubmitting 
                ? (isLogin ? 'CONNEXION...' : 'CRÉATION DU COMPTE...') 
                : (isLogin ? 'SE CONNECTER' : 'CRÉER MON COMPTE')
              }
            </button>

            {isLogin && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <a 
                  href="/contact" 
                  style={{ 
                    fontSize: '10px', 
                    color: '#666', 
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
                {isLogin ? 'Pas encore de compte ?' : 'Déjà client ?'}
              </p>
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  backgroundColor: 'transparent',
                  color: '#333',
                  border: '1px solid #333',
                  padding: '12px 25px',
                  fontSize: '11px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#333';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#333';
                }}
              >
                {isLogin ? 'CRÉER UN COMPTE' : 'SE CONNECTER'}
              </button>
            </div>
          </form>

          {!isLogin && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f8f8', fontSize: '10px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
              En créant un compte, vous acceptez nos{' '}
              <a href="/conditions-utilisation" style={{ color: '#333', textDecoration: 'underline' }}>
                conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="/politique-confidentialite" style={{ color: '#333', textDecoration: 'underline' }}>
                politique de confidentialité
              </a>.
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          main {
            padding: 40px 15px !important;
          }
          
          .grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}