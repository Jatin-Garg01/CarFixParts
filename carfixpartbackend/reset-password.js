const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function resetAdminPassword() {
  try {
    console.log('Starting password reset process...');
    
    const newPassword = 'admin01';
    console.log('Generating salt...');
    const salt = await bcrypt.genSalt(10);
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('Updating user in database...');
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@admin01.com' },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully for:', updatedUser.email);
    console.log('New hashed password:', hashedPassword);
  } catch (error) {
    console.error('❌ Error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  } finally {
    console.log('Disconnecting from database...');
    await prisma.$disconnect();
    console.log('Done.');
  }
}

resetAdminPassword().catch(console.error);