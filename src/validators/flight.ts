// src/validators/flight.ts
import { z } from 'zod';

export const flightPayloadSchema = z.object({
  flight_number: z.string().regex(/^[A-Z0-9]{2,8}$/, '2–8 uppercase letters/digits'),
  airline: z.string().min(1),
  origin: z.string().regex(/^[A-Z]{3}$/, 'IATA code (AAA)'),
  destination: z.string().regex(/^[A-Z]{3}$/, 'IATA code (AAA)'),
  departure_time: z.string().datetime(),
  arrival_time: z.string().datetime(),
  duration: z.number().int().positive(),
  price: z.number().min(0),
  seats_available: z.number().int().min(0),
  total_seats: z.number().int().min(0),
  cabin_class: z.enum(['Economy', 'Premium Economy', 'Business', 'First'])
}).superRefine((v, ctx) => {
  const dep = new Date(v.departure_time).getTime();
  const arr = new Date(v.arrival_time).getTime();
  if (arr <= dep) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['arrival_time'], message: 'arrival_time must be after departure_time' });
  }
  const mins = Math.round((arr - dep) / 60000);
  if (mins !== v.duration) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['duration'], message: `duration must equal ${mins} minutes` });
  }
});

export type FlightPayload = z.infer<typeof flightPayloadSchema>;

export const flightSearchQuerySchema = z.object({
  origin: z.string().regex(/^[A-Z]{3}$/, 'IATA code (AAA)'),
  destination: z.string().regex(/^[A-Z]{3}$/, 'IATA code (AAA)'),
  depart_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format YYYY-MM-DD'),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format YYYY-MM-DD').optional(),
  adults: z.string().transform(val => parseInt(val)).pipe(z.number().int().min(1).max(100)).optional(),
  cabin: z.enum(['Economy', 'Premium Economy', 'Business', 'First']).optional(),
  page_size: z.string().transform(val => parseInt(val)).pipe(z.number().int().min(1).max(100)).optional(),
  page_number: z.string().transform(val => parseInt(val)).pipe(z.number().int().min(1).max(100)).optional()
}).superRefine((v, ctx) => {
  //handle error for when return date is before the depart date 
  if (v.return_date && v.depart_date) {
    const departDate = new Date(v.depart_date);
    const returnDate = new Date(v.return_date);
    if (returnDate <= departDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['return_date'],
        message: 'return_date must be after depart_date'
      });
    }
  }
});

export type FlightSearchQuery = z.infer<typeof flightSearchQuerySchema>;