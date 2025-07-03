import { prisma } from '../../../lib/prisma'
import { hashPassword, generateToken } from '../../../lib/auth'
import { registerSchema } from '../../../lib/validations/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Méthode non autorisée' 
    })
  }

  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body)
    const { firstName, lastName, email, password } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user,
        token
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du compte'
    })
  }
}