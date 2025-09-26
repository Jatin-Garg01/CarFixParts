const express = require('express');
const prisma = require('../lib/prisma');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth and adminAuth middleware to all routes
router.use(auth, adminAuth);

// @route   GET /api/admin/pending-shopkeepers
// @desc    Get all pending shopkeeper requests
// @access  Private (Admin only)
router.get('/pending-shopkeepers', async (req, res) => {
  try {
    const pending = await prisma.user.findMany({
      where: { role: 'shopkeeper', status: 'pending' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, status: true,
        shopkeeperProfile: { select: { shopName: true, city: true, state: true } }
      }
    });
    // Normalize to previous shape keys
    const result = pending.map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      status: u.status,
      shopDetails: u.shopkeeperProfile || null
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/approve-shopkeeper/:id
// @desc    Approve or reject shopkeeper
// @access  Private (Admin only)
router.put('/approve-shopkeeper/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const shopkeeper = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    if (shopkeeper.role !== 'shopkeeper') {
      return res.status(400).json({ message: 'User is not a shopkeeper' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: {
        id: true, name: true, email: true, status: true,
        shopkeeperProfile: { select: { shopName: true, address: true, city: true, state: true, pincode: true } }
      }
    });

    res.json({
      message: `Shopkeeper ${status} successfully`,
      shopkeeper: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        status: updated.status,
        shopDetails: updated.shopkeeperProfile
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/all-shopkeepers
// @desc    Get all shopkeepers with their status
// @access  Private (Admin only)
router.get('/all-shopkeepers', async (req, res) => {
  try {
    const shopkeepers = await prisma.user.findMany({
      where: { role: 'shopkeeper' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, status: true,
        shopkeeperProfile: { select: { shopName: true, city: true, state: true } }
      }
    });
    const result = shopkeepers.map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      status: u.status,
      shopDetails: u.shopkeeperProfile
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/all-parts
// @desc    Get all parts from all shopkeepers
// @access  Private (Admin only)
router.get('/all-parts', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, company, model, category, shopkeeper } = req.query;
    
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        company ? { carCompanyId: company } : {},
        model ? { carModelId: model } : {},
        category ? { categoryId: category } : {},
        shopkeeper ? { shopkeeperId: shopkeeper } : {},
      ]
    };

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [items, total] = await Promise.all([
      prisma.part.findMany({
        where,
        include: {
          carCompany: { select: { name: true } },
          carModel: { select: { name: true, year: true } },
          category: { select: { name: true } },
          shopkeeper: { select: { id: true, name: true, email: true, shopkeeperProfile: true } },
          images: { select: { url: true } }
        },
        orderBy: { createdAt: 'desc' },
        take, skip
      }),
      prisma.part.count({ where })
    ]);

    const parts = items.map(p => ({
      _id: p.id,
      name: p.name,
      description: p.description,
      sellingPrice: p.sellingPrice,
      purchasedPrice: p.purchasedPrice,
      condition: p.condition,
      availability: p.availability,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year },
      category: { name: p.category.name },
      shopkeeper: {
        id: p.shopkeeper.id,
        name: p.shopkeeper.name,
        email: p.shopkeeper.email,
        shopDetails: p.shopkeeper.shopkeeperProfile || null
      }
    }));

    res.json({
      parts,
      totalPages: Math.ceil(total / take),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/dashboard-stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [totalShopkeepers, pendingShopkeepers, approvedShopkeepers, totalParts, availableParts, soldParts, totalCustomers] = await Promise.all([
      prisma.user.count({ where: { role: 'shopkeeper' } }),
      prisma.user.count({ where: { role: 'shopkeeper', status: 'pending' } }),
      prisma.user.count({ where: { role: 'shopkeeper', status: 'approved' } }),
      prisma.part.count(),
      prisma.part.count({ where: { availability: 'available' } }),
      prisma.part.count({ where: { availability: 'sold' } }),
      prisma.user.count({ where: { role: 'customer' } })
    ]);

    res.json({
      shopkeepers: {
        total: totalShopkeepers,
        pending: pendingShopkeepers,
        approved: approvedShopkeepers
      },
      parts: {
        total: totalParts,
        available: availableParts,
        sold: soldParts
      },
      customers: totalCustomers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/car-companies
// @desc    Add new car company
// @access  Private (Admin only)
router.post('/car-companies', async (req, res) => {
  try {
    const { name, logo } = req.body;
    const existingCompany = await prisma.carCompany.findUnique({ where: { name } });
    if (existingCompany) return res.status(400).json({ message: 'Car company already exists' });
    const company = await prisma.carCompany.create({ data: { name, logo } });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/car-models
// @desc    Add new car model
// @access  Private (Admin only)
router.post('/car-models', async (req, res) => {
  try {
    const { name, company, year, variant } = req.body;
    const carModel = await prisma.carModel.create({ data: { name, year: Number(year), variant, companyId: company } });
    const populated = await prisma.carModel.findUnique({ where: { id: carModel.id }, include: { company: { select: { name: true } } } });
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/part-categories
// @desc    Add new part category
// @access  Private (Admin only)
router.post('/part-categories', async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await prisma.partCategory.findUnique({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Part category already exists' });
    const category = await prisma.partCategory.create({ data: { name, description } });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/shopkeeper/:id
// @desc    Get shopkeeper details and their parts
// @access  Private (Admin only)
router.get('/shopkeeper/:id', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        shopkeeperProfile: { select: { shopName: true, address: true, city: true, state: true, pincode: true } }
      }
    });
    if (!user || user.role !== 'shopkeeper') {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    const [items, total] = await Promise.all([
      prisma.part.findMany({
        where: { shopkeeperId: req.params.id },
        include: {
          carCompany: { select: { name: true } },
          carModel: { select: { name: true, year: true } },
          category: { select: { name: true } },
          images: { select: { url: true } }
        },
        orderBy: { createdAt: 'desc' },
        take, skip
      }),
      prisma.part.count({ where: { shopkeeperId: req.params.id } })
    ]);

    const parts = items.map(p => ({
      _id: p.id,
      name: p.name,
      description: p.description,
      sellingPrice: p.sellingPrice,
      purchasedPrice: p.purchasedPrice,
      condition: p.condition,
      availability: p.availability,
      images: p.images.map(i => i.url),
      carCompany: { name: p.carCompany.name },
      carModel: { name: p.carModel.name, year: p.carModel.year },
      category: { name: p.category.name }
    }));

    res.json({
      shopkeeper: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        shopDetails: user.shopkeeperProfile
      },
      parts,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
