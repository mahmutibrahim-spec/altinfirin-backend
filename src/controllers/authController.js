// src/controllers/authController.js
// Handles admin login and returns a JWT.

import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Basic input validation
    if (!email || !password) {
      res.status(400)
      throw new Error('E-posta ve şifre zorunludur')
    }

    // Find the user — explicitly select the password field (it's hidden by default)
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      res.status(401)
      throw new Error('Geçersiz e-posta veya şifre')
    }

    // Compare the provided password with the stored hash
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401)
      throw new Error('Geçersiz e-posta veya şifre')
    }

    // Sign a JWT
    const token = generateToken(user._id)

    // Return token + safe user object (no password)
    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/auth/me  (protected) ───────────────────────────────────────────
// Returns the currently authenticated admin's profile.
export const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  })
}
