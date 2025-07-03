import { prisma } from '../../../lib/prisma'
import { verifyPassword, generateToken } from '../../../lib/auth'
import { loginSchema } from '../../../lib/validations/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Méthode non autorisée' 
    })
  }

  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Generate token
    const token = generateToken(user.id)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: userWithoutPassword,
        token
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    })
  }
}