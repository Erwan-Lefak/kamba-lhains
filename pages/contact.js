import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Head>
        <title>Contact - KAMBA LHAINS</title>
        <meta name="description" content="Contactez KAMBA LHAINS pour toute question sur nos collections." />
      </Head>

      <Header />

      <main className="contact-page">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <div className="info-block">
                <h3>Email</h3>
                <p>info@kambalahains.net</p>
              </div>

              <div className="info-block">
                <h3>Téléphone</h3>
                <p>+33 1 58 30 03 84</p>
              </div>

              <div className="info-block">
                <h3>Adresse</h3>
                <p>21 avenue George V<br />75008 Paris</p>
              </div>
            </div>

            <div className="contact-form-container">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nom"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Message"
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .contact-page {
          padding-top: 120px;
          min-height: 100vh;
          background: #fafafa;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 80px;
          align-items: start;
          margin-top: 40px;
        }

        .contact-info {
          padding: 40px 0;
        }

        .info-block {
          margin-bottom: 40px;
        }

        .info-block h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2c2c2c;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-block p {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
          font-weight: 300;
        }

        .contact-form-container {
          background: white;
          padding: 50px;
          border-radius: 2px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .contact-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 32px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 16px 0;
          border: none;
          border-bottom: 1px solid #e0e0e0;
          background: transparent;
          font-size: 1.1rem;
          color: #2c2c2c;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-bottom-color: #2c2c2c;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #aaa;
          font-weight: 300;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          background: #2c2c2c;
          color: white;
          border: none;
          padding: 18px 40px;
          font-size: 1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .submit-btn:hover {
          background: #1a1a1a;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .contact-page {
            padding-top: 100px;
          }

          .contact-content {
            grid-template-columns: 1fr;
            gap: 50px;
            margin-top: 20px;
          }

          .contact-form-container {
            padding: 40px 30px;
          }

          .container {
            padding: 0 15px;
          }
        }

        @media (max-width: 480px) {
          .contact-form-container {
            padding: 30px 20px;
          }
        }
      `}</style>
    </>
  );
}