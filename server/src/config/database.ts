import mongoose from 'mongoose';
import { config } from './index.js';

/**
 * Connects to MongoDB using the configured URI.
 *
 * Extracted from the entry point so the connection logic can be:
 * - Reused in seed scripts
 * - Replaced in tests (e.g., with mongodb-memory-server)
 * - Called independently of starting the HTTP server
 */
export const connectDatabase = async (): Promise<typeof mongoose> => {
    try {
        const connection = await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB');
        return connection;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ MongoDB connection error:', message);
        process.exit(1);
    }
};

/**
 * Gracefully disconnects from MongoDB.
 */
export const disconnectDatabase = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
};
