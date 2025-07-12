const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Database query successful! Found ${userCount} users.`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('SCRAM failure')) {
      console.error('\n🔍 SCRAM authentication failure suggests:');
      console.error('1. Incorrect username or password');
      console.error('2. Database user doesn\'t exist');
      console.error('3. User doesn\'t have proper permissions');
      console.error('4. Network connectivity issues');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
