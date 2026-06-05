import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { config } from './config/index.js';

/**
 * Application entry point.
 *
 * Responsibilities (and nothing more):
 * 1. Connect to the database
 * 2. Create the Express app
 * 3. Start listening for HTTP requests
 */
const bootstrap = async (): Promise<void> => {
    await connectDatabase();

    const app = createApp();

    app.listen(config.port, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${config.port}`);
    });
};

bootstrap().catch((error: unknown) => {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
});
