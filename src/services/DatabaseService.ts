// src/services/DatabaseService.ts
import SupabaseConnection from '../database/supabase';
import { Logger } from '../utils/logger';

export class DatabaseService {
    private static supabase = SupabaseConnection.getInstance();

    public static async testConnection(): Promise<boolean> {
        try {
            return await this.supabase.testConnection();
        } catch (error) {
            Logger.error('Database connection test failed', { error });
            return false;
        }
    }

    public static async query(table: string, query: any = {}) {
        return await this.supabase.query(table, query);
    }

    public static async insert(table: string, data: any) {
        return await this.supabase.insert(table, data);
    }

    public static async update(table: string, id: string, data: any) {
        return await this.supabase.update(table, id, data);
    }

    public static async delete(table: string, id: string) {
        return await this.supabase.delete(table, id);
    }
}