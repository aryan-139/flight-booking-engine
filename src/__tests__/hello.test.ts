import request from 'supertest';
import app from '../app';

describe('Hello World Endpoint', () => {
    it('should return hello world message', async () => {
        const response = await request(app)
            .get('/api/hello')
            .expect(200);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Hello World from Flight Booking Engine!');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('endpoints');
    });

    it('should include expected endpoints', async () => {
        const response = await request(app)
            .get('/api/hello')
            .expect(200);

        expect(response.body.endpoints).toEqual({
            flights: '/api/flights',
            bookings: '/api/bookings',
            users: '/api/users'
        });
    });

    it('should return health status', async () => {
        const response = await request(app)
            .get('/api/health')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('healthy');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('timestamp');
    });

    it('should return welcome message for root route', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Welcome to Flight Booking Engine API');
        expect(response.body).toHaveProperty('version');
        expect(response.body).toHaveProperty('status');
    });
}); 