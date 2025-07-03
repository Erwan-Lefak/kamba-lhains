import { prisma } from '../../../lib/prisma'
import { withAuth } from '../../../lib/middleware/auth'
import { createOrderSchema } from '../../../lib/validations/order'
import { createPaymentIntent, calculateShipping, calculateTax } from '../../../lib/stripe'

async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getOrders(req, res)
    case 'POST':
      return createOrder(req, res)
    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Méthode non autorisée' 
      })
  }
}

async function getOrders(req, res) {
  try {
    const { limit = 10, offset = 0, status } = req.query
    
    const where = { userId: req.user.id }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    })

    const total = await prisma.order.count({ where })

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      }
    })

  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes'
    })
  }
}

async function createOrder(req, res) {
  try {
    // Validate input
    const validatedData = createOrderSchema.parse(req.body)
    const { shippingAddress, billingAddress, useSameAddress, paymentMethod, shippingMethod, notes } = validatedData

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      }
    })

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Votre panier est vide'
      })
    }

    // Check product availability
    for (const item of cartItems) {
      if (!item.product.inStock) {
        return res.status(400).json({
          success: false,
          message: `Le produit ${item.product.name} n'est plus en stock`
        })
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity)
    }, 0)

    const shippingCost = calculateShipping(shippingMethod, subtotal)
    const taxAmount = calculateTax(subtotal + shippingCost, shippingAddress.country)
    const totalAmount = subtotal + shippingCost + taxAmount

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        status: 'PENDING',
        totalAmount,
        shippingAddress: {
          ...shippingAddress,
          shippingMethod,
          shippingCost,
        },
        billingAddress: useSameAddress ? shippingAddress : billingAddress,
        paymentMethod,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          }))
        }
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

    // Create payment intent for Stripe
    let paymentIntent = null
    if (paymentMethod === 'stripe') {
      paymentIntent = await createPaymentIntent({
        amount: totalAmount,
        orderId: order.id,
        customerEmail: shippingAddress.email,
        shippingAddress,
      })

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentId: paymentIntent.id }
      })
    }

    // Clear cart after successful order creation
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    })

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: {
        order: {
          ...order,
          subtotal,
          shippingCost,
          taxAmount,
          totalAmount,
        },
        paymentIntent: paymentIntent ? {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
        } : null
      }
    })

  } catch (error) {
    console.error('Create order error:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande'
    })
  }
}

export default withAuth(handler)