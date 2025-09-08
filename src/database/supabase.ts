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
            // Start the query builder chain with .select()
            let queryBuilder = this.supabase
                .from(table)
                .select(query.select || '*');

            // Now, you can safely apply filters
            if (query.filters) {
                Object.entries(query.filters).forEach(([key, value]) => {
                    queryBuilder = queryBuilder.eq(key, value as any);
                });
            }

            // Apply ordering
            if (query.orderBy) {
                queryBuilder = queryBuilder.order(query.orderBy.column, {
                    ascending: query.orderBy.ascending !== false
                });
            }

            // Apply pagination (limit and offset)
            if (query.offset && query.limit) {
                queryBuilder = queryBuilder.range(query.offset, query.offset + query.limit - 1);
            } else if (query.limit) {
                queryBuilder = queryBuilder.limit(query.limit);
            }

            // Await the fully constructed query
            const { data, error } = await queryBuilder;

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

    public async updateByField(table: string, field: string, value: string, data: any) {
        try {
            const { data: result, error } = await this.supabase
                .from(table)
                .update(data)
                .eq(field, value)
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

    public async deleteByField(table: string, field: string, value: string) {
        try {
            const { error } = await this.supabase
                .from(table)
                .delete()
                .eq(field, value);

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

    /**
     * Execute raw SQL queries using Supabase RPC
     * @param sql - The SQL query string to execute
     * @param params - Optional parameters for the SQL query
     * @returns Query results
     */
    public async rawQuery(sql: string, params?: any[]) {
        try {
            Logger.info('Executing raw SQL query', { sql, params });

            // Use Supabase's rpc method to execute raw SQL
            const { data, error } = await this.supabase.rpc('execute_sql', {
                query: sql,
                parameters: params || []
            });

            if (error) {
                Logger.error('Raw SQL query execution failed', { error, sql });
                throw error;
            }

            Logger.info('Raw SQL query executed successfully', { rowCount: data?.length || 0 });
            return data;
        } catch (error) {
            Logger.error('Raw SQL query execution failed', { error, sql });
            throw error;
        }
    }

    /**
     * Execute a raw SQL query and return a single row
     * @param sql - The SQL query string to execute
     * @param params - Optional parameters for the SQL query
     * @returns Single row result or null
     */
    public async rawQuerySingle(sql: string, params?: any[]) {
        try {
            const data = await this.rawQuery(sql, params);
            return data && data.length > 0 ? data[0] : null;
        } catch (error) {
            Logger.error('Raw SQL single query execution failed', { error, sql });
            throw error;
        }
    }

    /**
     * Execute a raw SQL query without expecting return data (for INSERT, UPDATE, DELETE)
     * @param sql - The SQL query string to execute
     * @param params - Optional parameters for the SQL query
     * @returns Success boolean
     */
    public async rawExecute(sql: string, params?: any[]) {
        try {
            await this.rawQuery(sql, params);
            return true;
        } catch (error) {
            Logger.error('Raw SQL execution failed', { error, sql });
            throw error;
        }
    }
}

export default SupabaseConnection;