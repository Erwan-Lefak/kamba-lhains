import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    interests: {
      newCollections: false,
      exclusiveOffers: false,
      behindTheScenes: false,
      sustainabilityTips: false,
      events: false
    },
    frequency: 'weekly'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isUnsubscribe, setIsUnsubscribe] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('interests.')) {
      const interestName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        interests: {
          ...prev.interests,
          [interestName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    
    if (!isUnsubscribe && !formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';

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

  if (submitted) {
    return (
      <>
        <Head>
          <title>{isUnsubscribe ? 'Désabonnement confirmé' : 'Inscription confirmée'} - Newsletter Kamba Lhains</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            {isUnsubscribe ? 'DÉSABONNEMENT CONFIRMÉ' : 'INSCRIPTION CONFIRMÉE'}
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            {isUnsubscribe 
              ? 'Vous avez été désabonné(e) de notre newsletter. Nous regrettons de vous voir partir.'
              : 'Merci pour votre inscription ! Vous recevrez bientôt nos dernières actualités.'
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
            RETOUR À L'ACCUEIL
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Newsletter - Kamba Lhains</title>
        <meta name="description" content="Inscrivez-vous à la newsletter Kamba Lhains pour recevoir nos dernières actualités, collections exclusives et conseils mode durable." />
      </Head>
      <Header />
      <main style={{ padding: '60px 20px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
              NEWSLETTER KAMBA LHAINS
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              Restez informé(e) de nos dernières créations, événements exclusifs et conseils pour une 
              mode plus responsable. Rejoignez notre communauté.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#f8f8f8', padding: '25px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                CE QUE VOUS RECEVREZ
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• Avant-premières des nouvelles collections</div>
                <div style={{ marginBottom: '10px' }}>• Offres exclusives et ventes privées</div>
                <div style={{ marginBottom: '10px' }}>• Coulisses de la création</div>
                <div style={{ marginBottom: '10px' }}>• Conseils mode et durabilité</div>
                <div>• Invitations aux événements spéciaux</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8f8f8', padding: '25px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                NOTRE ENGAGEMENT
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• Contenu de qualité, jamais de spam</div>
                <div style={{ marginBottom: '10px' }}>• Respect de vos données personnelles</div>
                <div style={{ marginBottom: '10px' }}>• Désabonnement en un clic</div>
                <div style={{ marginBottom: '10px' }}>• Fréquence d'envoi respectée</div>
                <div>• Contenu personnalisé selon vos intérêts</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
            <button
              onClick={() => setIsUnsubscribe(false)}
              style={{
                backgroundColor: !isUnsubscribe ? '#333' : 'transparent',
                color: !isUnsubscribe ? 'white' : '#333',
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
            >
              S'ABONNER
            </button>
            <button
              onClick={() => setIsUnsubscribe(true)}
              style={{
                backgroundColor: isUnsubscribe ? '#333' : 'transparent',
                color: isUnsubscribe ? 'white' : '#333',
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
            >
              SE DÉSABONNER
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '30px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              {isUnsubscribe ? 'DÉSABONNEMENT' : 'ABONNEMENT'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: isUnsubscribe ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Adresse email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
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
              
              {!isUnsubscribe && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
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
              )}
            </div>

            {!isUnsubscribe && (
              <>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '15px', fontWeight: '400' }}>
                    Centres d'intérêt (optionnel)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.newCollections"
                        checked={formData.interests.newCollections}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      Nouvelles collections
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.exclusiveOffers"
                        checked={formData.interests.exclusiveOffers}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      Offres exclusives
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.behindTheScenes"
                        checked={formData.interests.behindTheScenes}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      Coulisses de la marque
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.sustainabilityTips"
                        checked={formData.interests.sustainabilityTips}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      Conseils durabilité
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.events"
                        checked={formData.interests.events}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      Événements spéciaux
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                    Fréquence souhaitée
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      backgroundColor: 'white',
                      fontSize: '11px',
                      color: '#333',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.3s ease'
                    }}
                  >
                    <option value="weekly">Hebdomadaire</option>
                    <option value="biweekly">Bi-mensuelle</option>
                    <option value="monthly">Mensuelle</option>
                    <option value="events-only">Événements uniquement</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#999' : '#333',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                fontSize: '11px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontFamily: 'Manrope, sans-serif',
                transition: 'background-color 0.3s ease',
                width: '100%'
              }}
            >
              {isSubmitting 
                ? (isUnsubscribe ? 'DÉSABONNEMENT...' : 'INSCRIPTION...') 
                : (isUnsubscribe ? 'ME DÉSABONNER' : 'M\'INSCRIRE')
              }
            </button>
          </form>

          {!isUnsubscribe && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f8f8', fontSize: '10px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
              En vous inscrivant, vous acceptez de recevoir des emails marketing de notre part. 
              Vous pouvez vous désabonner à tout moment en cliquant sur le lien de désabonnement 
              présent dans chaque email. Consultez notre{' '}
              <a href="/politique-confidentialite" style={{ color: '#333', textDecoration: 'underline' }}>
                politique de confidentialité
              </a>{' '}
              pour plus d'informations sur le traitement de vos données.
            </div>
          )}

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              SUIVEZ-NOUS AUSSI SUR
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <a href="#" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>Instagram</a>
              <a href="#" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>Facebook</a>
              <a href="#" style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}>LinkedIn</a>
            </div>
          </div>
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