import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to check if an email is a test email
const isTestEmail = (email) => {
  if (!email) return false;
  const lowerEmail = email.toLowerCase();

  // Filter test email patterns
  const testPatterns = [
    '@test.com',
    '@demo.com',
    '@example.com',
    '@fake.com',
    '@dummy.com',
    'test@test',
    'demo@demo',
    'noreply@',
    'no-reply@'
  ];

  // Check if email matches test patterns
  if (testPatterns.some(pattern => lowerEmail.includes(pattern))) {
    return true;
  }

  // Check for patterns like client1@test.com, user5@test.com, etc.
  if (/^(client|user|test|demo)\d+@/.test(lowerEmail)) {
    return true;
  }

  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { range = '7d', startDate: customStartDate, endDate: customEndDate } = req.query;

    // Calculer les dates pour la période sélectionnée
    const now = new Date();
    let startDate;
    let endDate = now;

    if (range === 'custom' && customStartDate) {
      startDate = new Date(customStartDate);
      startDate.setHours(0, 0, 0, 0);
      if (customEndDate) {
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      switch (range) {
        case 'today':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          endDate.setDate(endDate.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case '7d':
          startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1y':
          startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      }
    }

    // Statistiques principales avec gestion des données vides
    const [
      totalRevenue,
      ordersToday,
      totalOrders,
      recentOrders,
      topProducts,
      lowStockItems,
      customers,
      totalCustomers,
      inventory,
      newsletterSubscribers,
      visitorsData,
      pageViews,
      addToCartData,
      checkoutInitiatedData
    ] = await Promise.all([
      // Chiffre d'affaires total
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        select: {
          totalAmount: true,
          guestEmail: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }),

      // Commandes d'aujourd'hui
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: (() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return today;
            })(),
            lte: new Date()
          }
        },
        select: {
          id: true,
          guestEmail: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }),

      // Total des commandes sur la période
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          guestEmail: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }),

      // Commandes récentes
      prisma.order.findMany({
        take: 20,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          guestEmail: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }),

      // Produits les plus vendus
      prisma.product.findMany({
        take: 50,
        include: {
          orderItems: {
            where: {
              order: {
                createdAt: {
                  gte: startDate,
                  lte: endDate
                },
                status: {
                  in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                }
              }
            },
            include: {
              order: {
                select: {
                  guestEmail: true,
                  user: {
                    select: {
                      email: true
                    }
                  }
                }
              }
            }
          },
          analytics: {
            where: {
              event: 'view',
              date: {
                gte: startDate,
                lte: endDate
              }
            }
          },
          _count: {
            select: {
              orderItems: true
            }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        }
      }),

      // Articles en rupture de stock
      prisma.productVariant.findMany({
        where: {
          stock: {
            lte: 5
          }
        },
        take: 10,
        include: {
          product: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          stock: 'asc'
        }
      }),

      // Clients avec leurs profils
      prisma.user.findMany({
        take: 50,
        include: {
          profile: true,
          orders: {
            where: {
              status: {
                in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Total des clients
      prisma.user.count(),

      // Inventaire complet
      prisma.productVariant.findMany({
        take: 100,
        include: {
          product: {
            select: {
              name: true
            }
          }
        },
        orderBy: [
          {
            stock: 'asc'
          },
          {
            product: {
              name: 'asc'
            }
          }
        ]
      }),

      // Abonnés à la newsletter
      prisma.newsletterSubscriber.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          subscribedAt: 'desc'
        }
      }),

      // Visiteurs uniques (sessions)
      prisma.userAnalytics.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      }),

      // Pages vues (sessions uniques par page)
      prisma.userAnalytics.findMany({
        where: {
          event: 'page_view',
          createdAt: {
            gte: startDate,
            lte: endDate
          },
          page: {
            not: '/admin/dashboard'
          }
        },
        select: {
          page: true,
          sessionId: true
        }
      }),

      // Ajouts au panier (sessions uniques)
      prisma.userAnalytics.findMany({
        where: {
          event: 'add_to_cart',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      }),

      // Paiements initiés (sessions uniques)
      prisma.userAnalytics.findMany({
        where: {
          event: 'checkout_initiated',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          sessionId: true
        },
        distinct: ['sessionId']
      })
    ]);

    // Filter out test data from ALL statistics
    const filteredTotalRevenue = totalRevenue.filter(order => {
      const email = order.guestEmail || order.user?.email;
      return !isTestEmail(email);
    });

    const filteredOrdersToday = ordersToday.filter(order => {
      const email = order.guestEmail || order.user?.email;
      return !isTestEmail(email);
    });

    const filteredTotalOrders = totalOrders.filter(order => {
      const email = order.guestEmail || order.user?.email;
      return !isTestEmail(email);
    });

    const totalRevenueAmount = filteredTotalRevenue.reduce((sum, order) =>
      sum + parseFloat(order.totalAmount), 0
    );

    const ordersTodayCount = filteredOrdersToday.length;
    const totalOrdersCount = filteredTotalOrders.length;

    // Calculer le panier moyen
    const averageOrderValue = totalOrdersCount > 0
      ? totalRevenueAmount / totalOrdersCount
      : 0;

    // Formatter les données pour le frontend
    const formattedTopProducts = topProducts.map(product => {
      // Filter out test orders from top products
      const validOrderItems = product.orderItems.filter(item => {
        const email = item.order?.guestEmail || item.order?.user?.email;
        return !isTestEmail(email);
      });

      const sales = validOrderItems.length;
      const revenue = validOrderItems.reduce((sum, item) =>
        sum + (parseFloat(item.price) * item.quantity), 0
      );

      // Calculate total views from analytics
      const totalViews = (product.analytics || []).reduce((sum, analytic) =>
        sum + (analytic.count || 0), 0
      );

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        sales,
        revenue,
        views: totalViews,
        image: product.images[0] || null
      };
    });

    // Filter out test orders
    const filteredRecentOrders = recentOrders.filter(order => {
      const email = order.guestEmail || order.user?.email;
      return !isTestEmail(email);
    });

    const formattedRecentOrders = filteredRecentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.guestEmail || order.user?.email || 'Client invité',
      totalAmount: parseFloat(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt
    }));

    const formattedLowStockItems = lowStockItems ? lowStockItems.map(item => ({
      id: item.id,
      name: item.product.name,
      color: item.color,
      size: item.size,
      stock: item.stock
    })) : [];

    // Créer un Map des emails inscrits à la newsletter
    const newsletterEmailsSet = new Set(
      (newsletterSubscribers || []).map(sub => sub.email.toLowerCase())
    );

    // Filter out test customers
    const filteredCustomers = (customers || []).filter(customer => !isTestEmail(customer.email));

    // Formater les données clients (utilisateurs avec compte)
    const formattedCustomers = filteredCustomers.map(customer => {
      const lastOrder = customer.orders[0];
      const isNewsletterSubscriber = newsletterEmailsSet.has(customer.email.toLowerCase());

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.profile?.firstName || 'N/A',
        lastName: customer.profile?.lastName || 'N/A',
        totalOrders: customer._count.orders,
        lifetimeValue: parseFloat(customer.profile?.lifetimeValue || 0),
        lastOrderDate: lastOrder?.createdAt || null,
        isNewsletterSubscriber,
        source: 'account'
      };
    });

    // Ajouter les abonnés newsletter qui n'ont PAS de compte utilisateur
    const userEmails = new Set(filteredCustomers.map(c => c.email.toLowerCase()));
    const newsletterOnlySubscribers = (newsletterSubscribers || [])
      .filter(sub => !userEmails.has(sub.email.toLowerCase()) && !isTestEmail(sub.email))
      .map(sub => ({
        id: `newsletter-${sub.id}`,
        email: sub.email,
        firstName: sub.firstName || 'N/A',
        lastName: 'N/A',
        totalOrders: 0,
        lifetimeValue: 0,
        lastOrderDate: null,
        isNewsletterSubscriber: true,
        source: 'newsletter',
        subscribedAt: sub.subscribedAt,
        language: sub.language
      }));

    // Fusionner les deux listes
    const allCustomers = [...formattedCustomers, ...newsletterOnlySubscribers];

    // Formater l'inventaire
    const formattedInventory = (inventory || []).map(variant => ({
      id: variant.id,
      productName: variant.product.name,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock,
      lowStockThreshold: variant.lowStockThreshold
    }));

    // Calculer les clients fidèles (plus de 1 commande)
    const returningCustomersCount = filteredCustomers.filter(c => c._count.orders > 1).length;
    const returningCustomersPercent = allCustomers.length > 0
      ? Math.round((returningCustomersCount / allCustomers.length) * 100)
      : 0;

    // Calculer le taux de conversion réel
    const visitorsCount = (visitorsData || []).length;
    const conversionRate = visitorsCount > 0
      ? ((totalOrdersCount / visitorsCount) * 100).toFixed(2)
      : 0;

    // Compter les sessions uniques par page
    const pageViewsMap = new Map();
    (pageViews || []).forEach(pv => {
      const page = pv.page || '/';
      const sessionId = pv.sessionId;

      if (!pageViewsMap.has(page)) {
        pageViewsMap.set(page, new Set());
      }
      pageViewsMap.get(page).add(sessionId);
    });

    // Formater et trier par nombre de sessions uniques décroissant
    const formattedPageViews = Array.from(pageViewsMap.entries())
      .map(([page, sessions]) => ({
        page,
        views: sessions.size  // Nombre de sessions uniques
      }))
      .filter(pv => pv.views > 0)
      .sort((a, b) => b.views - a.views);

    const dashboardData = {
      totalRevenue: parseFloat(totalRevenueAmount) || 0,
      ordersToday: ordersTodayCount || 0,
      totalOrders: totalOrdersCount || 0,
      averageOrderValue: parseFloat(averageOrderValue) || 0,
      conversionRate,
      returningCustomers: returningCustomersPercent,
      visitors: (visitorsData || []).length,
      pageViews: formattedPageViews,
      addToCartCount: (addToCartData || []).length,
      checkoutInitiatedCount: (checkoutInitiatedData || []).length,
      topProducts: formattedTopProducts || [],
      recentOrders: formattedRecentOrders || [],
      lowStockItems: formattedLowStockItems || [],
      customers: allCustomers || [],
      totalCustomers: allCustomers.length || 0,
      newsletterSubscribersCount: (newsletterSubscribers || []).length,
      inventory: formattedInventory || []
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données du dashboard:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}