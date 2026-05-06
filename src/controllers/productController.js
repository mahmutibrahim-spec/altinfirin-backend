// src/controllers/productController.js
// Business logic for product CRUD operations.
// Each function is an async Express route handler.

import Product from '../models/Product.js'

// ─── GET /api/products ────────────────────────────────────────────────────────
// Returns all active products, optionally filtered by category.
// Query params: ?category=Ekmek  ?includeInactive=true (admin only)
export const getProducts = async (req, res, next) => {
  try {
    const { category, includeInactive } = req.query

    // Build the filter object
    const filter = {}

    // Public routes only show active products
    if (includeInactive !== 'true') {
      filter.isActive = true
    }

    // Category filter (case-sensitive, must match enum values)
    if (category && category !== 'Tümü') {
      filter.category = category
    }

    const products = await Product.find(filter).sort({ sortOrder: 1, createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    next(error)
  }
}

// ─── GET /api/products/:id ────────────────────────────────────────────────────
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error('Ürün bulunamadı')
    }

    res.status(200).json({ success: true, data: product })
  } catch (error) {
    next(error)
  }
}

// ─── POST /api/products  (protected) ─────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category, badge, stars, sortOrder } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      badge,
      stars,
      sortOrder,
    })

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// ─── PUT /api/products/:id  (protected) ──────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category, badge, stars, isActive, sortOrder } =
      req.body

    // findByIdAndUpdate with runValidators ensures schema rules still apply
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl, category, badge, stars, isActive, sortOrder },
      { new: true, runValidators: true }
    )

    if (!product) {
      res.status(404)
      throw new Error('Ürün bulunamadı')
    }

    res.status(200).json({
      success: true,
      message: 'Ürün güncellendi',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// ─── DELETE /api/products/:id  (protected) ───────────────────────────────────
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      res.status(404)
      throw new Error('Ürün bulunamadı')
    }

    res.status(200).json({
      success: true,
      message: 'Ürün silindi',
      data: { id: req.params.id },
    })
  } catch (error) {
    next(error)
  }
}
