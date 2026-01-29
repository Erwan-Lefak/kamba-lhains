import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Account.module.css';

interface AddressData {
  id?: string;
  type: 'SHIPPING' | 'BILLING' | 'BOTH';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: AddressData;
  onSave: (address: AddressData) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function AddressForm({ address, onSave, onCancel, isSaving }: AddressFormProps) {
  const { t, currentLanguage } = useLanguage();

  const [formData, setFormData] = useState<AddressData>({
    type: 'BOTH',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'FR',
    phone: '',
    isDefault: false,
    ...address
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addressForm}>
      <div className={styles.infoGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Prénom *' : 'First Name *'}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Nom *' : 'Last Name *'}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Société (optionnel)' : 'Company (optional)'}
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Adresse *' : 'Address *'}
          </label>
          <input
            type="text"
            name="address1"
            value={formData.address1}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Complément d\'adresse (optionnel)' : 'Address Line 2 (optional)'}
          </label>
          <input
            type="text"
            name="address2"
            value={formData.address2}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Code postal *' : 'Postal Code *'}
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Ville *' : 'City *'}
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Pays *' : 'Country *'}
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="LU">Luxembourg</option>
            <option value="DE">Allemagne</option>
            <option value="IT">Italie</option>
            <option value="ES">Espagne</option>
            <option value="GB">Royaume-Uni</option>
            <option value="US">États-Unis</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Téléphone (optionnel)' : 'Phone (optional)'}
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            {currentLanguage === 'fr' ? 'Type d\'adresse' : 'Address Type'}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="BOTH">{currentLanguage === 'fr' ? 'Livraison et Facturation' : 'Shipping & Billing'}</option>
            <option value="SHIPPING">{currentLanguage === 'fr' ? 'Livraison uniquement' : 'Shipping Only'}</option>
            <option value="BILLING">{currentLanguage === 'fr' ? 'Facturation uniquement' : 'Billing Only'}</option>
          </select>
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          <span>
            {currentLanguage === 'fr' ? 'Définir comme adresse par défaut' : 'Set as default address'}
          </span>
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSaving}
        >
          {isSaving
            ? (currentLanguage === 'fr' ? 'Enregistrement...' : 'Saving...')
            : (currentLanguage === 'fr' ? 'Enregistrer l\'adresse' : 'Save Address')
          }
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSaving}
        >
          {currentLanguage === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
      </div>
    </form>
  );
}
