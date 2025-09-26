const express = require('express');
const prisma = require('../lib/prisma');
const { auth, customerAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth and customerAuth middleware to all routes
router.use(auth, customerAuth);

// @route   GET /api/customer/search-parts
router.get('/search-parts', async (req, res) => {
  try {
    const { 
      page = 1, limit = 12, search, company, model, category, condition,
      minPrice, maxPrice, city, state, sortBy = 'createdAt', sortOrder = 'desc'
    } = req.query;

    const where = {
      availability: 'available',
      AND: [
        search ? { OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ] } : {},
        company ? { carCompanyId: company } : {},
        model ? { carModelId: model } : {},
        category ? { categoryId: category } : {},
        condition ? { condition } : {},
        minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
        maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
        city ? { locationCity: { contains: city, mode: 'insensitive' } } : {},
        state ? { locationState: { contains: state, mode: 'insensitive' } } : {},
      ]
    };

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;
    const orderBy = { [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc' };

    const [items, total] = await Promise.all([
      prisma.part.findMany({
        where,
        include: {
          carCompany: { select: { name: true } },
          carModel: { select: { name: true, year: true, variant: true } },
          category: { select: { name: true, description: true } },
          shopkeeper: { select: { name: true, shopkeeperProfile: true } },
          images: { select: { url: true } }
        },
        orderBy,
        take, skip
      }),
      prisma.part.count({ where })
    ]);

    const parts = items.map(p => ({
      _id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      condition: p.condition,
      availability: p.availability,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year, variant: p.carModel.variant },
      category: { name: p.category.name },
      shopkeeper: { name: p.shopkeeper.name, shopDetails: p.shopkeeper.shopkeeperProfile || null }
    }));

    res.json({
      parts,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page),
      total,
      hasMore: Number(page) * take < total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customer/part/:id
router.get('/part/:id', async (req, res) => {
  try {
    const p = await prisma.part.findUnique({
      where: { id: req.params.id },
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true, variant: true } },
        category: { select: { name: true, description: true } },
        shopkeeper: { select: { name: true, email: true, phone: true, shopkeeperProfile: true } },
        images: { select: { url: true } }
      }
    });
    if (!p || p.availability !== 'available') return res.status(404).json({ message: 'Part not found' });
    const part = {
      _id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      condition: p.condition,
      availability: p.availability,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year, variant: p.carModel.variant },
      category: { name: p.category.name, description: p.category.description },
      shopkeeper: { name: p.shopkeeper.name, email: p.shopkeeper.email, phone: p.shopkeeper.phone, shopDetails: p.shopkeeper.shopkeeperProfile }
    };
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customer/similar-parts/:id
router.get('/similar-parts/:id', async (req, res) => {
  try {
    const p = await prisma.part.findUnique({ where: { id: req.params.id } });
    if (!p) return res.status(404).json({ message: 'Part not found' });

    const similar = await prisma.part.findMany({
      where: {
        id: { not: p.id },
        availability: 'available',
        OR: [
          { AND: [{ carModelId: p.carModelId }, { categoryId: p.categoryId }] },
          { AND: [{ carCompanyId: p.carCompanyId }, { categoryId: p.categoryId }] },
        ]
      },
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true } },
        category: { select: { name: true } },
        shopkeeper: { select: { name: true, shopkeeperProfile: true } },
        images: { select: { url: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    });

    const parts = similar.map(p => ({
      _id: p.id,
      name: p.name,
      price: p.price,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year },
      category: { name: p.category.name },
      shopkeeper: { name: p.shopkeeper.name, shopDetails: p.shopkeeper.shopkeeperProfile || null }
    }));
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/customer/featured-parts
router.get('/featured-parts', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const items = await prisma.part.findMany({
      where: { availability: 'available' },
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true } },
        category: { select: { name: true } },
        shopkeeper: { select: { name: true, shopkeeperProfile: true } },
        images: { select: { url: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit)
    });
    const parts = items.map(p => ({
      _id: p.id,
      name: p.name,
      price: p.price,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year },
      category: { name: p.category.name },
      shopkeeper: { name: p.shopkeeper.name, shopDetails: p.shopkeeper.shopkeeperProfile || null }
    }));
    res.json(parts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
