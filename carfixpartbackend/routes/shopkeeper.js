const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/prisma');
const { auth, shopkeeperAuth } = require('../middleware/auth');

const router = express.Router();

// Apply auth and shopkeeperAuth middleware to all routes
router.use(auth, shopkeeperAuth);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/parts');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// @route   GET /api/shopkeeper/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const [totalParts, availableParts, soldParts, reservedParts] = await Promise.all([
      prisma.part.count({ where: { shopkeeperId: userId } }),
      prisma.part.count({ where: { shopkeeperId: userId, availability: 'available' } }),
      prisma.part.count({ where: { shopkeeperId: userId, availability: 'sold' } }),
      prisma.part.count({ where: { shopkeeperId: userId, availability: 'reserved' } }),
    ]);
    res.json({ totalParts, availableParts, soldParts, reservedParts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/shopkeeper/my-parts
router.get('/my-parts', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search, company, model, category, availability } = req.query;

    const where = {
      shopkeeperId: userId,
      AND: [
        search ? { OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ] } : {},
        company ? { carCompanyId: company } : {},
        model ? { carModelId: model } : {},
        category ? { categoryId: category } : {},
        availability ? { availability } : {},
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
      category: { name: p.category.name }
    }));

    res.json({ parts, totalPages: Math.ceil(total / take), currentPage: Number(page), total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shopkeeper/add-part
router.post('/add-part', upload.array('images', 5), async (req, res) => {
  try {
    const user = req.user;
    const {
      name, description, sellingPrice, purchasedPrice, condition,
      carCompany, carModel, category, warranty
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/parts/${file.filename}`) : [];

    const created = await prisma.part.create({
      data: {
        name,
        description: description || null,
        sellingPrice: parseFloat(sellingPrice),
        purchasedPrice: purchasedPrice ? parseFloat(purchasedPrice) : null,
        condition,
        carCompanyId: carCompany,
        carModelId: carModel,
        categoryId: category,
        shopkeeperId: user.id,
        warranty: warranty || null,
        locationCity: user.shopkeeperProfile?.city || null,
        locationState: user.shopkeeperProfile?.state || null,
        locationPincode: user.shopkeeperProfile?.pincode || null,
        contactPhone: user.phone || null,
        contactEmail: user.email || null,
        images: {
          create: images.map(url => ({ url }))
        }
      },
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true } },
        category: { select: { name: true } },
        images: { select: { url: true } }
      }
    });

    const part = {
      _id: created.id,
      name: created.name,
      description: created.description,
      sellingPrice: created.sellingPrice,
      purchasedPrice: created.purchasedPrice,
      condition: created.condition,
      images: created.images.map(i => i.url),
      carCompany: { name: created.carCompany.name },
      carModel: { name: created.carModel.name, year: created.carModel.year },
      category: { name: created.category.name }
    };

    res.status(201).json({ message: 'Part added successfully', part });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shopkeeper/update-part/:id
router.put('/update-part/:id', upload.array('images', 5), async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await prisma.part.findUnique({ where: { id: req.params.id }, select: { shopkeeperId: true } });
    if (!existing) return res.status(404).json({ message: 'Part not found' });
    if (existing.shopkeeperId !== userId) return res.status(403).json({ message: 'Not authorized to update this part' });

    const { name, description, sellingPrice, purchasedPrice, condition, availability, carCompany, carModel, category, warranty } = req.body;
    const newImages = req.files ? req.files.map(file => `/uploads/parts/${file.filename}`) : [];

    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (sellingPrice) data.sellingPrice = parseFloat(sellingPrice);
    if (purchasedPrice) data.purchasedPrice = parseFloat(purchasedPrice);
    if (condition) data.condition = condition;
    if (availability) data.availability = availability;
    if (carCompany) data.carCompanyId = carCompany;
    if (carModel) data.carModelId = carModel;
    if (category) data.categoryId = category;
    if (warranty) data.warranty = warranty;

    const updated = await prisma.part.update({
      where: { id: req.params.id },
      data,
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true } },
        category: { select: { name: true } },
        images: { select: { url: true } }
      }
    });

    if (newImages.length > 0) {
      await prisma.partImage.createMany({ data: newImages.map(url => ({ partId: req.params.id, url })) });
    }

    const refreshed = await prisma.part.findUnique({
      where: { id: req.params.id },
      include: {
        carCompany: { select: { name: true } },
        carModel: { select: { name: true, year: true } },
        category: { select: { name: true } },
        images: { select: { url: true } }
      }
    });

    const part = {
      _id: refreshed.id,
      name: refreshed.name,
      description: refreshed.description,
      sellingPrice: refreshed.sellingPrice,
      purchasedPrice: refreshed.purchasedPrice,
      condition: refreshed.condition,
      availability: refreshed.availability,
      images: refreshed.images.map(i => i.url),
      carCompany: { name: refreshed.carCompany.name },
      carModel: { name: refreshed.carModel.name, year: refreshed.carModel.year },
      category: { name: refreshed.category.name }
    };

    res.json({ message: 'Part updated successfully', part });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/shopkeeper/delete-part/:id
router.delete('/delete-part/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await prisma.part.findUnique({ where: { id: req.params.id }, select: { shopkeeperId: true } });
    if (!existing) return res.status(404).json({ message: 'Part not found' });
    if (existing.shopkeeperId !== userId) return res.status(403).json({ message: 'Not authorized to delete this part' });

    await prisma.part.update({ where: { id: req.params.id }, data: { availability: 'sold' } });
    res.json({ message: 'Part marked as sold successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shopkeeper/mark-sold/:id
router.put('/mark-sold/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await prisma.part.findUnique({ where: { id: req.params.id }, select: { shopkeeperId: true } });
    if (!existing) return res.status(404).json({ message: 'Part not found' });
    if (existing.shopkeeperId !== userId) return res.status(403).json({ message: 'Not authorized to update this part' });

    await prisma.part.update({ where: { id: req.params.id }, data: { availability: 'sold' } });
    res.json({ message: 'Part marked as sold successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
