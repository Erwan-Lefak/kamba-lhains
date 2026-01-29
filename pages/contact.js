import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    orderType: '',
    category: '',
    subCategory: '',
    message: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Add new files to existing attachments
      const newFiles = Array.from(files);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...newFiles]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleRemoveFile = (index) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attachments: newAttachments
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name);
  };

  const validateField = (fieldName) => {
    const newErrors = { ...errors };

    if (fieldName === 'firstName' && !formData.firstName.trim()) {
      newErrors.firstName = t('contact.fieldRequired');
    }
    if (fieldName === 'lastName' && !formData.lastName.trim()) {
      newErrors.lastName = t('contact.fieldRequired');
    }
    if (fieldName === 'email' && !formData.email.trim()) {
      newErrors.email = t('contact.fieldRequired');
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all required fields as touched
    const requiredFields = ['firstName', 'lastName', 'email'];
    const newTouched = {};
    requiredFields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all required fields
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('contact.fieldRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('contact.fieldRequired');
    if (!formData.email.trim()) newErrors.email = t('contact.fieldRequired');

    setErrors(newErrors);

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setSubmitStatus({ type: '', message: '' });

      try {
        // Créer FormData pour envoyer les fichiers
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('orderType', formData.orderType);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('message', formData.message);

        // Ajouter les pièces jointes
        formData.attachments.forEach((file) => {
          formDataToSend.append('attachments', file);
        });

        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus({
            type: 'success',
            message: t('contact.successMessage')
          });

          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            orderType: '',
            category: '',
            subCategory: '',
            message: '',
            attachments: []
          });
          setErrors({});
          setTouched({});
        } else {
          setSubmitStatus({
            type: 'error',
            message: data.error || t('contact.errorMessage')
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitStatus({
          type: 'error',
          message: t('contact.errorMessage')
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{t('contact.metaTitle')}</title>
        <meta name="description" content={t('contact.metaDescription')} />
      </Head>

      <Header />

      <main className="contact-page">
        <div className="container">
          <div className="contact-header">
            <h1>{t('contact.title')}</h1>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>{t('contact.firstName')}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.firstName && touched.firstName ? 'error' : ''}
                />
                {errors.firstName && touched.firstName && (
                  <span className="error-text">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label>{t('contact.lastName')}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.lastName && touched.lastName ? 'error' : ''}
                />
                {errors.lastName && touched.lastName && (
                  <span className="error-text">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>{t('contact.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'error' : ''}
                />
                {errors.email && touched.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <select
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="country-select"
                >
                  <option value="">France +33</option>
                  <option value="fr">France +33</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="0612345678"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="dropdown"
                >
                  <option value="">{t('contact.selectCategory')}</option>
                  <option value="commande">{t('contact.categories.order')}</option>
                  <option value="carriere">{t('contact.categories.career')}</option>
                  <option value="presse">{t('contact.categories.press')}</option>
                  <option value="autre">{t('contact.categories.other')}</option>
                </select>
              </div>
            </div>

            {formData.category && formData.category !== 'autre' && (
              <div className="form-row">
                <div className="form-group full-width">
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="dropdown"
                  >
                    <option value="">{t('contact.selectOption')}</option>
                    {formData.category === 'commande' && (
                      <>
                        <option value="suivi">{t('contact.orderSubCategories.tracking')}</option>
                        <option value="modification">{t('contact.orderSubCategories.modification')}</option>
                        <option value="livraison">{t('contact.orderSubCategories.delivery')}</option>
                        <option value="retour">{t('contact.orderSubCategories.return')}</option>
                        <option value="autre">{t('contact.orderSubCategories.other')}</option>
                      </>
                    )}
                    {formData.category === 'carriere' && (
                      <>
                        <option value="candidature">{t('contact.careerSubCategories.application')}</option>
                        <option value="autre">{t('contact.careerSubCategories.other')}</option>
                      </>
                    )}
                    {formData.category === 'presse' && (
                      <>
                        <option value="interview">{t('contact.pressSubCategories.interview')}</option>
                        <option value="dossier">{t('contact.pressSubCategories.pressKit')}</option>
                        <option value="autre">{t('contact.pressSubCategories.other')}</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group full-width">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                  rows="8"
                />
                <div className="char-count">{t('contact.charactersRemaining')}</div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>{t('contact.attachFiles')}</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="attachments"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.txt"
                    id="file-upload"
                    multiple
                  />
                  <label htmlFor="file-upload" className="file-label">
                    {t('contact.chooseFiles')}
                  </label>
                </div>
                <div className="file-info">{t('contact.acceptedFormats')}</div>

                {formData.attachments.length > 0 && (
                  <div className="attached-files">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Supprimer le fichier"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {submitStatus.message && (
              <div className={`status-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="form-row">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? t('contact.submitting') : t('contact.submit')}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          padding: calc(var(--header-height) + 20px) 0 50px;
          background: white;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .contact-header {
          margin-bottom: 60px;
          text-align: center;
        }

        .contact-header h1 {
          font-size: 11px;
          font-weight: 400;
          color: #000;
          margin-bottom: 20px;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Manrope', sans-serif;
        }

        .contact-form {
          background: transparent;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .form-group {
          flex: 1;
          position: relative;
        }

        .form-group.full-width {
          flex: none;
          width: 100%;
        }

        .form-group label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          font-weight: 400;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #ddd;
          background: transparent;
          font-size: 11px;
          color: #333;
          font-family: inherit;
          transition: border-color 0.3s ease;
          appearance: none;
        }

        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          background: transparent;
          font-size: 11px;
          color: #333;
          font-family: inherit;
          transition: border-color 0.3s ease;
          resize: vertical;
          min-height: 120px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-bottom-color: #333;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #333;
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #e74c3c;
        }

        .form-group input.error {
          border-bottom-color: #e74c3c;
        }

        .error-text {
          display: block;
          font-size: 10px;
          color: #e74c3c;
          margin-top: 5px;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #999;
          font-weight: 300;
        }

        .form-group select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0 center;
          background-repeat: no-repeat;
          background-size: 16px 12px;
          padding-right: 20px;
        }

        .form-group.country-select select {
          background: none;
        }


        .char-count {
          font-size: 10px;
          color: #999;
          text-align: right;
          margin-top: 5px;
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input-wrapper input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .file-label {
          display: block;
          padding: 12px;
          border: 1px dashed #ddd;
          background: transparent;
          font-size: 11px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .file-label:hover {
          border-color: #333;
          color: #333;
        }

        .file-info {
          font-size: 10px;
          color: #999;
          margin-top: 5px;
        }

        .attached-files {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          font-size: 11px;
          transition: background 0.2s ease;
        }

        .file-item:hover {
          background: #fafafa;
        }

        .file-name {
          flex: 1;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .remove-file-btn {
          background: none;
          border: none;
          color: #999;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          padding: 0 5px;
          margin-left: 10px;
          transition: color 0.2s ease;
        }

        .remove-file-btn:hover {
          color: #e74c3c;
        }

        .contact-info-text,
        .contact-info-footer {
          margin: 30px 0;
          padding: 20px 0;
        }

        .contact-info-text p,
        .contact-info-footer p {
          font-size: 11px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .submit-btn {
          background: #000;
          color: white;
          border: none;
          padding: 8px 60px;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background 0.3s ease;
          border-radius: 0;
          width: 100%;
        }

        .submit-btn:hover {
          background: #333;
        }

        .submit-btn:disabled {
          background: #999;
          cursor: not-allowed;
        }

        .status-message {
          padding: 15px 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 11px;
          line-height: 1.5;
        }

        .status-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        @media (max-width: 768px) {
          .contact-page {
            padding-top: 100px;
          }

          .container {
            padding: 20px 15px;
          }

          .form-row {
            flex-direction: column;
            gap: 10px;
          }

          .contact-header h1 {
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .form-row {
            gap: 0;
          }

          .form-group {
            margin-bottom: 25px;
          }
        }
      `}</style>
    </>
  );
}