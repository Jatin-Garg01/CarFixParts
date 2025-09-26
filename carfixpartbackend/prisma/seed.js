const { PrismaClient, Role, Status, Condition } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PostgreSQL via Prisma...');

  // Clean tables in order (respecting FKs)
  await prisma.partImage.deleteMany();
  await prisma.part.deleteMany();
  await prisma.partCategory.deleteMany();
  await prisma.carModel.deleteMany();
  await prisma.carCompany.deleteMany();
  await prisma.shopkeeperProfile.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@carfixparts.com',
      password: await bcrypt.hash('admin123', 10),
      phone: '9999999999',
      role: Role.admin,
      status: Status.approved,
    },
  });

  // Car companies
  const companyNames = [
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Honda',
    'Toyota', 'Ford', 'Volkswagen', 'Skoda', 'Nissan'
  ];
  const companies = await Promise.all(
    companyNames.map((name) => prisma.carCompany.create({ data: { name } }))
  );

  // Models
  const getCompany = (n) => companies.find((c) => c.name === n);
  const modelsData = [
    // Maruti Suzuki
    { name: 'Swift', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    { name: 'Baleno', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    { name: 'Alto', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    { name: 'Wagon R', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    { name: 'Vitara Brezza', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    { name: 'Dzire', year: 2023, companyId: getCompany('Maruti Suzuki').id },
    // Hyundai
    { name: 'i20', year: 2023, companyId: getCompany('Hyundai').id },
    { name: 'Creta', year: 2023, companyId: getCompany('Hyundai').id },
    { name: 'Verna', year: 2023, companyId: getCompany('Hyundai').id },
    { name: 'Grand i10', year: 2023, companyId: getCompany('Hyundai').id },
    { name: 'Venue', year: 2023, companyId: getCompany('Hyundai').id },
    // Tata
    { name: 'Nexon', year: 2023, companyId: getCompany('Tata Motors').id },
    { name: 'Harrier', year: 2023, companyId: getCompany('Tata Motors').id },
    { name: 'Safari', year: 2023, companyId: getCompany('Tata Motors').id },
    { name: 'Altroz', year: 2023, companyId: getCompany('Tata Motors').id },
    { name: 'Punch', year: 2023, companyId: getCompany('Tata Motors').id },
    // Honda
    { name: 'City', year: 2023, companyId: getCompany('Honda').id },
    { name: 'Amaze', year: 2023, companyId: getCompany('Honda').id },
    { name: 'WR-V', year: 2023, companyId: getCompany('Honda').id },
    { name: 'Jazz', year: 2023, companyId: getCompany('Honda').id },
  ];

  // Mahindra models (multiple years for car selection)
  const mahindra = getCompany('Mahindra');
  if (mahindra) {
    const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const years0507 = range(2005, 2007);
    const years0825 = range(2008, 2025);
    const years = [...years0507, ...years0825];
    const mahindraModels = [];
    const names = ['Scorpio', 'Bolero', 'XUV500', 'XUV700', 'Thar', 'KUV100', 'TUV300'];
    names.forEach(name => {
      years.forEach(y => mahindraModels.push({ name, year: y, companyId: mahindra.id }));
    });
    modelsData.push(...mahindraModels);
  }
  await prisma.carModel.createMany({ data: modelsData });

  // Part categories
  const categories = [
    'Mirror','Window','Bonnet','Body Shell','Bumper','Door','Headlight','Taillight','Fender','Grille','Spoiler','Roof','Engine Parts','Suspension','Brake Parts','Interior','Electrical','Exhaust','Transmission','Wheels & Tires'
  ];
  await prisma.partCategory.createMany({ data: categories.map((name) => ({ name })) });

  console.log('Seeded successfully. Admin: admin@carfixparts.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
