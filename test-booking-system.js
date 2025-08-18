// Test script to verify booking system is working
// Run this with: node test-booking-system.js

const TEST_USER_ID = "64d0b6a4c0f1564d5ecbf91e"; // Any 24-char hex ObjectId string works
let createdMachineId = null;
let createdBookingId = null;

const testMachineData = {
  name: "Test John Deere Tractor",
  category: "Tractor",
  hourlyRate: 800,
  dailyRate: 6000,
  location: "Test Farm Equipment Center",
  description: "A high-quality test tractor for agricultural operations",
  features: ["GPS Navigation", "Climate Control", "Advanced Hydraulics"],
  image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  available: true,
  rating: 4.5,
  stock: 2,
};

function getTestBooking(machineId) {
  return {
    userId: TEST_USER_ID,
    machineId: machineId,
    quantity: 1,
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    duration: 24,
    durationType: "hours",
    distance: 500,
    basePrice: 800,
    distancePrice: 500,
    totalPrice: 1300,
    deliveryAddress: "123 Test Farm, Karkala, Karnataka",
    contactNumber: "9876543210",
    specialRequirements: "Please deliver in the morning",
    equipmentId: machineId,
    equipmentName: "Test John Deere Tractor",
  };
}

async function testBookingSystem() {
  try {
    console.log('🧪 Testing Booking System...\n');
    
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch('http://localhost:3000/health');
         if (healthResponse.ok) {
       const healthData = await healthResponse.json();
       console.log('✅ Server is running');
       console.log('   Database connected:', healthData.dbConnected);
       console.log('   Status:', healthData.status);
       console.log('   🔒 Connection details hidden for security');
     } else {
      console.log('❌ Server health check failed');
      return;
    }
    
    // Test 2: Test database connection
    console.log('\n2️⃣ Testing database connection...');
    const dbResponse = await fetch('http://localhost:3000/test-db');
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log('✅ Database connection working');
      console.log('   Status:', dbData.status);
    } else {
      console.log('❌ Database test failed');
    }
    
    // Ensure test machine exists
    console.log('\n3️⃣ Creating test machine...');
    const machineResponse = await fetch('http://localhost:3000/api/machines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMachineData)
    });
    if (!machineResponse.ok) {
      const err = await machineResponse.text();
      console.log('❌ Machine creation failed');
      console.log('   Status:', machineResponse.status);
      console.log('   Error:', err);
      return;
    }
    const machineData = await machineResponse.json();
    createdMachineId = machineData._id;

    // Test 3: Create a test booking
    console.log('\n3️⃣ Testing booking creation...');
    const bookingResponse = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getTestBooking(createdMachineId))
    });
    
    if (bookingResponse.ok) {
      const bookingData = await bookingResponse.json();
      createdBookingId = bookingData._id;
      console.log('✅ Booking created successfully!');
      console.log('   Booking ID:', bookingData._id);
      console.log('   Equipment:', bookingData.equipmentName);
      console.log('   Status:', bookingData.status);
      
      // Test 4: Fetch the created booking
      console.log('\n4️⃣ Testing booking retrieval...');
      const fetchResponse = await fetch(`http://localhost:3000/api/bookings/${bookingData._id}`);
      if (fetchResponse.ok) {
        const fetchedBooking = await fetchResponse.json();
        console.log('✅ Booking retrieved successfully');
        console.log('   Equipment Name:', fetchedBooking.equipmentName);
        console.log('   Total Price:', fetchedBooking.totalPrice);
      }
      
      // Test 5: Clean up test booking
      console.log('\n5️⃣ Cleaning up test data...');
      const deleteResponse = await fetch(`http://localhost:3000/api/bookings/${bookingData._id}`, {
        method: 'DELETE'
      });
      if (deleteResponse.ok) {
        console.log('✅ Test booking cleaned up successfully');
      }
      if (createdMachineId) {
        await fetch(`http://localhost:3000/api/machines/${createdMachineId}`, { method: 'DELETE' });
        console.log('✅ Test machine cleaned up successfully');
      }
      
    } else {
      const errorText = await bookingResponse.text();
      console.log('❌ Booking creation failed');
      console.log('   Status:', bookingResponse.status);
      console.log('   Error:', errorText);
    }
    
    console.log('\n🎉 Booking system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔍 Make sure your server is running: npm start');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.error('Install node-fetch: npm install node-fetch');
  process.exit(1);
}

console.log('🚀 Starting Booking System Test...\n');
testBookingSystem();
