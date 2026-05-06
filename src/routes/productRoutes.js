// src/routes/productRoutes.js
// Maps HTTP verbs + paths to controller functions.
// Protected routes require a valid admin JWT (via the `protect` middleware).

import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// ── Public routes ──────────────────────────────────────────────────────────
//  GET /api/products          — list all active products (+ ?category= filter)
//  GET /api/products/:id      — single product detail
router.get('/', getProducts)
router.get('/:id', getProduct)

// ── Protected routes (admin JWT required) ─────────────────────────────────
//  POST   /api/products        — create product
//  PUT    /api/products/:id    — update product
//  DELETE /api/products/:id    — delete product
router.post('/', protect, createProduct)
router.put('/:id', protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

export default router
