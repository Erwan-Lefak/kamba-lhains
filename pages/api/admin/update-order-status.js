import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderId, status, trackingNumber, carrier } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: 'orderId et status sont requis' });
  }

  const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  try {
    // Récupérer la commande existante
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    // Mise à jour du tracking et du transporteur si fournis
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }
    if (carrier) {
      updateData.carrier = carrier;
    }

    // Si le statut est SHIPPED, on exige tracking et carrier
    if (status === 'SHIPPED') {
      if (!trackingNumber || !carrier) {
        return res.status(400).json({
          error: 'Le numéro de suivi et le transporteur sont requis pour expédier une commande'
        });
      }
      // Mettre la date d'expédition uniquement si elle n'existe pas déjà
      if (!existingOrder.shippedAt) {
        updateData.shippedAt = new Date();
      }
    }

    // Si le statut est PROCESSING
    if (status === 'PROCESSING') {
      updateData.processedAt = new Date();
    }

    // Si le statut est DELIVERED
    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    // Si le statut est PAID et paymentStatus n'est pas encore PAID
    if (status === 'PAID') {
      updateData.paymentStatus = 'PAID';
      updateData.confirmedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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

    // TODO: Envoyer un email automatique selon le statut
    // Si SHIPPED -> envoyer email avec tracking
    // Si DELIVERED -> envoyer email de satisfaction

    res.status(200).json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        carrier: updatedOrder.carrier
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la commande' });
  }
}
