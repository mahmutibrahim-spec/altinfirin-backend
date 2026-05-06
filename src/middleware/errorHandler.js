// src/middleware/errorHandler.js
// Centralised error handler — catches errors thrown anywhere in route handlers.

/**
 * notFound — 404 handler for unmatched routes.
 * Mount this AFTER all routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route bulunamadı: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

/**
 * errorHandler — global error handler.
 * Express identifies a 4-argument middleware as an error handler.
 */
export const errorHandler = (err, req, res, next) => {
  // Mongoose cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz ID formatı',
    })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    })
  }

  // Mongoose duplicate key (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({
      success: false,
      message: `Bu ${field} zaten kayıtlı`,
    })
  }

  // Default error response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Sunucu hatası',
    // Only expose stack traces in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
