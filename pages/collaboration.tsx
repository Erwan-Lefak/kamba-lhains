import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Collaboration() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    instagram: '',
    followers: '',
    description: '',
    experience: '',
    portfolio: null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const collaborationTypes = [
    { value: 'influencer', label: 'Influenceur / Content Creator' },
    { value: 'brand', label: 'Collaboration entre marques' },
    { value: 'retailer', label: 'Partenariat distributeur' },
    { value: 'designer', label: 'Designer / Créateur' },
    { value: 'ambassador', label: 'Ambassadeur de marque' },
    { value: 'event', label: 'Événementiel' },
    { value: 'other', label: 'Autre' }
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
    
    if (!formData.type) newErrors.type = 'Sélectionnez un type de collaboration';
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    else if (formData.description.length < 50) newErrors.description = 'Minimum 50 caractères';

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
          <title>Demande de collaboration envoyée - Kamba Lhains</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            DEMANDE DE COLLABORATION ENVOYÉE
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            Votre demande de collaboration a été envoyée avec succès. Nous étudions votre proposition 
            et vous recontacterons si elle correspond à nos valeurs et objectifs.
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
        <title>Collaboration - Kamba Lhains</title>
        <meta name="description" content="Proposez une collaboration avec Kamba Lhains - Partenariats influenceurs, marques, créateurs et ambassadeurs pour une mode éthique." />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              COLLABORATIONS & PARTENARIATS
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              Vous partagez nos valeurs d'éthique et de durabilité ? Vous souhaitez collaborer avec nous ? 
              Nous sommes toujours ouverts aux partenariats authentiques et alignés avec notre vision.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: 'white', padding: '25px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                INFLUENCEURS
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Content creators partageant nos valeurs éthiques pour des collaborations authentiques 
                et durables.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                MARQUES
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Partenariats avec des marques complémentaires engagées dans une démarche responsable.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                CRÉATEURS
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Collaborations créatives avec des designers et artistes pour des collections capsules uniques.
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                DISTRIBUTEURS
              </h2>
              <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                Partenariats avec des points de vente physiques et en ligne partageant notre vision.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '30px', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              NOS CRITÈRES DE COLLABORATION
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  VALEURS PARTAGÉES
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '8px' }}>• Engagement pour l'éthique et la durabilité</div>
                  <div style={{ marginBottom: '8px' }}>• Respect de l'humain et de l'environnement</div>
                  <div style={{ marginBottom: '8px' }}>• Transparence dans les pratiques</div>
                  <div>• Authenticité dans la communication</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
                  QUALITÉ DE L'AUDIENCE
                </h3>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '8px' }}>• Engagement authentique de la communauté</div>
                  <div style={{ marginBottom: '8px' }}>• Alignement avec notre cible</div>
                  <div style={{ marginBottom: '8px' }}>• Contenu de qualité et cohérent</div>
                  <div>• Approche professionnelle</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '30px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '25px', textAlign: 'center' }}>
              PROPOSER UNE COLLABORATION
            </h2>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Type de collaboration *
              </label>
              <select
                name="type"
                value={formData.type}
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
                <option value="">Sélectionnez un type de collaboration</option>
                {collaborationTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.type && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.type}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Nom / Pseudo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                {errors.name && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.name}</span>}
              </div>
              
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
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
              
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Entreprise / Marque
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Instagram / Réseaux sociaux
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@votre_pseudo"
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
              
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Nombre d'abonnés (approximatif)
                </label>
                <input
                  type="text"
                  name="followers"
                  value={formData.followers}
                  onChange={handleChange}
                  placeholder="ex: 10k, 50k, 100k+"
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
                Description de votre projet de collaboration *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Décrivez votre projet de collaboration, vos idées, ce que vous proposez..."
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
                {formData.description.length}/1000
              </span>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Expérience et références
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={4}
                placeholder="Parlez-nous de vos expériences de collaboration, vos références, votre univers..."
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
            </div>

            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Portfolio / Media Kit
              </label>
              <input
                type="file"
                name="portfolio"
                onChange={handleChange}
                accept=".pdf,.zip,.jpg,.png"
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
                PDF, ZIP, JPG ou PNG (max 10MB)
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
              {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER MA PROPOSITION'}
            </button>
          </form>

          <div style={{ marginTop: '40px', padding: '25px', backgroundColor: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              DÉLAI DE RÉPONSE
            </h3>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              Nous étudions chaque proposition avec attention. Nous vous répondrons sous 2 semaines 
              si votre projet correspond à nos valeurs et objectifs. Merci pour votre compréhension.
            </p>
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