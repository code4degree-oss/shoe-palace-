const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Check if categories exist
  let runningCategory = await prisma.category.findUnique({ where: { slug: 'running' } })
  if (!runningCategory) {
    runningCategory = await prisma.category.create({
      data: { name: 'Running', slug: 'running', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop' }
    })
  }

  let casualCategory = await prisma.category.findUnique({ where: { slug: 'casual' } })
  if (!casualCategory) {
    casualCategory = await prisma.category.create({
      data: { name: 'Casual', slug: 'casual', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop' }
    })
  }

  // Check if products exist
  const existingProducts = await prisma.product.count()
  
  if (existingProducts === 0) {
    console.log('Seeding products...')
    
    await prisma.product.create({
      data: {
        name: 'AeroGlide Pro Running Shoes',
        slug: 'aeroglide-pro-running-shoes',
        description: 'Experience weightless running with our ultra-responsive AeroGlide Pro. Designed for marathon runners seeking maximum energy return.',
        price: 8999,
        salePrice: 6999,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop'
        ],
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['Red', 'Black', 'Neon'],
        weightGrams: 300,
        displayWeight: 300,
        weightUnit: 'g',
        shippingWeightGrams: 800,
        stock: 50,
        sku: 'AERO-PRO-01',
        badge: 'Best Seller',
        categoryId: runningCategory.id,
        howToUse: 'Wear with athletic socks. Ideal for road running.',
        ingredients: 'Mesh upper, EVA foam midsole, Rubber outsole',
        position: 1
      }
    })

    await prisma.product.create({
      data: {
        name: 'StreetStyle Classic High-Top',
        slug: 'streetstyle-classic-high-top',
        description: 'A timeless high-top design that pairs perfectly with any casual outfit. Features premium canvas and comfortable cushioning.',
        price: 4999,
        salePrice: 3499,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop'
        ],
        sizes: ['6', '7', '8', '9'],
        colors: ['Yellow', 'White', 'Black'],
        weightGrams: 400,
        displayWeight: 400,
        weightUnit: 'g',
        shippingWeightGrams: 900,
        stock: 120,
        sku: 'SS-HIGH-02',
        badge: 'New Arrival',
        categoryId: casualCategory.id,
        position: 2
      }
    })

    await prisma.product.create({
      data: {
        name: 'CloudWalk Everyday Sneakers',
        slug: 'cloudwalk-everyday-sneakers',
        description: 'Your perfect daily companion. Slip into comfort with memory foam insoles and a sleek minimalist design.',
        price: 3999,
        salePrice: 2999,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
        images: [],
        sizes: ['8', '9', '10', '11', '12'],
        colors: ['White', 'Grey'],
        weightGrams: 350,
        displayWeight: 350,
        weightUnit: 'g',
        shippingWeightGrams: 850,
        stock: 80,
        sku: 'CW-SNEAK-03',
        badge: 'Trending',
        categoryId: casualCategory.id,
        position: 3
      }
    })
    
    console.log('Products seeded successfully!')
  } else {
    console.log('Database already seeded.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
