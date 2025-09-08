export interface Flight {
    id: string;
    flight_id: number;
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: Date;
    arrival_time: Date;
    duration: number; // in minutes
    price: number;
    seats_available: number;
    total_seats: number;
    cabin_class: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateFlightRequest {
    flight_number: string;
    airline: string;
    origin: string;
    destination: string;
    departure_time: Date;
    arrival_time: Date;
    duration: number; // in minutes
    price: number;
    seats_available: number;
    cabin_class: string;
    created_at?: string; // Optional HH:mm:ss format
}

export interface UpdateFlightRequest {
    price?: number;
    seats_available?: number;
    departure_time?: Date;
    arrival_time?: Date;
} 