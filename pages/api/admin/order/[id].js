import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Format response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      shippingCost: order.shippingCost,
      taxAmount: order.taxAmount,
      createdAt: order.createdAt,
      confirmedAt: order.confirmedAt,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,

      // Customer info
      customerEmail: order.guestEmail || order.user?.email,
      customerPhone: order.guestPhone || order.user?.profile?.phone,
      customerName: order.user ? `${order.user.profile?.firstName || ''} ${order.user.profile?.lastName || ''}`.trim() : 'Client invité',

      // Addresses
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,

      // Items
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }))
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande' });
  }
}
