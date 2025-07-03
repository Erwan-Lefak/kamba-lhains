import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../lib/middleware/auth'
import { updateOrderStatusSchema } from '../../../lib/validations/order'

async function handler(req, res) {
  const { id } = req.query

  switch (req.method) {
    case 'GET':
      return getOrder(req, res, id)
    case 'PATCH':
      return updateOrder(req, res, id)
    case 'DELETE':
      return cancelOrder(req, res, id)
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      })
  }
}

async function getOrder(req, res, orderId) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id, // Users can only access their own orders
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                description: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      })
    }

    res.status(200).json({
      success: true,
      data: { order }
    })

  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande'
    })
  }
}

async function updateOrder(req, res, orderId) {
  try {
    // Only admins can update order status
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Accès administrateur requis'
      })
    }

    const validatedData = updateOrderStatusSchema.parse(req.body)
    const { status, trackingNumber, notes } = validatedData

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { notes }),
        updatedAt: new Date(),
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true
              }
            }
          }
        }
      }
    })

    res.status(200).json({
      success: true,
      message: 'Commande mise à jour avec succès',
      data: { order: updatedOrder }
    })

  } catch (error) {
    console.error('Update order error:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la commande'
    })
  }
}

async function cancelOrder(req, res, orderId) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
      }
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      })
    }

    // Only allow cancellation if order is still pending
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut plus être annulée'
      })
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      }
    })

    res.status(200).json({
      success: true,
      message: 'Commande annulée avec succès',
      data: { order: cancelledOrder }
    })

  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la commande'
    })
  }
}

export default withAuth(handler)