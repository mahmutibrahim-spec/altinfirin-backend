// src/routes/authRoutes.js

import { Router } from 'express'
import { login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/login  — exchange credentials for a JWT
router.post('/login', login)

// GET  /api/auth/me     — return current user (protected)
router.get('/me', protect, getMe)

export default router
