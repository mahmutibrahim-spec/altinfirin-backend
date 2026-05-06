// src/models/User.js
// Admin user model — stores hashed passwords, issues JWT tokens.

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'İsim zorunludur'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'E-posta zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta girin'],
    },

    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [8, 'Şifre en az 8 karakter olmalıdır'],
      // Never return the password field in query results by default
      select: false,
    },

    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  { timestamps: true }
)

// ── Pre-save hook: hash the password before storing ──────────────────────────
userSchema.pre('save', async function (next) {
  // Only re-hash if the password field was actually modified
  if (!this.isModified('password')) return next()

  const saltRounds = 12
  this.password = await bcrypt.hash(this.password, saltRounds)
  next()
})

// ── Instance method: compare a plain-text password with the stored hash ──────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
