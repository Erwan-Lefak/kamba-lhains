import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

export default function Newsletter() {
  const { t, currentLanguage } = useLanguage();
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

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isUnsubscribe, setIsUnsubscribe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    
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
    const newErrors: {[key: string]: string} = {};

    if (!formData.email.trim()) newErrors.email = t('newsletter.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('newsletter.emailInvalid');

    if (!isUnsubscribe && !formData.firstName.trim()) newErrors.firstName = t('newsletter.firstNameRequired');

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Appel API différent selon abonnement ou désabonnement
      const endpoint = isUnsubscribe ? '/api/newsletter/unsubscribe' : '/api/newsletter/subscribe';

      const payload = isUnsubscribe
        ? { email: formData.email }
        : {
            email: formData.email,
            firstName: formData.firstName,
            interests: Object.keys(formData.interests).filter(key => formData.interests[key as keyof typeof formData.interests]),
            frequency: formData.frequency,
            source: 'newsletter-page',
            language: currentLanguage,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: data.message || t('newsletter.submitError') });
      }
    } catch (error) {
      setErrors({ submit: t('newsletter.connectionError') });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>{isUnsubscribe ? t('newsletter.unsubscribeConfirmedTitle') : t('newsletter.subscribeConfirmedTitle')}</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            {isUnsubscribe ? t('newsletter.unsubscribeConfirmedTitle').replace(' - Newsletter Kamba Lhains', '') : t('newsletter.subscribeConfirmedTitle').replace(' - Newsletter Kamba Lhains', '')}
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            {isUnsubscribe
              ? t('newsletter.unsubscribeConfirmedMessage')
              : t('newsletter.subscribeConfirmedMessage')
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
            {t('newsletter.backToHomeButton')}
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t('newsletter.pageTitle')}</title>
        <meta name="description" content={t('newsletter.metaDescription')} />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              {t('newsletter.newsletterTitle')}
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
              {t('newsletter.newsletterDescription')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                {t('newsletter.whatYouReceiveTitle')}
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.newCollectionsPreview')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.exclusiveOffers')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.behindTheScenes')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.fashionSustainabilityTips')}</div>
                <div>• {t('newsletter.specialEvents')}</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                {t('newsletter.ourCommitmentTitle')}
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.qualityContent')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.dataRespect')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.oneClickUnsubscribe')}</div>
                <div style={{ marginBottom: '10px' }}>• {t('newsletter.frequencyRespected')}</div>
                <div>• {t('newsletter.personalizedContent')}</div>
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
              {t('newsletter.subscribeButton')}
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
              {t('newsletter.unsubscribeButton')}
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '30px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              {isUnsubscribe ? t('newsletter.unsubscriptionFormTitle') : t('newsletter.subscriptionFormTitle')}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: isUnsubscribe ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  {t('newsletter.emailLabel')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('newsletter.emailPlaceholder')}
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
                    {t('newsletter.firstNameLabel')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('newsletter.firstNamePlaceholder')}
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
                    {t('newsletter.interestsLabel')}
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
                      {t('newsletter.interestNewCollections')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.exclusiveOffers"
                        checked={formData.interests.exclusiveOffers}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      {t('newsletter.interestExclusiveOffers')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.behindTheScenes"
                        checked={formData.interests.behindTheScenes}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      {t('newsletter.interestBehindTheScenes')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.sustainabilityTips"
                        checked={formData.interests.sustainabilityTips}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      {t('newsletter.interestSustainabilityTips')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#666', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="interests.events"
                        checked={formData.interests.events}
                        onChange={handleChange}
                        style={{ marginRight: '8px' }}
                      />
                      {t('newsletter.interestEvents')}
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                    {t('newsletter.frequencyLabel')}
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
                    <option value="weekly">{t('newsletter.frequencyWeekly')}</option>
                    <option value="biweekly">{t('newsletter.frequencyBiweekly')}</option>
                    <option value="monthly">{t('newsletter.frequencyMonthly')}</option>
                    <option value="events-only">{t('newsletter.frequencyEventsOnly')}</option>
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
                padding: '8px 40px',
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
                ? (isUnsubscribe ? t('newsletter.submittingUnsubscribe') : t('newsletter.submittingSubscribe'))
                : (isUnsubscribe ? t('newsletter.submitUnsubscribe') : t('newsletter.submitSubscribe'))
              }
            </button>

            {errors.submit && (
              <div style={{
                marginTop: '15px',
                padding: '12px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                {errors.submit}
              </div>
            )}
          </form>

          {!isUnsubscribe && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', fontSize: '10px', color: '#666', lineHeight: '1.6', textAlign: 'center' }}>
              {t('newsletter.acceptanceText')}{' '}
              <a href={t('newsletter.privacyPolicyLink')} style={{ color: '#333', textDecoration: 'underline' }}>
                {t('newsletter.privacyPolicyText')}
              </a>{' '}
              {t('newsletter.moreInfoText')}
            </div>
          )}

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              {t('newsletter.followUsTitle')}
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