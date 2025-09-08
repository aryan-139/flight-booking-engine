# Flight Booking Engine

A comprehensive flight booking system with real-time flight tracking, dynamic pricing, and automated booking capabilities.

## 🚀 Features

### Core Booking System
- **Flight Search**: One-way and round-trip flight search with advanced filters
- **Dynamic Pricing**: Real-time price adjustments based on demand, scarcity, and proximity to departure
- **Automated Booking**: End-to-end booking process with PNR generation
- **E-Ticket Management**: Digital ticket generation and management
- **Payment Integration**: Secure payment processing

### Flight Tracking & Status
- **Live Flight Status**: Real-time updates for all flights from BOM airport
- **Status Updates**: On-time, delayed status tracking with variance simulation
- **PNR Tracking**: Check booking status using PNR and flight number

### Advanced Features
- **Cost Optimization**: Urgent booking with best pricing algorithms
- **Rate Limiting**: API protection with IP banning capabilities
- **Revenue Analytics**: Total revenue tracking and seat utilization
- **Airline Integration**: Flight logos and airline information

## 🛠️ Technical Implementation

### Data Management
- **Flight Data Scraping**: Automated collection of flight information
- **Database Seeding**: Scripts for populating initial flight data
- **Dynamic Triggers**: Real-time pricing adjustments based on demand

### Pricing Algorithm
- **Scarcity-Based Pricing**: Prices increase as seats become scarce
- **Search Frequency Analysis**: Temporary price adjustments based on route popularity
- **Proximity Pricing**: Higher prices closer to departure date
- **Revenue Optimization**: Maximize revenue while maintaining competitiveness

### Security & Performance
- **Rate Limiting**: API protection against abuse
- **IP Banning**: Automated blocking of malicious requests
- **Pagination**: Efficient flight search with pagination
- **Caching**: Optimized performance for frequent queries

## 📊 Key Metrics

- **Total Seats**: 222 (Airbus default configuration)
- **Seats Available**: Real-time seat count tracking
- **Revenue Tracking**: Total revenue earned per flight/route
- **Booking Analytics**: Route popularity and booking patterns

## 🎯 Business Logic

### Dynamic Pricing Factors
1. **Scarcity**: Prices increase as available seats decrease
2. **Search Frequency**: Temporary price hikes for popular routes
3. **Proximity to Departure**: Higher prices for last-minute bookings
4. **Route Demand**: Historical booking data analysis

### Status Management
- **Live Updates**: Real-time flight status from BOM airport
- **Variance Introduction**: Random delays and status changes for realism
- **Diffusion Simulation**: Realistic status propagation

## 🔧 Development Setup

### Prerequisites
- Database system (PostgreSQL/MySQL)
- Node.js/Python for backend
- Frontend framework (React/Vue.js)
- Payment gateway integration

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up database
npm run db:setup

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```


## 🚀 Deployment

### Production Considerations
- **Database Optimization**: Indexing for fast queries
- **Caching Strategy**: Redis for session and flight data
- **Load Balancing**: Handle high traffic during peak booking times
- **Monitoring**: Real-time system health tracking

### Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/flight_booking
PAYMENT_GATEWAY_KEY=your_payment_key
FLIGHT_API_KEY=your_flight_api_key
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📈 Future Enhancements

- **Loyalty Program**: Points and rewards system
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Business intelligence dashboard

## ETL script to explore the scraped flight data, transform it, load into the DB table for flights 

 [[https://colab.research.google.com/drive/1vvF7CLbO52rtkDvJ6kcZaMt_8Q0W25mh?usp=sharing]]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

