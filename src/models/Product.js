// src/models/Product.js
// Defines the Product schema and model for MongoDB.

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
      maxlength: [100, 'Ürün adı 100 karakterden uzun olamaz'],
    },

    description: {
      type: String,
      required: [true, 'Açıklama zorunludur'],
      trim: true,
      maxlength: [500, 'Açıklama 500 karakterden uzun olamaz'],
    },

    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat negatif olamaz'],
    },

    // imageUrl stores either an external URL or a path to an uploaded file
    imageUrl: {
      type: String,
      required: [true, 'Görsel URL zorunludur'],
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Kategori zorunludur'],
      enum: {
        values: ['Ekmek', 'Börek', 'Pastane'],
        message: 'Kategori Ekmek, Börek veya Pastane olmalıdır',
      },
    },

    badge: {
      type: String,
      trim: true,
      maxlength: [30, 'Etiket 30 karakterden uzun olamaz'],
      default: '',
    },

    stars: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Sort order for display on the frontend
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
)

// Index for faster category filtering queries
productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ sortOrder: 1 })

// Virtual: formatted price string (e.g. "₺45")
productSchema.virtual('priceFormatted').get(function () {
  return `₺${this.price}`
})

// Include virtuals when converting to JSON (for API responses)
productSchema.set('toJSON', { virtuals: true })

const Product = mongoose.model('Product', productSchema)

export default Product
