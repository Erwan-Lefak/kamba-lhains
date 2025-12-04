import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { range = '7d' } = req.query;
    
    // Calculer les dates pour la période sélectionnée
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
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

    // Statistiques principales avec gestion des données vides
    const [
      totalRevenue,
      ordersToday,
      totalOrders,
      recentOrders,
      topProducts,
      lowStockItems
    ] = await Promise.all([
      // Chiffre d'affaires total
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate
          },
          status: {
            in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
          }
        },
        _sum: {
          totalAmount: true
        }
      }),

      // Commandes d'aujourd'hui
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(now.setHours(0, 0, 0, 0))
          }
        }
      }),

      // Total des commandes sur la période
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate
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
        take: 10,
        include: {
          orderItems: {
            where: {
              order: {
                createdAt: {
                  gte: startDate
                },
                status: {
                  in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                }
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
      })
    ]);

    // Calculer le panier moyen
    const averageOrderValue = totalOrders > 0 
      ? (totalRevenue._sum.totalAmount || 0) / totalOrders 
      : 0;

    // Formatter les données pour le frontend
    const formattedTopProducts = topProducts.map(product => {
      const sales = product.orderItems.length;
      const revenue = product.orderItems.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        sales,
        revenue,
        views: Math.floor(Math.random() * 1000) + 100, // Placeholder
        image: product.images[0] || null
      };
    });

    const formattedRecentOrders = recentOrders.map(order => ({
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

    // Calculer quelques métriques additionnelles (placeholders)
    const conversionRate = 2.4; // Placeholder - à calculer avec les analytics
    const returningCustomers = 35; // Placeholder - à calculer

    const dashboardData = {
      totalRevenue: parseFloat(totalRevenue?._sum?.totalAmount) || 0,
      ordersToday: ordersToday || 0,
      totalOrders: totalOrders || 0,
      averageOrderValue: parseFloat(averageOrderValue) || 0,
      conversionRate,
      returningCustomers,
      topProducts: formattedTopProducts || [],
      recentOrders: formattedRecentOrders || [],
      lowStockItems: formattedLowStockItems || []
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