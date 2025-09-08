import { Passenger, CreatePassengerRequest } from '../models/Passenger';
import { PassengerDAL } from '../dal/passengerDAL';
import { Logger } from '../utils/logger';

export class PassengerService {
    public static async createPassenger(passengerData: CreatePassengerRequest): Promise<Passenger> {
        try {
            // Validate age based on type
            const age = this.calculateAge(new Date(passengerData.dob));
            this.validateAgeForType(age, passengerData.type);

            const passenger = await PassengerDAL.createPassenger(passengerData);
            Logger.info('Passenger created successfully', { passengerId: passenger.id });
            return passenger;
        } catch (error: any) {
            Logger.error('Failed to create passenger', { error });
            throw error;
        }
    }

    public static async getPassengersByUserId(userId: string): Promise<Passenger[]> {
        try {
            const passengers = await PassengerDAL.getPassengersByUserId(userId);
            Logger.info('Passengers fetched successfully', {
                userId,
                count: passengers.length
            });
            return passengers;
        } catch (error: any) {
            Logger.error('Failed to fetch passengers by user ID', { error });
            throw error;
        }
    }

    public static async getPassengerById(passengerId: string): Promise<Passenger> {
        try {
            const passenger = await PassengerDAL.getPassengerById(passengerId);
            if (!passenger) {
                throw new Error('Passenger not found');
            }
            Logger.info('Passenger fetched successfully', { passengerId });
            return passenger;
        } catch (error: any) {
            Logger.error('Failed to fetch passenger by ID', { error });
            throw error;
        }
    }

    public static async updatePassenger(passengerId: string, updateData: any): Promise<Passenger> {
        try {
            // If updating DOB or type, validate age
            if (updateData.dob || updateData.type) {
                const existingPassenger = await PassengerDAL.getPassengerById(passengerId);
                if (!existingPassenger) {
                    throw new Error('Passenger not found');
                }

                const dob = updateData.dob ? new Date(updateData.dob) : new Date(existingPassenger.dob);
                const type = updateData.type || existingPassenger.type;

                const age = this.calculateAge(dob);
                this.validateAgeForType(age, type);
            }

            const passenger = await PassengerDAL.updatePassenger(passengerId, updateData);
            Logger.info('Passenger updated successfully', { passengerId });
            return passenger;
        } catch (error: any) {
            Logger.error('Failed to update passenger', { error });
            throw error;
        }
    }

    public static async deletePassenger(passengerId: string): Promise<boolean> {
        try {
            const result = await PassengerDAL.deletePassenger(passengerId);
            Logger.info('Passenger deleted successfully', { passengerId });
            return result;
        } catch (error: any) {
            Logger.error('Failed to delete passenger', { error });
            throw error;
        }
    }

    private static calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    private static validateAgeForType(age: number, type: string): void {
        switch (type) {
            case 'infant':
                if (age < 0 || age >= 2) {
                    throw new Error('Infant must be under 2 years old');
                }
                break;
            case 'child':
                if (age < 2 || age >= 12) {
                    throw new Error('Child must be between 2 and 11 years old');
                }
                break;
            case 'adult':
                if (age < 12) {
                    throw new Error('Adult must be 12 years or older');
                }
                break;
            default:
                throw new Error('Invalid passenger type');
        }
    }
}
