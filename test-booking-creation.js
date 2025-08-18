// Test script to verify booking creation API
// Run this with: node test-booking-creation.js

const TEST_USER_ID = "64d0b6a4c0f1564d5ecbf91e"; // Any 24-char hex ObjectId string works
let createdMachineId = null;
const createdBookingIds = [];

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

function getTestBookingData(machineId) {
  return {
    userId: TEST_USER_ID,
    machineId: machineId,
    quantity: 1,
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
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

async function createTestMachine() {
  const response = await fetch("http://localhost:3000/api/machines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testMachineData),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create test machine: ${response.status} ${error}`);
  }
  const machine = await response.json();
  createdMachineId = machine._id;
  return createdMachineId;
}

async function testBookingCreation() {
  try {
    console.log('Testing booking creation API...');
    if (!createdMachineId) {
      await createTestMachine();
    }
    const testBookingData = getTestBookingData(createdMachineId);
    console.log('Booking data:', JSON.stringify(testBookingData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Booking created successfully!');
      console.log('Booking ID:', result._id);
      console.log('Response:', JSON.stringify(result, null, 2));
      createdBookingIds.push(result._id);
    } else {
      const error = await response.text();
      console.error('❌ Failed to create booking');
      console.error('Status:', response.status);
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Error testing booking creation:', error.message);
  }
}

// Test fetching bookings
async function testFetchBookings() {
  try {
    console.log('\nTesting booking fetching API...');
    
    const response = await fetch('http://localhost:3000/api/bookings');
    
    if (response.ok) {
      const bookings = await response.json();
      console.log('✅ Bookings fetched successfully!');
      console.log('Total bookings:', bookings.length);
      if (bookings.length > 0) {
        console.log('First booking:', {
          id: bookings[0]._id,
          equipmentName: bookings[0].equipmentName,
          status: bookings[0].status,
          totalPrice: bookings[0].totalPrice
        });
      }
    } else {
      const error = await response.text();
      console.error('❌ Failed to fetch bookings');
      console.error('Status:', response.status);
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Error testing booking fetching:', error.message);
  }
}

// Test fetching bookings by user
async function testFetchBookingsByUser() {
  try {
    console.log('\nTesting booking fetching by user API...');
    
    const userId = "64d0b6a4c0f1564d5ecbf91e";
    const response = await fetch(`http://localhost:3000/api/bookings?userId=${userId}`);
    
    if (response.ok) {
      const bookings = await response.json();
      console.log('✅ User bookings fetched successfully!');
      console.log('Total user bookings:', bookings.length);
      if (bookings.length > 0) {
        console.log('First user booking:', {
          id: bookings[0]._id,
          equipmentName: bookings[0].equipmentName,
          status: bookings[0].status
        });
      }
    } else {
      const error = await response.text();
      console.error('❌ Failed to fetch user bookings');
      console.error('Status:', response.status);
      console.error('Error:', error);
    }
  } catch (error) {
    console.error('❌ Error testing user booking fetching:', error.message);
  }
}

// Test updating booking status
async function testUpdateBookingStatus() {
  try {
    console.log('\nTesting booking status update API...');
    
    // First, create a booking to test with
    if (!createdMachineId) {
      await createTestMachine();
    }
    const testBookingData = getTestBookingData(createdMachineId);
    const createResponse = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBookingData)
    });
    
    if (createResponse.ok) {
      const newBooking = await createResponse.json();
      const bookingId = newBooking._id;
      
      console.log('Created test booking with ID:', bookingId);
      
      // Now test updating the status
      const updateResponse = await fetch(`http://localhost:3000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'confirmed' })
      });
      
      if (updateResponse.ok) {
        const updatedBooking = await updateResponse.json();
        console.log('✅ Booking status updated successfully!');
        console.log('New status:', updatedBooking.status);
        // Clean up this booking
        await fetch(`http://localhost:3000/api/bookings/${bookingId}`, { method: 'DELETE' });
      } else {
        const error = await updateResponse.text();
        console.error('❌ Failed to update booking status');
        console.error('Status:', updateResponse.status);
        console.error('Error:', error);
      }
    } else {
      console.error('❌ Failed to create test booking for status update test');
    }
  } catch (error) {
    console.error('❌ Error testing booking status update:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Booking API tests...\n');
  
  // Ensure test machine exists
  try {
    await createTestMachine();
  } catch (e) {
    console.error('❌ Unable to set up test machine:', e.message);
    return;
  }

  await testBookingCreation();
  await testFetchBookings();
  await testFetchBookingsByUser();
  await testUpdateBookingStatus();
  
  // Cleanup created bookings
  for (const id of createdBookingIds) {
    await fetch(`http://localhost:3000/api/bookings/${id}`, { method: 'DELETE' });
  }
  // Cleanup created machine
  if (createdMachineId) {
    await fetch(`http://localhost:3000/api/machines/${createdMachineId}`, { method: 'DELETE' });
  }

  console.log('\n✨ All booking tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.error('Install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();

