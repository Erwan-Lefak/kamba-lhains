import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Carriere() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    motivation: '',
    cv: null,
    portfolio: null
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    if (!formData.position.trim()) newErrors.position = 'Le poste souhaité est requis';
    if (!formData.motivation.trim()) newErrors.motivation = 'La lettre de motivation est requise';
    else if (formData.motivation.length < 50) newErrors.motivation = 'Minimum 50 caractères';

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
          <title>Candidature envoyée - Kamba Lhains</title>
        </Head>
        <Header />
        <main style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'Manrope, sans-serif' }}>
          <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#333', marginBottom: '20px' }}>
            CANDIDATURE ENVOYÉE
          </h1>
          <p style={{ fontSize: '11px', color: '#666', marginBottom: '30px' }}>
            Votre candidature a été envoyée avec succès. Nous vous recontacterons si votre profil correspond à nos besoins.
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
        <title>Carrière - Kamba Lhains</title>
        <meta name="description" content="Rejoignez l'équipe Kamba Lhains - Candidatures spontanées pour une mode éthique et responsable." />
      </Head>
      <Header />
      <main style={{ minHeight: '100vh', padding: 'calc(var(--header-height) + 20px) 0 50px', fontFamily: 'Manrope, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '11px', fontWeight: '400', color: '#000', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Manrope, sans-serif' }}>
              REJOIGNEZ L'ÉQUIPE KAMBA LHAINS
            </h1>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              Vous partagez notre vision d'une mode éthique et responsable ? Vous souhaitez contribuer à 
              l'évolution de l'industrie de la mode ? Nous serions ravis de découvrir votre profil.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '50px' }}>
            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                NOS VALEURS D'ÉQUIPE
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Passion :</span> Pour la mode et l'innovation
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Engagement :</span> Envers l'éthique et la durabilité
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Créativité :</span> Dans l'approche et les solutions
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>Collaboration :</span> Esprit d'équipe et bienveillance
                </div>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>Excellence :</span> Dans chaque détail
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px' }}>
              <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '20px' }}>
                DOMAINES DE COMPÉTENCES
              </h2>
              <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '10px' }}>• Design et création</div>
                <div style={{ marginBottom: '10px' }}>• E-commerce et digital</div>
                <div style={{ marginBottom: '10px' }}>• Marketing et communication</div>
                <div style={{ marginBottom: '10px' }}>• Service client</div>
                <div style={{ marginBottom: '10px' }}>• Logistique et supply chain</div>
                <div style={{ marginBottom: '10px' }}>• Développement durable</div>
                <div>• Gestion et administration</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '40px' }}>
            <h2 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '30px', textAlign: 'center' }}>
              CANDIDATURE SPONTANÉE
            </h2>

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
                Poste souhaité / Domaine d'intérêt *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Ex: Designer, Chargé(e) de communication, Service client..."
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
              {errors.position && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.position}</span>}
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Expérience professionnelle (résumé)
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez brièvement votre parcours professionnel..."
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

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                Lettre de motivation *
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={6}
                placeholder="Pourquoi souhaitez-vous rejoindre Kamba Lhains ? Qu'est-ce qui vous motive dans notre approche de la mode ?"
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
              {errors.motivation && <span style={{ display: 'block', fontSize: '10px', color: '#e74c3c', marginTop: '5px' }}>{errors.motivation}</span>}
              <span style={{ display: 'block', fontSize: '10px', color: '#999', marginTop: '5px' }}>
                {formData.motivation.length}/1000
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  CV (PDF)
                </label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleChange}
                  accept=".pdf"
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
                  Format PDF uniquement (max 5MB)
                </span>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontWeight: '400' }}>
                  Portfolio / Book (optionnel)
                </label>
                <input
                  type="file"
                  name="portfolio"
                  onChange={handleChange}
                  accept=".pdf,.zip"
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
                  PDF ou ZIP (max 10MB)
                </span>
              </div>
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
              {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER MA CANDIDATURE'}
            </button>
          </form>

          <div style={{ marginTop: '40px', padding: '30px', backgroundColor: 'white', textAlign: 'center' }}>
            <h3 style={{ fontSize: '11px', fontWeight: '500', color: '#333', marginBottom: '15px' }}>
              PROCESSUS DE RECRUTEMENT
            </h3>
            <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '10px' }}>1. Examen de votre candidature par notre équipe</p>
              <p style={{ marginBottom: '10px' }}>2. Premier entretien téléphonique ou vidéo</p>
              <p style={{ marginBottom: '10px' }}>3. Rencontre avec l'équipe (selon le poste)</p>
              <p style={{ marginBottom: '20px' }}>4. Décision et intégration</p>
              <p style={{ fontSize: '10px', color: '#999' }}>
                Délai de réponse : nous nous engageons à vous répondre sous 2 semaines maximum.
              </p>
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