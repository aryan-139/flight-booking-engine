import { z } from 'zod';

export const createPassengerSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    dob: z.string()
        .min(1, 'Date of birth is required')
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, 'Invalid date format')
        .refine((date) => {
            const parsedDate = new Date(date);
            const today = new Date();
            return parsedDate <= today;
        }, 'Date of birth cannot be in the future'),

    type: z.enum(['infant', 'child', 'adult'], {
        message: 'Type must be infant, child, or adult'
    }),

    email_id: z.string()
        .email('Invalid email format')
        .optional(),

    country_code: z.string()
        .regex(/^\+\d{1,4}$/, 'Country code must start with + and contain 1-4 digits')
        .optional(),

    phone_number: z.string()
        .regex(/^\d{10,15}$/, 'Phone number must contain 10-15 digits')
        .optional(),

    user_id: z.string()
        .min(1, 'User ID is required')
});

export const updatePassengerSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .optional(),

    dob: z.string()
        .min(1, 'Date of birth is required')
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, 'Invalid date format')
        .refine((date) => {
            const parsedDate = new Date(date);
            const today = new Date();
            return parsedDate <= today;
        }, 'Date of birth cannot be in the future')
        .optional(),

    type: z.enum(['infant', 'child', 'adult'], {
        message: 'Type must be infant, child, or adult'
    }).optional(),

    email_id: z.string()
        .min(1, 'Email is required')
        .email('Invalid email format')
        .optional(),

    country_code: z.string()
        .min(1, 'Country code is required')
        .regex(/^\+\d{1,4}$/, 'Country code must start with + and contain 1-4 digits')
        .optional(),

    phone_number: z.string()
        .min(1, 'Phone number is required')
        .regex(/^\d{10,15}$/, 'Phone number must contain 10-15 digits')
        .optional()
});

export const getPassengerByUserIdSchema = z.object({
    user_id: z.string()
        .min(1, 'User ID is required')
});
