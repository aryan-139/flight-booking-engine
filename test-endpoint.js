const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint() {
    try {
        console.log('🚀 Testing Flight Booking Engine API...\n');

        // Test 1: Test the root endpoint
        console.log('1. Testing root endpoint...');
        const rootResponse = await axios.post(`${BASE_URL}/`);
        console.log('✅ Root endpoint response:', rootResponse.data);
        console.log('');

        // Test 2: Test the flights endpoint
        console.log('2. Testing flights endpoint...');
        const flightsResponse = await axios.get(`${BASE_URL}/api/flights`);
        console.log('✅ Flights endpoint response:', flightsResponse.data);
        console.log('');

        // Test 3: Insert a test flight
        console.log('3. Inserting test flight...');
        const testFlightResponse = await axios.post(`${BASE_URL}/api/flights/test-insert`);
        console.log('✅ Test flight inserted:', testFlightResponse.data);
        console.log('');

        // Test 4: Get the inserted flight by ID
        if (testFlightResponse.data.data && testFlightResponse.data.data.flight) {
            const flightId = testFlightResponse.data.data.flight.id;
            console.log(`4. Getting flight by ID: ${flightId}...`);
            const flightByIdResponse = await axios.get(`${BASE_URL}/api/flights/${flightId}`);
            console.log('✅ Flight by ID response:', flightByIdResponse.data);
            console.log('');
        }

        // Test 5: Search flights
        console.log('5. Searching flights...');
        const searchResponse = await axios.get(`${BASE_URL}/api/flights/search`, {
            params: {
                origin: 'Mumbai (BOM)',
                destination: 'Delhi (DEL)'
            }
        });
        console.log('✅ Search response:', searchResponse.data);
        console.log('');

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Error testing endpoint:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Run the test
testEndpoint(); 