export interface Booking {
    booking_id: string;
    user_id: string;
    flight_id: number;
    booking_type: 'one-way' | 'round-trip';
    passenger_info: number[]; // Array of passenger IDs
    payment_status: 'pending' | 'confirmed' | 'processing' | 'rejected';
    total_price: number;
    payment_date?: Date;
    payment_method?: 'card' | 'upi' | 'netbanking' | 'wallet';
    seat_numbers: any; // JSON object
    created_at: Date;
    updated_at: Date;
    special_requests?: {
        meal?: string;
        wheelchair?: boolean;
    };
    booking_source: 'web' | 'mobile' | 'agent';
    promocode_used?: string;
}

export interface CreateBookingRequest {
    user_id: string;
    flight_id: number;
    booking_type: 'one-way' | 'round-trip';
    passenger_info: number[]; // Array of passenger IDs
    payment_method: 'card' | 'upi' | 'netbanking' | 'wallet';
    seat_numbers: any; // JSON object
    special_requests?: {
        meal?: string;
        wheelchair?: boolean;
    };
    booking_source: 'web' | 'mobile' | 'agent';
    promocode_used?: string;
    total_price?: number;
}

export interface UpdateBookingRequest {
    payment_status?: 'pending' | 'confirmed' | 'processing' | 'rejected';
    payment_date?: string | Date;
    payment_method?: 'card' | 'upi' | 'netbanking' | 'wallet';
    seat_numbers?: any;
    special_requests?: {
        meal?: string;
        wheelchair?: boolean;
    };
    promocode_used?: string;
}