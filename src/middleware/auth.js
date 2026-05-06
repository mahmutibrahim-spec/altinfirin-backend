// src/middleware/auth.js
// Protects routes that require a valid admin JWT token.

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * protect — middleware that verifies the JWT in the Authorization header.
 * Attach the authenticated user to req.user on success.
 * Usage:  router.post('/products', protect, createProduct)
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token from "Authorization: Bearer <token>" header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Yetkilendirme token\'ı bulunamadı' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify the token signature and expiry
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      const msg =
        err.name === 'TokenExpiredError'
          ? 'Token süresi doldu, lütfen tekrar giriş yapın'
          : 'Geçersiz token'
      return res.status(401).json({ success: false, message: msg })
    }

    // 3. Make sure the user still exists in the DB
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Bu token\'a sahip kullanıcı bulunamadı' })
    }

    // 4. Attach user to request and continue
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ success: false, message: 'Sunucu hatası' })
  }
}

/**
 * generateToken — creates a signed JWT for a given user ID.
 * Called after successful login.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}
