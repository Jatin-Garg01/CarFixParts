const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const CarCompany = require('../models/CarCompany');
const CarModel = require('../models/CarModel');
const PartCategory = require('../models/PartCategory');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      CarCompany.deleteMany({}),
      CarModel.deleteMany({}),
      PartCategory.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@carfixparts.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create car companies
    const companies = [
      { name: 'Maruti Suzuki' },
      { name: 'Hyundai' },
      { name: 'Tata Motors' },
      { name: 'Mahindra' },
      { name: 'Honda' },
      { name: 'Toyota' },
      { name: 'Ford' },
      { name: 'Volkswagen' },
      { name: 'Skoda' },
      { name: 'Nissan' }
    ];

    const createdCompanies = await CarCompany.insertMany(companies);
    console.log('Car companies created');

    // Create car models
    const models = [];
    
    // Maruti Suzuki models
    const maruti = createdCompanies.find(c => c.name === 'Maruti Suzuki');
    models.push(
      { name: 'Swift', company: maruti._id, year: 2023 },
      { name: 'Baleno', company: maruti._id, year: 2023 },
      { name: 'Alto', company: maruti._id, year: 2023 },
      { name: 'Wagon R', company: maruti._id, year: 2023 },
      { name: 'Vitara Brezza', company: maruti._id, year: 2023 },
      { name: 'Dzire', company: maruti._id, year: 2023 }
    );

    // Hyundai models
    const hyundai = createdCompanies.find(c => c.name === 'Hyundai');
    models.push(
      { name: 'i20', company: hyundai._id, year: 2023 },
      { name: 'Creta', company: hyundai._id, year: 2023 },
      { name: 'Verna', company: hyundai._id, year: 2023 },
      { name: 'Grand i10', company: hyundai._id, year: 2023 },
      { name: 'Venue', company: hyundai._id, year: 2023 }
    );

    // Tata models
    const tata = createdCompanies.find(c => c.name === 'Tata Motors');
    models.push(
      { name: 'Nexon', company: tata._id, year: 2023 },
      { name: 'Harrier', company: tata._id, year: 2023 },
      { name: 'Safari', company: tata._id, year: 2023 },
      { name: 'Altroz', company: tata._id, year: 2023 },
      { name: 'Punch', company: tata._id, year: 2023 }
    );

    // Honda models
    const honda = createdCompanies.find(c => c.name === 'Honda');
    models.push(
      { name: 'City', company: honda._id, year: 2023 },
      { name: 'Amaze', company: honda._id, year: 2023 },
      { name: 'WR-V', company: honda._id, year: 2023 },
      { name: 'Jazz', company: honda._id, year: 2023 }
    );

    await CarModel.insertMany(models);
    console.log('Car models created');

    // Create part categories
    const categories = [
      { name: 'Mirror', description: 'Side mirrors, rear view mirrors' },
      { name: 'Window', description: 'Door windows, windshield, rear window' },
      { name: 'Bonnet', description: 'Car hood/bonnet' },
      { name: 'Body Shell', description: 'Car body panels and shell' },
      { name: 'Bumper', description: 'Front and rear bumpers' },
      { name: 'Door', description: 'Car doors and door panels' },
      { name: 'Headlight', description: 'Front headlights and assemblies' },
      { name: 'Taillight', description: 'Rear taillights and assemblies' },
      { name: 'Fender', description: 'Front and rear fenders' },
      { name: 'Grille', description: 'Front grilles' },
      { name: 'Spoiler', description: 'Rear spoilers and wings' },
      { name: 'Roof', description: 'Roof panels and sunroofs' },
      { name: 'Engine Parts', description: 'Engine components and parts' },
      { name: 'Suspension', description: 'Suspension components' },
      { name: 'Brake Parts', description: 'Brake components and parts' },
      { name: 'Interior', description: 'Interior parts and accessories' },
      { name: 'Electrical', description: 'Electrical components and wiring' },
      { name: 'Exhaust', description: 'Exhaust system components' },
      { name: 'Transmission', description: 'Transmission parts' },
      { name: 'Wheels & Tires', description: 'Wheels, rims, and tires' }
    ];

    await PartCategory.insertMany(categories);
    console.log('Part categories created');

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@carfixparts.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
