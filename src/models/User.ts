export interface User {
    id: string;
    email: string;
    phone_no: string;
    address: string;
    payment_info: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateUserRequest {
    email: string;
    phone_no: string;
    address: string;
    payment_info: string;
}

export interface UpdateUserRequest {
    email?: string;
    phone_no?: string;
    address?: string;
    payment_info?: string;
} 