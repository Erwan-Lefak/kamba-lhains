import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simple auth check (you should verify admin session here)
  const { adminKey } = req.body;
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Get existing products to link orders to
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        variants: true
      }
    });

    if (products.length === 0) {
      return res.status(400).json({
        message: 'No products found. Please add products first.'
      });
    }

    const testOrders = [];
    const testUsers = [];
    const currentYear = new Date().getFullYear();

    // Create 10 test users first
    for (let i = 0; i < 10; i++) {
      const email = `client${i}@test.com`;
      const firstName = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Emma', 'Paul', 'Julie', 'Marc', 'Alice'][i];
      const lastName = ['Dupont', 'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy'][i];

      try {
        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Create user with profile
          user = await prisma.user.create({
            data: {
              email,
              password: 'hashed_password_demo', // In real app, this would be hashed
              role: 'user',
              profile: {
                create: {
                  firstName,
                  lastName,
                  phone: `06${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
                  totalOrders: 0,
                  lifetimeValue: 0
                }
              }
            }
          });
        }

        testUsers.push(user);
      } catch (error) {
        console.error(`Error creating user ${email}:`, error);
      }
    }

    // Create 10 test orders with users
    for (let i = 0; i < 10; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomVariant = randomProduct.variants[0] || { color: 'Noir', size: 'M' };
      const user = testUsers[i] || testUsers[0]; // Use created user

      const orderNumber = `KL-${currentYear}-${String(100000 + i).slice(-6)}`;
      const quantity = Math.floor(Math.random() * 3) + 1;
      const totalAmount = parseFloat(randomProduct.price) * quantity + 9.90;

      const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      const paymentStatuses = ['PENDING', 'PAID', 'PAID', 'PAID', 'PAID'];
      const statusIndex = Math.floor(Math.random() * statuses.length);

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id, // Link to user instead of guest
          guestEmail: null,
          guestPhone: null,
          status: statuses[statusIndex],
          paymentStatus: paymentStatuses[statusIndex],
          totalAmount,
          shippingCost: 9.90,
          taxAmount: 0,
          shippingAddress: {
            firstName: `Client${i}`,
            lastName: 'Test',
            address: `${i + 1} Rue de Test`,
            city: 'Paris',
            postalCode: '75001',
            country: 'FR',
            phone: `06${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
          },
          paymentMethod: 'card',
          stripePaymentId: `pi_test_${Math.random().toString(36).substring(7)}`,
          carrier: statusIndex >= 3 ? 'Chronopost' : null,
          trackingNumber: statusIndex >= 3 ? `CP${Math.floor(Math.random() * 1000000000)}` : null,
          shippingMethod: 'standard',
          confirmedAt: statusIndex >= 1 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          processedAt: statusIndex >= 2 ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
          shippedAt: statusIndex >= 3 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
          deliveredAt: statusIndex >= 4 ? new Date(Date.now() - Math.random() * 1 * 24 * 60 * 60 * 1000) : null,
          orderItems: {
            create: [
              {
                productId: randomProduct.id,
                productName: randomProduct.name,
                productImage: randomProduct.images[0] || '/placeholder.jpg',
                quantity,
                price: randomProduct.price,
                size: randomVariant.size,
                color: randomVariant.color
              }
            ]
          }
        },
        include: {
          orderItems: true
        }
      });

      testOrders.push(order);

      // Update user profile with order count and lifetime value
      if (user && statusIndex >= 1) { // Only count paid orders
        const userOrders = await prisma.order.findMany({
          where: {
            userId: user.id,
            status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] }
          }
        });

        const lifetimeValue = userOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

        await prisma.userProfile.update({
          where: { userId: user.id },
          data: {
            totalOrders: userOrders.length,
            lifetimeValue
          }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Created ${testUsers.length} test users and ${testOrders.length} test orders`,
      users: testUsers.length,
      orders: testOrders.map(o => ({
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount
      }))
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create test data',
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
