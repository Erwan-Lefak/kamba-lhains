import { prisma } from '../../../lib/prisma'
import { confirmPaymentIntent } from '../../../lib/stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Méthode non autorisée' 
    })
  }

  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID requis'
      })
    }

    // Confirm payment with Stripe
    const paymentIntent = await confirmPaymentIntent(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Update order status in database
      const order = await prisma.order.findFirst({
        where: { paymentId: paymentIntentId }
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'PAID',
            confirmedAt: new Date(),
            updatedAt: new Date(),
          }
        })
      }

      res.status(200).json({
        success: true,
        message: 'Paiement confirmé avec succès',
        data: {
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert back from cents
          },
          orderId: order?.id
        }
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Le paiement n\'a pas pu être confirmé',
        data: {
          status: paymentIntent.status
        }
      })
    }

  } catch (error) {
    console.error('Payment confirmation error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation du paiement'
    })
  }
}