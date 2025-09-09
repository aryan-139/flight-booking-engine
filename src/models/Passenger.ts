export interface Passenger {
    id: string;
    name: string;
    dob: Date;
    type: 'infant' | 'child' | 'adult';
    email_id?: string;
    country_code?: string;
    phone_number?: string;
    created_at: Date;
    user_id: string;
}

export interface CreatePassengerRequest {
    name: string;
    dob: string; // ISO date string
    type: 'infant' | 'child' | 'adult';
    email_id?: string;
    country_code?: string;
    phone_number?: string;
    user_id: string;
}

export interface UpdatePassengerRequest {
    name?: string;
    dob?: string;
    type?: 'infant' | 'child' | 'adult';
    email_id?: string;
    country_code?: string;
    phone_number?: string;
}
