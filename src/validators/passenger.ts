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
    }).optional()
});

export const getPassengerByUserIdSchema = z.object({
    user_id: z.string()
        .min(1, 'User ID is required')
});
