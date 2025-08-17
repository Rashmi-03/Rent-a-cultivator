// Test script to verify machine creation API
// Run this with: node test-machine-creation.js

const testMachineData = {
  name: "Test John Deere Tractor",
  category: "Tractor",
  hourlyRate: 800,
  dailyRate: 6000,
  location: "Test Farm Equipment Center",
  description: "A high-quality test tractor for agricultural operations",
  features: ["GPS Navigation", "Climate Control", "Advanced Hydraulics"],
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  available: true,
  rating: 4.5,
  stock: 2
};

async function testMachineCreation() {
  try {
    console.log('Testing machine creation API...');
    console.log('Machine data:', JSON.stringify(testMachineData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/machines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMachineData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Machine created successfully!');
      console.log('Machine ID:', result._id);
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      const error = await response.text();
      console.error('❌ Failed to create machine');
      console.error('Status:', response.status);
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Error testing machine creation:', error.message);
  }
}

// Test fetching machines
async function testFetchMachines() {
  try {
    console.log('\nTesting machine fetching API...');
    
    const response = await fetch('http://localhost:3000/api/machines');
    
    if (response.ok) {
      const machines = await response.json();
      console.log('✅ Machines fetched successfully!');
      console.log('Total machines:', machines.length);
      if (machines.length > 0) {
        console.log('First machine:', {
          id: machines[0]._id,
          name: machines[0].name,
          category: machines[0].category
        });
      }
    } else {
      const error = await response.text();
      console.error('❌ Failed to fetch machines');
      console.error('Status:', response.status);
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Error testing machine fetching:', error.message);
  }
}

// Test health endpoint
async function testHealth() {
  try {
    console.log('\nTesting health endpoint...');
    
    const response = await fetch('http://localhost:3000/health');
    
    if (response.ok) {
      const health = await response.json();
      console.log('✅ Health check successful!');
      console.log('Status:', health.status);
      console.log('Database connected:', health.dbConnected);
    } else {
      console.error('❌ Health check failed');
      console.error('Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error testing health endpoint:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealth();
  await testMachineCreation();
  await testFetchMachines();
  
  console.log('\n✨ All tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.error('Install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();
