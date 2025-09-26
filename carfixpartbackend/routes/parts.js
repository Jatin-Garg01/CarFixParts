const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// @route   GET /api/parts/car-companies
// @desc    Get all car companies
// @access  Public
router.get('/car-companies', async (req, res) => {
  try {
    const companies = await prisma.carCompany.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/parts/car-models/:companyId
// @desc    Get car models by company
// @access  Public
router.get('/car-models/:companyId', async (req, res) => {
  try {
    const models = await prisma.carModel.findMany({
      where: { companyId: req.params.companyId, isActive: true },
      include: { company: { select: { name: true } } },
      orderBy: [{ name: 'asc' }, { year: 'desc' }]
    });
    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/parts/categories
// @desc    Get all part categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.partCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/parts/search-suggestions
// @desc    Get search suggestions based on query
// @access  Public
router.get('/search-suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    const [companies, models, categories] = await Promise.all([
      prisma.carCompany.findMany({
        where: { isActive: true, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true },
        take: 5
      }),
      prisma.carModel.findMany({
        where: { isActive: true, name: { contains: q, mode: 'insensitive' } },
        include: { company: { select: { name: true } } },
        select: { id: true, name: true, company: true },
        take: 5
      }),
      prisma.partCategory.findMany({
        where: { isActive: true, name: { contains: q, mode: 'insensitive' } },
        select: { id: true, name: true },
        take: 5
      })
    ]);

    const suggestions = [
      ...companies.map(c => ({ type: 'company', name: c.name, id: c.id })),
      ...models.map(m => ({ type: 'model', name: `${m.name} (${m.company.name})`, id: m.id })),
      ...categories.map(c => ({ type: 'category', name: c.name, id: c.id }))
    ];

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
