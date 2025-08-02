export interface Booking {
    id: string;
    user_id: string;
    flight_id: string;
    booking_type: 'one-way' | 'round-trip';
    passengers_info: PassengerInfo[];
    status: BookingStatus;
    total_price: number;
    booking_date: Date;
    created_at: Date;
    updated_at: Date;
}

export interface PassengerInfo {
    name: string;
    age: number;
    type: 'infant' | 'child' | 'adult';
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface CreateBookingRequest {
    user_id: string;
    flight_id: string;
    booking_type: 'one-way' | 'round-trip';
    passengers_info: PassengerInfo[];
}

export interface UpdateBookingRequest {
    status?: BookingStatus;
    total_price?: number;
} 