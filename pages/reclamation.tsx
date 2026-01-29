import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Reclamation() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/contact');
  }, [router]);

  return (
    <>
      <Head>
        <title>Réclamation - Kamba Lhains</title>
        <meta name="description" content="Redirection vers la page contact" />
      </Head>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '14px'
      }}>
        Redirection vers la page contact...
      </div>
    </>
  );
}

/*
// Code original conservé en commentaire
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ReclamationOld() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orderNumber: '',
    problemType: '',
    description: '',
    attachments: null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const problemTypes = [
    'Produit défectueux',
    'Produit non conforme',
    'Problème de livraison',
    'Erreur de commande',
    'Service client',
    'Remboursement',
    'Autre'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.problemType) newErrors.problemType = 'Sélectionnez un type de problème';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    else if (formData.description.length < 10) newErrors.description = 'Minimum 10 caractères';

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
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <>
        <Head>
          <title>Réclamation envoyée - Kamba Lhains</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            RÉCLAMATION ENVOYÉE
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            Votre réclamation a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.
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
        <title>Réclamation - Kamba Lhains</title>
        <meta name="description" content="Formulaire de réclamation Kamba Lhains - Signalez un problème avec votre commande." />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              FORMULAIRE DE RÉCLAMATION
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              Vous rencontrez un problème avec votre commande ? Nous sommes là pour vous aider. 
              Remplissez ce formulaire et nous vous répondrons rapidement.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
              AVANT DE FAIRE UNE RÉCLAMATION
            </h2>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '10px' }}>• Vérifiez votre email de confirmation de commande</p>
              <p style={{ marginBottom: '10px' }}>• Consultez notre page de suivi de commande</p>
              <p style={{ marginBottom: '10px' }}>• Vérifiez nos conditions de vente et de retour</p>
              <p>• Pour un échange ou retour simple, utilisez notre <a href="/retour" style={{ color: '#333', textDecoration: 'underline' }}>formulaire de retour</a></p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Email *
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
              
              <div>
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
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Numéro de commande (si applicable)
              </label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="KL2024-XXXXX"
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

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Type de problème *
              </label>
              <select
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  fontSize: '11px',
                  color: '#333',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease'
                }}
              >
                <option value="">Sélectionnez un type de problème</option>
                {problemTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.problemType && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.problemType}</span>}
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Description détaillée du problème *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Décrivez précisément le problème rencontré..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  fontSize: '11px',
                  color: '#333',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.3s ease',
                  resize: 'vertical'
                }}
              />
              {errors.description && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.description}</span>}
              <span style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: '5px' }}>
                {formData.description.length}/500
              </span>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Pièces jointes (photos, factures...)
              </label>
              <input
                type="file"
                name="attachments"
                onChange={handleChange}
                accept="image/*,.pdf"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  backgroundColor: 'transparent',
                  fontSize: '11px',
                  color: '#333',
                  fontFamily: 'inherit'
                }}
              />
              <span style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: '5px' }}>
                Formats acceptés : JPG, PNG, PDF (max 5MB)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#999' : '#333',
                color: 'white',
                border: 'none',
                padding: '8px 60px',
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
              {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER LA RÉCLAMATION'}
            </button>
          </form>

          <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              AUTRES MOYENS DE CONTACT
            </h3>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '8px' }}><a href="/contact" style={{ color: '#333', textDecoration: 'underline' }}>Formulaire de contact</a></p>
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
*/