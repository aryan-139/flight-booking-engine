import { Passenger, CreatePassengerRequest } from '../models/Passenger';
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

export class PassengerDAL {
    private static supabase = SupabaseConnection.getInstance();

    public static async createPassenger(passengerData: CreatePassengerRequest): Promise<Passenger> {
        try {
            const data = {
                name: passengerData.name,
                dob: new Date(passengerData.dob).toISOString(),
                type: passengerData.type,
                user_id: passengerData.user_id,
                created_at: new Date().toISOString()
            };

            const result = await this.supabase.insert('passengers', data);
            return result;
        } catch (error: any) {
            Logger.error('Failed to create passenger', { error });
            throw error;
        }
    }

    public static async getPassengersByUserId(userId: string): Promise<Passenger[]> {
        try {
            const data = await this.supabase.query('passengers', {
                filters: { user_id: userId }
            });
            return data;
        } catch (error: any) {
            Logger.error('Failed to fetch passengers by user ID', { error });
            throw error;
        }
    }

    public static async getPassengerById(passengerId: string): Promise<Passenger> {
        try {
            const data = await this.supabase.query('passengers', {
                filters: { id: passengerId }
            });
            return data[0];
        } catch (error: any) {
            Logger.error('Failed to fetch passenger by ID', { error });
            throw error;
        }
    }

    public static async updatePassenger(passengerId: string, updateData: any): Promise<Passenger> {
        try {
            const data = await this.supabase.update('passengers', passengerId, updateData);
            return data;
        } catch (error: any) {
            Logger.error('Failed to update passenger', { error });
            throw error;
        }
    }

    public static async deletePassenger(passengerId: string): Promise<boolean> {
        try {
            const result = await this.supabase.delete('passengers', passengerId);
            return result;
        } catch (error: any) {
            Logger.error('Failed to delete passenger', { error });
            throw error;
        }
    }
}
