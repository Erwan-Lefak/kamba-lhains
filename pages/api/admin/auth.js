import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory rate limiting (TODO: move to Redis for production)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Audit log function
async function logAdminActivity(email, action, success, ip, userAgent) {
  try {
    console.log('[ADMIN AUDIT]', {
      timestamp: new Date().toISOString(),
      email,
      action,
      success,
      ip,
      userAgent: userAgent?.substring(0, 100)
    });

    // Store in database for persistent audit trail
    // Note: You should create an AdminAuditLog model in Prisma schema
    // await prisma.adminAuditLog.create({
    //   data: { email, action, success, ip, userAgent }
    // });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

// Check rate limiting
function checkRateLimit(identifier) {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  // Filter out old attempts
  const recentAttempts = attempts.filter(time => now - time < LOCKOUT_DURATION);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const oldestAttempt = Math.min(...recentAttempts);
    const unlockTime = oldestAttempt + LOCKOUT_DURATION;
    const remainingTime = Math.ceil((unlockTime - now) / 1000 / 60);

    return {
      allowed: false,
      remaining: 0,
      message: `Too many failed attempts. Try again in ${remainingTime} minutes.`
    };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - recentAttempts.length - 1 };
}

// Record failed attempt
function recordFailedAttempt(identifier) {
  const attempts = loginAttempts.get(identifier) || [];
  attempts.push(Date.now());
  loginAttempts.set(identifier, attempts);
}

// Clear attempts on successful login
function clearAttempts(identifier) {
  loginAttempts.delete(identifier);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  // Input validation
  if (!email || !password) {
    await logAdminActivity(email, 'LOGIN_ATTEMPT', false, ip, userAgent);
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Check rate limiting
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    await logAdminActivity(email, 'LOGIN_RATE_LIMITED', false, ip, userAgent);
    return res.status(429).json({
      success: false,
      message: rateLimit.message
    });
  }

  try {
    // Get admin from database
    const admin = await prisma.user.findFirst({
      where: {
        email: email,
        role: 'ADMIN', // Assuming you have a role field
        status: 'ACTIVE'
      }
    });

    if (!admin || !admin.passwordHash) {
      recordFailedAttempt(ip);
      await logAdminActivity(email, 'LOGIN_FAILED', false, ip, userAgent);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        remaining: rateLimit.remaining
      });
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      recordFailedAttempt(ip);
      await logAdminActivity(email, 'LOGIN_FAILED', false, ip, userAgent);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        remaining: rateLimit.remaining
      });
    }

    // Check if 2FA is enabled (future enhancement)
    if (admin.twoFactorEnabled) {
      // Return a flag indicating 2FA is required
      await logAdminActivity(email, 'LOGIN_2FA_REQUIRED', true, ip, userAgent);
      return res.status(200).json({
        success: true,
        requiresTwoFactor: true,
        userId: admin.id
      });
    }

    // Successful login
    clearAttempts(ip);
    await logAdminActivity(email, 'LOGIN_SUCCESS', true, ip, userAgent);

    // Update last login time
    await prisma.user.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    await logAdminActivity(email, 'LOGIN_ERROR', false, ip, userAgent);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
