import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddressForm from '../components/AddressForm';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/Account.module.css';

type TabType = 'informations' | 'addresses' | 'orders' | 'preferences' | 'security';

interface Address {
  id: string;
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

export default function Compte() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('informations');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    newsletter: false
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    }
  }, [status, router]);

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || '',
        newsletter: false
      });
    }
  }, [session]);

  // Load user addresses
  useEffect(() => {
    if (session?.user?.email) {
      loadAddresses();
    }
  }, [session]);

  // Load user orders
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/account/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(error => {
          console.error('Error loading orders:', error);
        });
    }
  }, [session]);

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/account/addresses');
      const data = await response.json();
      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveInformations = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/account/update-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Rafraîchir la session pour mettre à jour les données
        await updateSession();
        setIsEditing(false);
        alert(t('account.save') + ' ' + result.message);
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving information:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t('account.passwordsDoNotMatch'));
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert(t('account.passwordChanged'));
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Erreur lors du changement de mot de passe');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/account/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        await signOut({ callbackUrl: '/' });
      } else {
        alert('Erreur: ' + result.message);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Erreur lors de la suppression du compte');
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    setIsSaving(true);
    try {
      const url = '/api/account/addresses';
      const method = editingAddress ? 'PUT' : 'POST';
      const body = editingAddress
        ? { ...addressData, id: editingAddress.id }
        : addressData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await loadAddresses();
        setShowAddressForm(false);
        setEditingAddress(null);
        alert(result.message);
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Erreur lors de la sauvegarde de l\'adresse');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm(currentLanguage === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette adresse ?' : 'Are you sure you want to delete this address?')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/account/addresses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: addressId }),
      });

      const result = await response.json();

      if (result.success) {
        await loadAddresses();
        alert(result.message);
      } else {
        alert('Erreur: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Erreur lors de la suppression de l\'adresse');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <main className={styles.accountPage}>
          <div className={styles.loading}>{t('common.loading')}</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!session) {
    return null;
  }

  const tabs = [
    { id: 'informations', label: t('account.tabs.informations') },
    { id: 'addresses', label: t('account.tabs.addresses') },
    { id: 'orders', label: t('account.tabs.orders') },
    { id: 'preferences', label: t('account.tabs.preferences') },
    { id: 'security', label: t('account.tabs.security') }
  ];

  return (
    <>
      <Head>
        <title>{t('account.title')} - Kamba Lhains</title>
        <meta name="description" content={t('account.metaDescription')} />
      </Head>

      <Header />

      <main className={styles.accountPage}>
        <div className={styles.accountContainer}>
          <h1 className={styles.pageTitle}>{t('account.welcome')}, {formData.firstName || session.user.name}</h1>

          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Informations Tab */}
            {activeTab === 'informations' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{t('account.informations.title')}</h2>
                  {!isEditing && (
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                      {t('account.edit')}
                    </button>
                  )}
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('account.informations.firstName')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{formData.firstName}</div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('account.informations.lastName')}</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{formData.lastName}</div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('account.informations.email')}</label>
                    <div className={styles.infoValue}>{formData.email}</div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('account.informations.phone')}</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    ) : (
                      <div className={styles.infoValue}>{formData.phone || '-'}</div>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>{t('account.informations.memberSince')}</label>
                    <div className={styles.infoValue}>
                      {new Date().toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US')}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.saveButton}
                      onClick={handleSaveInformations}
                      disabled={isSaving}
                    >
                      {isSaving ? t('common.saving') : t('account.save')}
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      {t('account.cancel')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{t('account.addresses.title')}</h2>
                  {!showAddressForm && (
                    <button
                      className={styles.addButton}
                      onClick={() => setShowAddressForm(true)}
                    >
                      {t('account.addresses.addNew')}
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <AddressForm
                    address={editingAddress || undefined}
                    onSave={handleSaveAddress}
                    onCancel={handleCancelAddressForm}
                    isSaving={isSaving}
                  />
                ) : addresses.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>{t('account.addresses.noAddresses')}</p>
                  </div>
                ) : (
                  <div className={styles.addressList}>
                    {addresses.map((address) => (
                      <div key={address.id} className={styles.addressCard}>
                        {address.isDefault && (
                          <span className={styles.defaultBadge}>
                            {currentLanguage === 'fr' ? 'Par défaut' : 'Default'}
                          </span>
                        )}
                        <div className={styles.addressContent}>
                          <div className={styles.addressName}>
                            {address.firstName} {address.lastName}
                          </div>
                          {address.company && (
                            <div className={styles.addressCompany}>{address.company}</div>
                          )}
                          <div className={styles.addressLine}>{address.address1}</div>
                          {address.address2 && (
                            <div className={styles.addressLine}>{address.address2}</div>
                          )}
                          <div className={styles.addressLine}>
                            {address.postalCode} {address.city}
                          </div>
                          <div className={styles.addressLine}>{address.country}</div>
                          {address.phone && (
                            <div className={styles.addressPhone}>{address.phone}</div>
                          )}
                        </div>
                        <div className={styles.addressActions}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleEditAddress(address)}
                            disabled={isSaving}
                          >
                            {currentLanguage === 'fr' ? 'Modifier' : 'Edit'}
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={isSaving}
                          >
                            {currentLanguage === 'fr' ? 'Supprimer' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('account.orders.title')}</h2>

                {orders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>{t('account.orders.noOrders')}</p>
                    <button
                      className={styles.primaryButton}
                      onClick={() => router.push('/')}
                    >
                      {t('account.orders.startShopping')}
                    </button>
                  </div>
                ) : (
                  <div className={styles.orderList}>
                    {orders.map((order: any, index: number) => (
                      <div key={index} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <div className={styles.orderNumber}>Commande #{order.orderNumber}</div>
                            <div className={styles.orderDate}>
                              {new Date(order.createdAt).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <div className={styles.orderStatus}>
                            <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className={styles.orderItems}>
                          {order.items && order.items.length > 0 && (
                            <div className={styles.itemsList}>
                              {order.items.map((item: any, i: number) => (
                                <div key={i} className={styles.orderItem}>
                                  <span>{item.name} x {item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={styles.orderFooter}>
                          <div className={styles.orderTotal}>
                            Total: {order.totalAmount.toFixed(2)}€
                          </div>
                          {order.trackingNumber && (
                            <div className={styles.trackingNumber}>
                              Suivi: {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('account.preferences.title')}</h2>

                <div className={styles.preferenceGroup}>
                  <label className={styles.label}>{t('account.preferences.language')}</label>
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value as 'fr' | 'en')}
                    className={styles.select}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      className={styles.checkbox}
                    />
                    <span>{t('account.preferences.newsletter')}</span>
                  </label>
                </div>

                <button
                  className={styles.saveButton}
                  onClick={handleSaveInformations}
                  disabled={isSaving}
                >
                  {isSaving ? t('common.saving') : t('account.save')}
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('account.security.title')}</h2>

                {/* Change Password */}
                <div className={styles.securitySection}>
                  <h3 className={styles.subsectionTitle}>{t('account.security.changePassword')}</h3>
                  <form onSubmit={handleChangePassword}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>{t('account.security.currentPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>{t('account.security.newPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>{t('account.security.confirmNewPassword')}</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className={styles.input}
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.saveButton}
                      disabled={isSaving}
                    >
                      {isSaving ? t('common.saving') : t('account.security.updatePassword')}
                    </button>
                  </form>
                </div>

                {/* Logout */}
                <div className={styles.securitySection}>
                  <h3 className={styles.subsectionTitle}>{t('account.security.logout')}</h3>
                  <p className={styles.description}>{t('account.security.logoutDescription')}</p>
                  <button
                    className={styles.logoutButton}
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    {t('account.security.logoutButton')}
                  </button>
                </div>

                {/* Delete Account */}
                <div className={styles.securitySection}>
                  <h3 className={styles.subsectionTitle}>{t('account.security.deleteAccount')}</h3>
                  <p className={styles.description}>{t('account.security.deleteAccountDescription')}</p>
                  {!showDeleteConfirm ? (
                    <button
                      className={styles.deleteButton}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      {t('account.security.deleteAccountButton')}
                    </button>
                  ) : (
                    <div className={styles.confirmDelete}>
                      <p className={styles.warningText}>{t('account.security.deleteAccountConfirm')}</p>
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.deleteButton}
                          onClick={handleDeleteAccount}
                          disabled={isSaving}
                        >
                          {isSaving ? t('common.deleting') : t('account.security.confirmDelete')}
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isSaving}
                        >
                          {t('account.cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
