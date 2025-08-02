// src/database/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../../config/database';
import { Logger } from '../utils/logger';

class SupabaseConnection {
    private static instance: SupabaseConnection;
    private supabase: any;
    private isConnected: boolean = false;

    private constructor() {
        this.initializeSupabase();
    }

    public static getInstance(): SupabaseConnection {
        if (!SupabaseConnection.instance) {
            SupabaseConnection.instance = new SupabaseConnection();
        }
        return SupabaseConnection.instance;
    }

    private initializeSupabase(): void {
        try {
            if (!supabaseConfig.url || !supabaseConfig.anonKey) {
                throw new Error('Supabase URL and Anon Key are required');
            }

            this.supabase = createClient(
                supabaseConfig.url,
                supabaseConfig.anonKey,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true
                    }
                }
            );

            this.isConnected = true;
            Logger.info('Supabase client initialized successfully');
        } catch (error) {
            Logger.error('Failed to initialize Supabase client', { error });
            throw error;
        }
    }

    public getClient(): any {
        if (!this.isConnected) {
            throw new Error('Supabase client not initialized');
        }
        return this.supabase;
    }

    public async testConnection(): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from('flights')
                .select('count')
                .limit(1);

            if (error) {
                Logger.error('Supabase connection test failed', { error });
                return false;
            }

            Logger.info('Supabase connection test successful');
            return true;
        } catch (error) {
            Logger.error('Supabase connection test failed', { error });
            return false;
        }
    }

    public async query(table: string, query: any = {}) {
        try {
            let queryBuilder = this.supabase.from(table);

            // Apply filters
            if (query.filters) {
                Object.entries(query.filters).forEach(([key, value]) => {
                    queryBuilder = queryBuilder.eq(key, value);
                });
            }

            // Apply pagination
            if (query.limit) {
                queryBuilder = queryBuilder.limit(query.limit);
            }

            if (query.offset) {
                queryBuilder = queryBuilder.range(query.offset, query.offset + (query.limit || 10) - 1);
            }

            // Apply ordering
            if (query.orderBy) {
                queryBuilder = queryBuilder.order(query.orderBy.column, {
                    ascending: query.orderBy.ascending !== false
                });
            }

            const { data, error } = await queryBuilder.select(query.select || '*');

            if (error) {
                Logger.error(`Supabase query failed for table ${table}`, { error });
                throw error;
            }

            return data;
        } catch (error) {
            Logger.error(`Supabase query failed for table ${table}`, { error });
            throw error;
        }
    }

    public async insert(table: string, data: any) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .insert(data)
                .select();

            if (error) {
                Logger.error(`Supabase insert failed for table ${table}`, { error });
                throw error;
            }

            return result[0];
        } catch (error) {
            Logger.error(`Supabase insert failed for table ${table}`, { error });
            throw error;
        }
    }

    public async update(table: string, id: string, data: any) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select();

            if (error) {
                Logger.error(`Supabase update failed for table ${table}`, { error });
                throw error;
            }

            return result[0];
        } catch (error) {
            Logger.error(`Supabase update failed for table ${table}`, { error });
            throw error;
        }
    }

    public async delete(table: string, id: string) {
        try {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .eq('id', id);

            if (error) {
                Logger.error(`Supabase delete failed for table ${table}`, { error });
                throw error;
            }

            return true;
        } catch (error) {
            Logger.error(`Supabase delete failed for table ${table}`, { error });
            throw error;
        }
    }
}

export default SupabaseConnection;