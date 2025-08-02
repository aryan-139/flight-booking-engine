# Testing Guide for Flight Booking Engine

This guide provides comprehensive instructions for testing the flight booking engine endpoints and database operations.

## 🚀 Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test the Endpoint with Node.js Script
```bash
npm run test:endpoint
```

### 3. Run Jest Tests
```bash
npm run test:flight
```

## 📋 Available Endpoints

### Root Endpoint
- **POST** `/` - Welcome message and API status

### Flight Endpoints
- **GET** `/api/flights` - Get all flights
- **POST** `/api/flights` - Create a new flight
- **POST** `/api/flights/test-insert` - Insert a test flight
- **GET** `/api/flights/:id` - Get flight by ID
- **GET** `/api/flights/search` - Search flights with filters

## 🧪 Testing Methods

### 1. Manual Testing with cURL

#### Test Root Endpoint
```bash
curl -X POST http://localhost:3000/
```

#### Get All Flights
```bash
curl -X GET http://localhost:3000/api/flights
```

#### Insert Test Flight
```bash
curl -X POST http://localhost:3000/api/flights/test-insert
```

#### Create Custom Flight
```bash
curl -X POST http://localhost:3000/api/flights \
  -H "Content-Type: application/json" \
  -d '{
    "flight_number": "6E123",
    "airline": "IndiGo",
    "origin": "Delhi (DEL)",
    "destination": "Bangalore (BLR)",
    "departure_time": "2024-01-15T10:00:00Z",
    "arrival_time": "2024-01-15T12:30:00Z",
    "price": 6500,
    "cabin_class": "Economy"
  }'
```

#### Search Flights
```bash
curl -X GET "http://localhost:3000/api/flights/search?origin=Mumbai%20(BOM)&destination=Delhi%20(DEL)"
```

### 2. Database Testing

#### Run SQL Script
Execute the `test-flight-insert.sql` file in your Supabase SQL editor or PostgreSQL client to:
- Check table structure
- Insert test flights
- Query flight data
- Get statistics

#### Direct Database Queries
```sql
-- Check table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'flights';

-- Insert test flight
INSERT INTO flights (
    flight_number, airline, origin, destination,
    departure_time, arrival_time, duration, price,
    seats_available, total_seats, cabin_class
) VALUES (
    'AI101', 'Air India', 'Mumbai (BOM)', 'Delhi (DEL)',
    NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
    120, 8500, 222, 222, 'Economy'
) RETURNING *;

-- Query all flights
SELECT * FROM flights ORDER BY created_at DESC;
```

### 3. Automated Testing

#### Run All Tests
```bash
npm test
```

#### Run Flight Tests Only
```bash
npm run test:flight
```

#### Test Coverage
```bash
npm test -- --coverage
```

## 📊 Expected Test Results

### Test Flight Data
When you insert a test flight, you should see:
```json
{
  "success": true,
  "data": {
    "flight": {
      "id": "uuid-here",
      "flight_number": "AI101",
      "airline": "Air India",
      "origin": "Mumbai (BOM)",
      "destination": "Delhi (DEL)",
      "departure_time": "2024-01-XX...",
      "arrival_time": "2024-01-XX...",
      "duration": 120,
      "price": 8500,
      "seats_available": 222,
      "total_seats": 222,
      "cabin_class": "Economy",
      "created_at": "2024-01-XX...",
      "updated_at": "2024-01-XX..."
    }
  },
  "message": "Test flight inserted successfully"
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your Supabase configuration in `config/database.ts`
   - Verify environment variables are set correctly

2. **Port Already in Use**
   - Change the port in your configuration
   - Kill existing processes on port 3000

3. **Test Failures**
   - Ensure the development server is running
   - Check database connectivity
   - Verify all dependencies are installed

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev

# Run tests with verbose output
npm test -- --verbose
```

## 📈 Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3000/api/flights
```

### Memory Usage
```bash
# Monitor memory usage
node --inspect src/index.ts
```

## 🛠️ Development Testing

### Hot Reload Testing
The development server uses nodemon for hot reloading. Any changes to the code will automatically restart the server.

### Environment Testing
Test different environments:
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

## 📝 Test Data Examples

### Sample Flight Objects
```javascript
// Economy Flight
{
  "flight_number": "AI101",
  "airline": "Air India",
  "origin": "Mumbai (BOM)",
  "destination": "Delhi (DEL)",
  "departure_time": "2024-01-15T10:00:00Z",
  "arrival_time": "2024-01-15T12:00:00Z",
  "price": 8500,
  "cabin_class": "Economy"
}

// Business Class Flight
{
  "flight_number": "UK123",
  "airline": "Vistara",
  "origin": "Delhi (DEL)",
  "destination": "Mumbai (BOM)",
  "departure_time": "2024-01-16T14:00:00Z",
  "arrival_time": "2024-01-16T15:30:00Z",
  "price": 15000,
  "cabin_class": "Business"
}
```

## 🎯 Next Steps

1. **Add More Test Cases**: Expand test coverage for edge cases
2. **Integration Tests**: Test with real external APIs
3. **Performance Tests**: Add load testing scenarios
4. **Security Tests**: Add authentication and authorization tests
5. **API Documentation**: Generate OpenAPI/Swagger documentation 