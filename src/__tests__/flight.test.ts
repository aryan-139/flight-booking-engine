import request from 'supertest';
import app from '../app';
import { FlightService } from '../services/FlightService';

describe('Flight Endpoints', () => {
    describe('GET /api/flights', () => {
        it('should return all flights', async () => {
            const response = await request(app)
                .get('/api/flights')
                .expect(200);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flights');
            expect(Array.isArray(response.body.data.flights)).toBe(true);
        });
    });

    describe('POST /api/flights/test-insert', () => {
        it('should insert a test flight into the database', async () => {
            const response = await request(app)
                .post('/api/flights/test-insert')
                .expect(201);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flight');
            
            const flight = response.body.data.flight;
            expect(flight).toHaveProperty('id');
            expect(flight).toHaveProperty('flight_number');
            expect(flight.flight_number).toBe('AI101');
            expect(flight).toHaveProperty('airline');
            expect(flight.airline).toBe('Air India');
            expect(flight).toHaveProperty('origin');
            expect(flight.origin).toBe('Mumbai (BOM)');
            expect(flight).toHaveProperty('destination');
            expect(flight.destination).toBe('Delhi (DEL)');
            expect(flight).toHaveProperty('price');
            expect(flight.price).toBe(8500);
            expect(flight).toHaveProperty('cabin_class');
            expect(flight.cabin_class).toBe('Economy');
            expect(flight).toHaveProperty('seats_available');
            expect(flight.seats_available).toBe(222);
            expect(flight).toHaveProperty('total_seats');
            expect(flight.total_seats).toBe(222);
            expect(flight).toHaveProperty('duration');
            expect(typeof flight.duration).toBe('number');
            expect(flight.duration).toBeGreaterThan(0);
        });
    });

    describe('POST /api/flights', () => {
        it('should create a new flight with valid data', async () => {
            const flightData = {
                flight_number: '6E123',
                airline: 'IndiGo',
                origin: 'Delhi (DEL)',
                destination: 'Bangalore (BLR)',
                departure_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
                arrival_time: new Date(Date.now() + 48 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
                price: 6500,
                cabin_class: 'Economy'
            };

            const response = await request(app)
                .post('/api/flights')
                .send(flightData)
                .expect(201);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flight');
            
            const flight = response.body.data.flight;
            expect(flight).toHaveProperty('id');
            expect(flight).toHaveProperty('flight_number');
            expect(flight.flight_number).toBe('6E123');
            expect(flight).toHaveProperty('airline');
            expect(flight.airline).toBe('IndiGo');
            expect(flight).toHaveProperty('origin');
            expect(flight.origin).toBe('Delhi (DEL)');
            expect(flight).toHaveProperty('destination');
            expect(flight.destination).toBe('Bangalore (BLR)');
            expect(flight).toHaveProperty('price');
            expect(flight.price).toBe(6500);
            expect(flight).toHaveProperty('cabin_class');
            expect(flight.cabin_class).toBe('Economy');
        });
    });

    describe('GET /api/flights/search', () => {
        it('should search flights with query parameters', async () => {
            const response = await request(app)
                .get('/api/flights/search')
                .query({
                    origin: 'Mumbai (BOM)',
                    destination: 'Delhi (DEL)'
                })
                .expect(200);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flights');
            expect(Array.isArray(response.body.data.flights)).toBe(true);
        });

        it('should search flights without query parameters', async () => {
            const response = await request(app)
                .get('/api/flights/search')
                .expect(200);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flights');
            expect(Array.isArray(response.body.data.flights)).toBe(true);
        });
    });

    describe('GET /api/flights/:id', () => {
        it('should return a specific flight by ID', async () => {
            // First, create a test flight to get its ID
            const testFlight = await FlightService.insertTestFlight();
            
            const response = await request(app)
                .get(`/api/flights/${testFlight.id}`)
                .expect(200);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('flight');
            
            const flight = response.body.data.flight;
            expect(flight).toHaveProperty('id');
            expect(flight.id).toBe(testFlight.id);
        });

        it('should return 404 for non-existent flight ID', async () => {
            const response = await request(app)
                .get('/api/flights/non-existent-id')
                .expect(404);

            expect(response.body).toHaveProperty('success');
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Flight not found');
        });
    });
});

describe('Database Operations', () => {
    describe('FlightService.insertTestFlight', () => {
        it('should insert a test flight and return flight data', async () => {
            const flight = await FlightService.insertTestFlight();
            
            expect(flight).toHaveProperty('id');
            expect(flight).toHaveProperty('flight_number');
            expect(flight.flight_number).toBe('AI101');
            expect(flight).toHaveProperty('airline');
            expect(flight.airline).toBe('Air India');
            expect(flight).toHaveProperty('origin');
            expect(flight.origin).toBe('Mumbai (BOM)');
            expect(flight).toHaveProperty('destination');
            expect(flight.destination).toBe('Delhi (DEL)');
            expect(flight).toHaveProperty('price');
            expect(flight.price).toBe(8500);
            expect(flight).toHaveProperty('cabin_class');
            expect(flight.cabin_class).toBe('Economy');
            expect(flight).toHaveProperty('seats_available');
            expect(flight.seats_available).toBe(222);
            expect(flight).toHaveProperty('total_seats');
            expect(flight.total_seats).toBe(222);
            expect(flight).toHaveProperty('duration');
            expect(typeof flight.duration).toBe('number');
            expect(flight.duration).toBeGreaterThan(0);
            expect(flight).toHaveProperty('created_at');
            expect(flight).toHaveProperty('updated_at');
        });
    });

    describe('FlightService.getAllFlights', () => {
        it('should retrieve all flights from database', async () => {
            const flights = await FlightService.getAllFlights();
            
            expect(Array.isArray(flights)).toBe(true);
            
            if (flights.length > 0) {
                const flight = flights[0];
                expect(flight).toHaveProperty('id');
                expect(flight).toHaveProperty('flight_number');
                expect(flight).toHaveProperty('airline');
                expect(flight).toHaveProperty('origin');
                expect(flight).toHaveProperty('destination');
                expect(flight).toHaveProperty('departure_time');
                expect(flight).toHaveProperty('arrival_time');
                expect(flight).toHaveProperty('duration');
                expect(flight).toHaveProperty('price');
                expect(flight).toHaveProperty('seats_available');
                expect(flight).toHaveProperty('total_seats');
                expect(flight).toHaveProperty('cabin_class');
            }
        });
    });

    describe('FlightService.searchFlights', () => {
        it('should search flights by origin and destination', async () => {
            const flights = await FlightService.searchFlights('Mumbai (BOM)', 'Delhi (DEL)');
            
            expect(Array.isArray(flights)).toBe(true);
            
            flights.forEach(flight => {
                expect(flight.origin).toBe('Mumbai (BOM)');
                expect(flight.destination).toBe('Delhi (DEL)');
            });
        });

        it('should search flights by date', async () => {
            const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const dateString = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            const flights = await FlightService.searchFlights(undefined, undefined, dateString);
            
            expect(Array.isArray(flights)).toBe(true);
            
            flights.forEach(flight => {
                const flightDate = new Date(flight.departure_time);
                expect(flightDate.toDateString()).toBe(tomorrow.toDateString());
            });
        });
    });
}); 