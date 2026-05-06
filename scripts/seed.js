// scripts/seed.js
// Populates the database with sample products and creates the default admin user.
// Run once:  npm run seed

import 'dotenv/config'
import mongoose from 'mongoose'
import Product from '../src/models/Product.js'
import User from '../src/models/User.js'

const sampleProducts = [
  {
    name: 'Ekşi Mayalı Köy Ekmeği',
    description: 'Doğal ekşi maya ile 24 saat mayalanan, çıtır kabuklu, yumuşak iç yapılı köy ekmeği.',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    category: 'Ekmek',
    badge: 'Çok Satan',
    stars: 5,
    sortOrder: 1,
  },
  {
    name: 'Tam Buğday Somun',
    description: 'Kepekli un ile pişirilen, lifli ve besleyici tam buğday somun.',
    price: 38,
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80',
    category: 'Ekmek',
    stars: 4,
    sortOrder: 2,
  },
  {
    name: 'Cevizli Çavdar Ekmeği',
    description: 'Çavdar unu ve iri ceviz parçaları ile hazırlanan aromalı ekmek.',
    price: 52,
    imageUrl: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?w=600&q=80',
    category: 'Ekmek',
    stars: 5,
    sortOrder: 3,
  },
  {
    name: 'Zeytinli Focaccia',
    description: 'Yerli zeytinyağı ve sele zeytin ile hazırlanan İtalyan usulü focaccia.',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=600&q=80',
    category: 'Ekmek',
    badge: 'Yeni',
    stars: 4,
    sortOrder: 4,
  },
  {
    name: 'Su Böreği',
    description: 'Bol beyaz peynir ile kat kat açılan, el yapımı su böreği. Tepsisi ile sipariş edilir.',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
    category: 'Börek',
    badge: 'Çok Satan',
    stars: 5,
    sortOrder: 5,
  },
  {
    name: 'Ispanaklı Gözleme',
    description: 'Taze ıspanak ve tulum peyniri ile hazırlanan ince hamurlu gözleme.',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&q=80',
    category: 'Börek',
    stars: 4,
    sortOrder: 6,
  },
  {
    name: 'Kıymalı Poğaça',
    description: 'İç harçlı, altın rengi kıymalı poğaça. Her sabah saat 07:00\'de fırından çıkar.',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80',
    category: 'Börek',
    stars: 5,
    sortOrder: 7,
  },
  {
    name: 'Peynirli Açma',
    description: 'Yumuşacık hamuru ve bol peyniri ile kahvaltının vazgeçilmezi.',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&q=80',
    category: 'Börek',
    stars: 4,
    sortOrder: 8,
  },
  {
    name: 'Çikolatalı Truffle Pasta',
    description: 'Bitter çikolata ganajı ve fındıklı iç katmanlardan oluşan butik pasta.',
    price: 320,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    category: 'Pastane',
    badge: 'Özel',
    stars: 5,
    sortOrder: 9,
  },
  {
    name: 'Limonlu Cheesecake',
    description: 'Taze limon kabuğu rendesi ve İtalyan kreması ile hazırlanan klasik cheesecake.',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    category: 'Pastane',
    stars: 5,
    sortOrder: 10,
  },
  {
    name: 'Krokan Kurabiye',
    description: 'Tereyağı ve kahverengi şeker ile yapılan gevrek, aromalı krokan kurabiyeler.',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80',
    category: 'Pastane',
    stars: 4,
    sortOrder: 11,
  },
  {
    name: 'Frambuazlı Tart',
    description: 'Taze frambuaz ve vanilyalı krem patisye ile doldurulmuş kıtır tart.',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=600&q=80',
    category: 'Pastane',
    badge: 'Yeni',
    stars: 5,
    sortOrder: 12,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // ── Seed products ──────────────────────────────────────────────────────
    await Product.deleteMany({})
    const products = await Product.insertMany(sampleProducts)
    console.log(`🥖 Inserted ${products.length} products`)

    // ── Seed admin user ────────────────────────────────────────────────────
    await User.deleteMany({})
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@altinfirin.com',
      password: process.env.ADMIN_PASSWORD || 'Admin1234!',
      role: 'admin',
    })
    console.log(`👤 Admin created: ${process.env.ADMIN_EMAIL || 'admin@altinfirin.com'}`)
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin1234!'}`)

    console.log('\n✨ Seed complete!')
  } catch (error) {
    console.error('❌ Seed error:', error)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
