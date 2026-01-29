import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersToday: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    lowStockItems: [],
    conversionRate: 0,
    returningCustomers: 0,
    visitors: 0,
    pageViews: [],
    addToCartCount: 0,
    checkoutInitiatedCount: 0,
    customers: [],
    totalCustomers: 0,
    inventory: []
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [newStockValue, setNewStockValue] = useState('');
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [productsViewMode, setProductsViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    if (timeRange !== 'custom') {
      fetchDashboardData();
    }
  }, [timeRange]);

  useEffect(() => {
    if (activeTab === 'emails') {
      fetchEmailTemplates();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      let url = `/api/admin/dashboard?range=${timeRange}`;

      if (timeRange === 'custom' && customStartDate) {
        url = `/api/admin/dashboard?range=custom&startDate=${customStartDate}`;
        if (customEndDate) {
          url += `&endDate=${customEndDate}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const translateStatus = (status) => {
    const translations = {
      'PENDING': 'En attente',
      'PAID': 'Payée',
      'PROCESSING': 'En traitement',
      'SHIPPED': 'Expédiée',
      'DELIVERED': 'Livrée',
      'CANCELLED': 'Annulée',
      'REFUNDED': 'Remboursée'
    };
    return translations[status] || status;
  };

  const handleExportOrders = () => {
    const url = `/api/admin/export-orders?range=${timeRange}`;
    window.open(url, '_blank');
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/order/${orderId}`);
      const order = await response.json();
      setSelectedOrder(order);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
      alert('Erreur lors du chargement de la commande');
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleAdjustStock = (item) => {
    setSelectedStock(item);
    setNewStockValue(item.stock);
    setShowStockModal(true);
  };

  const handleUpdateStock = async () => {
    if (!selectedStock || newStockValue === '') return;

    try {
      const response = await fetch('/api/admin/update-stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: selectedStock.id,
          newStock: parseInt(newStockValue)
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh dashboard data
        await fetchDashboardData();
        setShowStockModal(false);
        setSelectedStock(null);
        setNewStockValue('');
        alert('Stock mis à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour du stock');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch('/api/admin/email-templates');
      const data = await response.json();
      if (data.success) {
        setEmailTemplates(data.templates);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
    }
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleUpdateOrderStatus = (order) => {
    setSelectedOrderForUpdate(order);
    setNewOrderStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setCarrier(order.carrier || '');
    setShowOrderStatusModal(true);
  };

  const handleConfirmOrderStatusUpdate = async () => {
    if (!selectedOrderForUpdate || !newOrderStatus) return;

    try {
      const response = await fetch('/api/admin/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderForUpdate.id,
          status: newOrderStatus,
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        await fetchDashboardData();
        setShowOrderStatusModal(false);
        setSelectedOrderForUpdate(null);
        alert('Statut de la commande mis à jour avec succès !');
      } else {
        alert(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'orders', label: 'Commandes' },
    { id: 'products', label: 'Produits' },
    { id: 'customers', label: 'Clients' },
    { id: 'analytics', label: 'Analytiques' },
    { id: 'inventory', label: 'Stock' },
    { id: 'emails', label: 'Emails' }
  ];

  return (
    <>
      <Head>
        <title>Dashboard Admin - Kamba Lhains</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.dashboard}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Tableau de bord</h1>
            <div className={styles.timeRange}>
              <select
                value={timeRange}
                onChange={(e) => {
                  const value = e.target.value;
                  setTimeRange(value);
                  if (value === 'custom') {
                    setShowCustomDatePicker(true);
                  } else {
                    setShowCustomDatePicker(false);
                  }
                }}
                className={styles.select}
              >
                <option value="today">Aujourd'hui</option>
                <option value="yesterday">Hier</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
                <option value="1y">Année</option>
                <option value="custom">Personnalisé</option>
              </select>

              {showCustomDatePicker && (
                <div className={styles.customDatePicker}>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className={styles.dateInput}
                    placeholder="Date de début"
                  />
                  <span style={{ margin: '0 8px' }}>à</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className={styles.dateInput}
                    placeholder="Date de fin"
                  />
                  <button
                    onClick={async () => {
                      if (customStartDate) {
                        await fetchDashboardData();
                      } else {
                        alert('Veuillez sélectionner au moins une date de début');
                      }
                    }}
                    className={styles.applyButton}
                    disabled={!customStartDate}
                  >
                    Appliquer
                  </button>
                </div>
              )}
            </div>
          </div>

          <nav className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className={styles.content}>
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Chiffre d'affaires</div>
                  <div className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</div>
                  <div className={styles.statChange}>+12% vs période précédente</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Commandes aujourd'hui</div>
                  <div className={styles.statValue}>{stats.ordersToday}</div>
                  <div className={styles.statChange}>+8% vs hier</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Total commandes</div>
                  <div className={styles.statValue}>{stats.totalOrders}</div>
                  <div className={styles.statChange}>+15% vs période précédente</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Panier moyen</div>
                  <div className={styles.statValue}>{formatCurrency(stats.averageOrderValue)}</div>
                  <div className={styles.statChange}>+5% vs période précédente</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Taux de conversion</div>
                  <div className={styles.statValue}>{stats.conversionRate}%</div>
                  <div className={styles.statChange}>+2.1% vs période précédente</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Clients fidèles</div>
                  <div className={styles.statValue}>{stats.returningCustomers}%</div>
                  <div className={styles.statChange}>+3.5% vs période précédente</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Visiteurs</div>
                  <div className={styles.statValue}>{stats.visitors || 0}</div>
                  <div className={styles.statChange}>+18% vs période précédente</div>
                </div>
              </div>

              <div className={styles.dashboardGrid}>
                <div className={styles.chartCard}>
                  <h3 className={styles.cardTitle}>Performance des ventes</h3>
                  <div className={styles.chartPlaceholder}>
                    Graphique des ventes par jour
                  </div>
                </div>

                <div className={styles.listCard}>
                  <h3 className={styles.cardTitle}>Produits populaires</h3>
                  <div className={styles.productList}>
                    {(stats.topProducts || []).slice(0, 5).map((product, index) => (
                      <div key={product.id} className={styles.productItem}>
                        <div className={styles.productRank}>{index + 1}</div>
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productSales}>{product.sales} ventes</div>
                        </div>
                        <div className={styles.productRevenue}>
                          {formatCurrency(product.revenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.listCard}>
                  <h3 className={styles.cardTitle}>Commandes récentes</h3>
                  <div className={styles.orderList}>
                    {(stats.recentOrders || []).slice(0, 8).map((order) => (
                      <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                          <div className={styles.orderNumber}>#{order.orderNumber}</div>
                          <div className={styles.orderDate}>{formatDate(order.createdAt)}</div>
                        </div>
                        <div className={styles.orderAmount}>
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                          {translateStatus(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.alertCard}>
                  <h3 className={styles.cardTitle}>Alertes stock</h3>
                  <div className={styles.alertList}>
                    {(stats.lowStockItems || []).slice(0, 5).map((item) => (
                      <div key={item.id} className={styles.alertItem}>
                        <div className={styles.alertInfo}>
                          <div className={styles.alertProduct}>{item.name}</div>
                          <div className={styles.alertVariant}>{item.color} - {item.size}</div>
                        </div>
                        <div className={styles.alertStock}>
                          {item.stock} restant{item.stock > 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.orders}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Gestion des commandes</h2>
                <button className={styles.exportButton} onClick={handleExportOrders}>
                  Exporter CSV
                </button>
              </div>
              
              <div className={styles.filterBar}>
                <input 
                  type="text" 
                  placeholder="Rechercher une commande..."
                  className={styles.searchInput}
                />
                <select className={styles.filterSelect}>
                  <option value="">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payée</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                </select>
              </div>

              <div className={styles.ordersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCol}>Commande</div>
                  <div className={styles.tableCol}>Client</div>
                  <div className={styles.tableCol}>Date</div>
                  <div className={styles.tableCol}>Montant</div>
                  <div className={styles.tableCol}>Statut</div>
                  <div className={styles.tableCol}>Actions</div>
                </div>
                
                {(stats.recentOrders || []).map((order) => (
                  <div key={order.id} className={styles.tableRow}>
                    <div className={styles.tableCol}>#{order.orderNumber}</div>
                    <div className={styles.tableCol}>{order.customerEmail}</div>
                    <div className={styles.tableCol}>{formatDate(order.createdAt)}</div>
                    <div className={styles.tableCol}>{formatCurrency(order.totalAmount)}</div>
                    <div className={styles.tableCol}>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                        {translateStatus(order.status)}
                      </span>
                    </div>
                    <div className={styles.tableCol}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleViewOrder(order.id)}
                      >
                        Voir
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleUpdateOrderStatus(order)}
                        style={{ marginLeft: '5px' }}
                      >
                        Statut
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className={styles.products}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Gestion des produits</h2>
                <div className={styles.headerActions}>
                  <div className={styles.viewToggle}>
                    <button
                      className={`${styles.viewButton} ${productsViewMode === 'list' ? styles.viewButtonActive : ''}`}
                      onClick={() => setProductsViewMode('list')}
                      title="Vue liste"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                    <button
                      className={`${styles.viewButton} ${productsViewMode === 'grid' ? styles.viewButtonActive : ''}`}
                      onClick={() => setProductsViewMode('grid')}
                      title="Vue grille"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                  </div>
                  <button className={styles.addButton}>Ajouter produit</button>
                </div>
              </div>

              {productsViewMode === 'list' ? (
                <div className={styles.productTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Produit</div>
                    <div className={styles.tableCell}>Prix</div>
                    <div className={styles.tableCell}>Ventes</div>
                    <div className={styles.tableCell}>Vues</div>
                    <div className={styles.tableCell}>Revenus</div>
                    <div className={styles.tableCell}>Actions</div>
                  </div>
                  {(stats.topProducts || []).map((product) => (
                    <div key={product.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>
                        <div className={styles.productCellInfo}>
                          <Image width={600} height={750} src={product.image || '/placeholder.jpg'}
                            alt={product.name}
                            className={styles.productThumb}
                          />
                          <span className={styles.productCellName}>{product.name}</span>
                        </div>
                      </div>
                      <div className={styles.tableCell}>{formatCurrency(product.price)}</div>
                      <div className={styles.tableCell}>{product.sales}</div>
                      <div className={styles.tableCell}>{product.views}</div>
                      <div className={styles.tableCell}>{formatCurrency(product.revenue)}</div>
                      <div className={styles.tableCell}>
                        <button className={styles.actionButton}>Modifier</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {(stats.topProducts || []).map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <Image width={600} height={750} src={product.image || '/placeholder.jpg'} alt={product.name} />
                      </div>
                      <div className={styles.productDetails}>
                        <h4 className={styles.productName}>{product.name}</h4>
                        <div className={styles.productPrice}>{formatCurrency(product.price)}</div>
                        <div className={styles.productStats}>
                          <span>{product.sales} ventes</span>
                          <span>{product.views} vues</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'customers' && (
            <div className={styles.customers}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Gestion des clients</h2>
                <div className={styles.headerActions}>
                  <input
                    type="text"
                    placeholder="Rechercher un client..."
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Total clients</div>
                  <div className={styles.miniStatValue}>{stats.totalCustomers || 0}</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Inscrits newsletter</div>
                  <div className={styles.miniStatValue}>{stats.newsletterSubscribersCount || 0}</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Clients fidèles</div>
                  <div className={styles.miniStatValue}>{stats.returningCustomers}%</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Nouveaux ce mois</div>
                  <div className={styles.miniStatValue}>{Math.floor(stats.totalCustomers * 0.15)}</div>
                </div>
              </div>

              <div className={styles.customersTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCol}>Client</div>
                  <div className={styles.tableCol}>Email</div>
                  <div className={styles.tableCol}>Commandes</div>
                  <div className={styles.tableCol}>Total dépensé</div>
                  <div className={styles.tableCol}>Newsletter</div>
                  <div className={styles.tableCol}>Dernière commande</div>
                  <div className={styles.tableCol}>Actions</div>
                </div>

                {(stats.customers || []).map((customer) => (
                  <div key={customer.id} className={styles.tableRow}>
                    <div className={styles.tableCol}>
                      {customer.firstName} {customer.lastName}
                    </div>
                    <div className={styles.tableCol}>{customer.email}</div>
                    <div className={styles.tableCol}>{customer.totalOrders}</div>
                    <div className={styles.tableCol}>{formatCurrency(customer.lifetimeValue)}</div>
                    <div className={styles.tableCol}>
                      {customer.isNewsletterSubscriber ? (
                        <span className={styles.newsletterBadge}>✓ Inscrit</span>
                      ) : (
                        <span className={styles.newsletterBadgeInactive}>Non inscrit</span>
                      )}
                    </div>
                    <div className={styles.tableCol}>
                      {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Jamais'}
                    </div>
                    <div className={styles.tableCol}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleViewCustomer(customer)}
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                ))}

                {(!stats.customers || stats.customers.length === 0) && (
                  <div className={styles.emptyState}>
                    <p>Aucun client pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className={styles.analytics}>
              {/* Statistiques rapides */}
              <div className={styles.statsRow}>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Visiteurs</div>
                  <div className={styles.miniStatValue}>{stats.visitors || 0}</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Taux de conversion</div>
                  <div className={styles.miniStatValue}>{stats.conversionRate || 0}%</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Commandes</div>
                  <div className={styles.miniStatValue}>{stats.totalOrders || 0}</div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Panier moyen</div>
                  <div className={styles.miniStatValue}>{formatCurrency(stats.averageOrderValue || 0)}</div>
                </div>
              </div>

              {/* Section Funnel de Conversion */}
              <div className={styles.funnelSection}>
                <h3 className={styles.sectionTitle}>🎯 Funnel de Conversion</h3>
                <div className={styles.funnelContainer}>
                  <div className={styles.funnelStep}>
                    <div className={styles.funnelStepLabel}>Visiteurs</div>
                    <div className={styles.funnelStepValue}>{stats.visitors || 0}</div>
                    <div className={styles.funnelStepBar} style={{ width: '100%' }}></div>
                  </div>

                  <div className={styles.funnelArrow}>↓</div>
                  <div className={styles.funnelConversion}>
                    {stats.visitors > 0 && stats.addToCartCount > 0
                      ? ((stats.addToCartCount / stats.visitors) * 100).toFixed(1)
                      : 0}% ajoutent au panier
                  </div>

                  <div className={styles.funnelStep}>
                    <div className={styles.funnelStepLabel}>Ajouts au panier</div>
                    <div className={styles.funnelStepValue}>{stats.addToCartCount || 0}</div>
                    <div className={styles.funnelStepBar} style={{
                      width: stats.visitors > 0 ? `${(stats.addToCartCount / stats.visitors) * 100}%` : '0%'
                    }}></div>
                  </div>

                  <div className={styles.funnelArrow}>↓</div>
                  <div className={styles.funnelConversion}>
                    {stats.addToCartCount > 0 && stats.checkoutInitiatedCount > 0
                      ? ((stats.checkoutInitiatedCount / stats.addToCartCount) * 100).toFixed(1)
                      : 0}% initient le paiement
                  </div>

                  <div className={styles.funnelStep}>
                    <div className={styles.funnelStepLabel}>Paiements initiés</div>
                    <div className={styles.funnelStepValue}>{stats.checkoutInitiatedCount || 0}</div>
                    <div className={styles.funnelStepBar} style={{
                      width: stats.visitors > 0 ? `${(stats.checkoutInitiatedCount / stats.visitors) * 100}%` : '0%'
                    }}></div>
                  </div>

                  <div className={styles.funnelArrow}>↓</div>
                  <div className={styles.funnelConversion}>
                    {stats.checkoutInitiatedCount > 0 && stats.totalOrders > 0
                      ? ((stats.totalOrders / stats.checkoutInitiatedCount) * 100).toFixed(1)
                      : 0}% finalisent
                  </div>

                  <div className={styles.funnelStep}>
                    <div className={styles.funnelStepLabel}>Commandes</div>
                    <div className={styles.funnelStepValue}>{stats.totalOrders || 0}</div>
                    <div className={styles.funnelStepBar} style={{
                      width: stats.visitors > 0 ? `${(stats.totalOrders / stats.visitors) * 100}%` : '0%'
                    }}></div>
                  </div>

                  <div className={styles.funnelSummary}>
                    <strong>Taux de conversion global :</strong> {stats.conversionRate || 0}%
                  </div>
                </div>
              </div>

              {/* Section Visiteurs - Pages les plus visitées */}
              <div className={styles.visitorsSection}>
                <h3 className={styles.sectionTitle}>Pages les plus visitées</h3>
                <div className={styles.pageViewsTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCol}>Page</div>
                    <div className={styles.tableCol} style={{ textAlign: 'right' }}>Vues</div>
                  </div>
                  {(stats.pageViews || []).map((pv, index) => (
                    <div key={index} className={styles.tableRow}>
                      <div className={styles.tableCol}>
                        <span className={styles.pagePath}>{pv.page}</span>
                      </div>
                      <div className={styles.tableCol} style={{ textAlign: 'right', fontWeight: '500' }}>
                        {pv.views}
                      </div>
                    </div>
                  ))}
                  {(!stats.pageViews || stats.pageViews.length === 0) && (
                    <div className={styles.emptyState}>
                      <p>Aucune page visitée sur cette période</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Grille des métriques */}
              <div className={styles.analyticsGrid}>
                <div className={styles.chartCard}>
                  <h3 className={styles.cardTitle}>Évolution du chiffre d'affaires</h3>
                  <div className={styles.chartPlaceholder}>
                    <p style={{ fontSize: '24px', fontWeight: '300', margin: '20px 0' }}>
                      {formatCurrency(stats.totalRevenue || 0)}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      Sur la période sélectionnée
                    </p>
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.cardTitle}>Produits populaires</h3>
                  <div className={styles.chartPlaceholder}>
                    <p style={{ fontSize: '24px', fontWeight: '300', margin: '20px 0' }}>
                      {(stats.topProducts || []).length}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      Produits avec des ventes
                    </p>
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.cardTitle}>Clients actifs</h3>
                  <div className={styles.chartPlaceholder}>
                    <p style={{ fontSize: '24px', fontWeight: '300', margin: '20px 0' }}>
                      {stats.totalCustomers || 0}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      Total clients et abonnés
                    </p>
                  </div>
                </div>

                <div className={styles.chartCard}>
                  <h3 className={styles.cardTitle}>Stock total</h3>
                  <div className={styles.chartPlaceholder}>
                    <p style={{ fontSize: '24px', fontWeight: '300', margin: '20px 0' }}>
                      {(stats.inventory || []).reduce((sum, item) => sum + item.stock, 0)}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      Articles en stock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className={styles.inventory}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Gestion du stock</h2>
                <div className={styles.headerActions}>
                  <button className={styles.exportButton}>Exporter</button>
                  <button className={styles.addButton}>Ajuster stock</button>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Produits en stock</div>
                  <div className={styles.miniStatValue}>
                    {(stats.inventory || []).filter(i => i.stock > 0).length}
                  </div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Stock faible</div>
                  <div className={styles.miniStatValue}>
                    {(stats.inventory || []).filter(i => i.stock > 0 && i.stock <= 5).length}
                  </div>
                </div>
                <div className={styles.miniStatCard}>
                  <div className={styles.miniStatLabel}>Rupture</div>
                  <div className={styles.miniStatValue}>
                    {(stats.inventory || []).filter(i => i.stock === 0).length}
                  </div>
                </div>
              </div>

              <div className={styles.inventoryTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCol}>Produit</div>
                  <div className={styles.tableCol}>Couleur</div>
                  <div className={styles.tableCol}>Taille</div>
                  <div className={styles.tableCol}>SKU</div>
                  <div className={styles.tableCol}>Stock</div>
                  <div className={styles.tableCol}>Statut</div>
                  <div className={styles.tableCol}>Actions</div>
                </div>

                {(stats.inventory || []).map((item) => (
                  <div key={item.id} className={styles.tableRow}>
                    <div className={styles.tableCol}>{item.productName}</div>
                    <div className={styles.tableCol}>{item.color}</div>
                    <div className={styles.tableCol}>{item.size}</div>
                    <div className={styles.tableCol}>{item.sku}</div>
                    <div className={styles.tableCol}>
                      <strong>{item.stock}</strong>
                    </div>
                    <div className={styles.tableCol}>
                      <span className={`${styles.stockStatus} ${
                        item.stock === 0 ? styles.outOfStock :
                        item.stock <= 5 ? styles.lowStock :
                        styles.inStock
                      }`}>
                        {item.stock === 0 ? 'Rupture' :
                         item.stock <= 5 ? 'Stock faible' :
                         'En stock'}
                      </span>
                    </div>
                    <div className={styles.tableCol}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleAdjustStock(item)}
                      >
                        Ajuster
                      </button>
                    </div>
                  </div>
                ))}

                {(!stats.inventory || stats.inventory.length === 0) && (
                  <div className={styles.emptyState}>
                    <p>Aucun inventaire disponible</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Details Modal */}
          {showOrderModal && selectedOrder && (
            <div className={styles.modalOverlay} onClick={() => setShowOrderModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Détails de la commande {selectedOrder.orderNumber}</h2>
                  <button
                    className={styles.modalClose}
                    onClick={() => setShowOrderModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.orderDetailGrid}>
                    <div className={styles.orderDetailSection}>
                      <h3>Informations commande</h3>
                      <div className={styles.detailRow}>
                        <span>Statut:</span>
                        <strong>{translateStatus(selectedOrder.status)}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Paiement:</span>
                        <strong>{translateStatus(selectedOrder.paymentStatus)}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Date:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Total:</span>
                        <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <>
                          <div className={styles.detailRow}>
                            <span>Transporteur:</span>
                            <strong>{selectedOrder.carrier}</strong>
                          </div>
                          <div className={styles.detailRow}>
                            <span>Numéro de suivi:</span>
                            <strong>{selectedOrder.trackingNumber}</strong>
                          </div>
                          {selectedOrder.shippedAt && (
                            <div className={styles.detailRow}>
                              <span>Expédié le:</span>
                              <span>{formatDate(selectedOrder.shippedAt)}</span>
                            </div>
                          )}
                        </>
                      )}
                      <div style={{ marginTop: '20px' }}>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            setShowOrderModal(false);
                            handleUpdateOrderStatus(selectedOrder);
                          }}
                          style={{ width: '100%' }}
                        >
                          Modifier le statut / tracking
                        </button>
                      </div>
                    </div>

                    <div className={styles.orderDetailSection}>
                      <h3>Client</h3>
                      <div className={styles.detailRow}>
                        <span>Nom:</span>
                        <span>{selectedOrder.customerName}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Email:</span>
                        <span>{selectedOrder.customerEmail}</span>
                      </div>
                      {selectedOrder.customerPhone && (
                        <div className={styles.detailRow}>
                          <span>Téléphone:</span>
                          <span>{selectedOrder.customerPhone}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.orderDetailSection}>
                      <h3>Adresse de livraison</h3>
                      {selectedOrder.shippingAddress && typeof selectedOrder.shippingAddress === 'object' && (
                        <>
                          <div className={styles.detailRow}>
                            <span>{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span>{selectedOrder.shippingAddress.address1}</span>
                          </div>
                          {selectedOrder.shippingAddress.address2 && (
                            <div className={styles.detailRow}>
                              <span>{selectedOrder.shippingAddress.address2}</span>
                            </div>
                          )}
                          <div className={styles.detailRow}>
                            <span>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span>{selectedOrder.shippingAddress.country}</span>
                          </div>
                          {selectedOrder.shippingAddress.phone && (
                            <div className={styles.detailRow}>
                              <span>Tél: {selectedOrder.shippingAddress.phone}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                    <div className={styles.orderDetailSection}>
                      <h3>Produits</h3>
                      <div className={styles.orderItemsList}>
                        {selectedOrder.orderItems.map((item, index) => (
                          <div key={index} className={styles.orderItemRow}>
                            <div>{item.productName}</div>
                            <div>{item.color} / {item.size}</div>
                            <div>Qté: {item.quantity}</div>
                            <div>{formatCurrency(item.price)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowOrderModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stock Adjustment Modal */}
          {showStockModal && selectedStock && (
            <div className={styles.modalOverlay} onClick={() => setShowStockModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Ajuster le stock</h2>
                  <button
                    className={styles.modalClose}
                    onClick={() => setShowStockModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.stockAdjustInfo}>
                    <div className={styles.detailRow}>
                      <span>Produit:</span>
                      <strong>{selectedStock.productName}</strong>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Variante:</span>
                      <span>{selectedStock.color} / {selectedStock.size}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>SKU:</span>
                      <span>{selectedStock.sku}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Stock actuel:</span>
                      <strong>{selectedStock.stock}</strong>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newStock">Nouveau stock:</label>
                    <input
                      type="number"
                      id="newStock"
                      min="0"
                      value={newStockValue}
                      onChange={(e) => setNewStockValue(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowStockModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className={styles.primaryButton}
                    onClick={handleUpdateStock}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Customer Details Modal */}
          {showCustomerModal && selectedCustomer && (
            <div className={styles.modalOverlay} onClick={() => setShowCustomerModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Détails du client</h2>
                  <button
                    className={styles.modalClose}
                    onClick={() => setShowCustomerModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.orderDetailGrid}>
                    <div className={styles.orderDetailSection}>
                      <h3>Informations générales</h3>
                      <div className={styles.detailRow}>
                        <span>Nom:</span>
                        <strong>{selectedCustomer.firstName} {selectedCustomer.lastName}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Email:</span>
                        <span>{selectedCustomer.email}</span>
                      </div>
                      {selectedCustomer.phone && (
                        <div className={styles.detailRow}>
                          <span>Téléphone:</span>
                          <span>{selectedCustomer.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.orderDetailSection}>
                      <h3>Statistiques</h3>
                      <div className={styles.detailRow}>
                        <span>Total commandes:</span>
                        <strong>{selectedCustomer.totalOrders}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Montant total dépensé:</span>
                        <strong>{formatCurrency(selectedCustomer.lifetimeValue)}</strong>
                      </div>
                      <div className={styles.detailRow}>
                        <span>Dernière commande:</span>
                        <span>{selectedCustomer.lastOrderDate ? formatDate(selectedCustomer.lastOrderDate) : 'Jamais'}</span>
                      </div>
                    </div>

                    {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                      <div className={styles.orderDetailSection}>
                        <h3>Adresses</h3>
                        {selectedCustomer.addresses.map((address, index) => (
                          <div key={index} className={styles.addressBlock}>
                            <strong>{address.type}</strong>
                            <div>{address.firstName} {address.lastName}</div>
                            <div>{address.address1}</div>
                            {address.address2 && <div>{address.address2}</div>}
                            <div>{address.postalCode} {address.city}</div>
                            <div>{address.country}</div>
                            {address.phone && <div>Tél: {address.phone}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowCustomerModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <div className={styles.emails}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Gestion des Emails</h2>
              </div>

              <div className={styles.emailTemplatesGrid}>
                {emailTemplates.map((template) => (
                  <div key={template.id} className={styles.templateCard}>
                    <div className={styles.templateHeader}>
                      <h3 className={styles.templateName}>{template.name}</h3>
                      <span className={`${styles.templateBadge} ${styles[template.category]}`}>
                        {template.category}
                      </span>
                    </div>
                    <p className={styles.templateDescription}>{template.description}</p>
                    <div className={styles.templateMeta}>
                      <span className={styles.templateSubject}>Sujet: {template.subject}</span>
                      <span className={styles.templateStatus}>
                        {template.isActive ? '✓ Actif' : '○ Inactif'}
                      </span>
                    </div>
                    <div className={styles.templateVariables}>
                      <strong>Variables:</strong> {template.variables.join(', ')}
                    </div>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleViewTemplate(template)}
                      style={{ marginTop: '15px', width: '100%' }}
                    >
                      Voir / Modifier
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Status Update Modal */}
          {showOrderStatusModal && selectedOrderForUpdate && (
            <div className={styles.modalOverlay} onClick={() => setShowOrderStatusModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Changer le statut de la commande</h2>
                  <button
                    className={styles.modalClose}
                    onClick={() => setShowOrderStatusModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.stockAdjustInfo}>
                    <div className={styles.detailRow}>
                      <span>Commande:</span>
                      <strong>#{selectedOrderForUpdate.orderNumber}</strong>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Statut actuel:</span>
                      <strong>{translateStatus(selectedOrderForUpdate.status)}</strong>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newStatus">Nouveau statut:</label>
                    <select
                      id="newStatus"
                      value={newOrderStatus}
                      onChange={(e) => setNewOrderStatus(e.target.value)}
                      className={styles.input}
                    >
                      <option value="PENDING">EN ATTENTE</option>
                      <option value="PAID">PAYÉE</option>
                      <option value="PROCESSING">EN TRAITEMENT</option>
                      <option value="SHIPPED">EXPÉDIÉE</option>
                      <option value="DELIVERED">LIVRÉE</option>
                      <option value="CANCELLED">ANNULÉE</option>
                      <option value="REFUNDED">REMBOURSÉE</option>
                    </select>
                  </div>

                  {(newOrderStatus === 'SHIPPED' || newOrderStatus === 'DELIVERED') && (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="carrier">Transporteur:</label>
                        <select
                          id="carrier"
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className={styles.input}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="Chronopost">Chronopost</option>
                          <option value="Colissimo">Colissimo</option>
                          <option value="DHL">DHL</option>
                          <option value="FedEx">FedEx</option>
                          <option value="UPS">UPS</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="tracking">Numéro de suivi:</label>
                        <input
                          type="text"
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className={styles.input}
                          placeholder="Ex: AB123456789FR"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowOrderStatusModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className={styles.primaryButton}
                    onClick={handleConfirmOrderStatusUpdate}
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email Template Modal */}
          {showTemplateModal && selectedTemplate && (
            <div className={styles.modalOverlay} onClick={() => setShowTemplateModal(false)}>
              <div className={styles.modalContent} style={{maxWidth: '900px'}} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>{selectedTemplate.name}</h2>
                  <button
                    className={styles.modalClose}
                    onClick={() => setShowTemplateModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className={styles.modalBody}>
                  <div className={styles.templateDetails}>
                    <div className={styles.detailRow}>
                      <span>ID:</span>
                      <span>{selectedTemplate.id}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Catégorie:</span>
                      <span>{selectedTemplate.category}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Sujet:</span>
                      <span>{selectedTemplate.subject}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span>Variables disponibles:</span>
                      <span>{selectedTemplate.variables.join(', ')}</span>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Aperçu HTML:</label>
                    <textarea
                      value={selectedTemplate.htmlContent}
                      readOnly
                      className={styles.textarea}
                      style={{ height: '400px', fontFamily: 'monospace', fontSize: '11px' }}
                    />
                  </div>

                  <div style={{ background: '#f9f9f9', padding: '15px', marginTop: '20px' }}>
                    <p style={{ margin: '0', fontSize: '11px', color: '#666' }}>
                      📝 <strong>Note:</strong> La modification des templates sera bientôt disponible.
                      Pour l'instant, vous pouvez consulter le contenu HTML.
                    </p>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setShowTemplateModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// Protéger la route admin (à implémenter)
export async function getServerSideProps(context) {
  // TODO: Vérifier l'authentification admin
  return {
    props: {}
  };
}