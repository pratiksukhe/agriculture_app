import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Product from '../models/Product.js';

/**
 * Database seed script.
 *
 * Seeds the database with initial product data for development/demo purposes.
 * Idempotent — skips if the product already exists.
 *
 * Usage: npm run seed
 */

const seedProduct = {
    name: 'The Great Samrat',
    tagline: 'NPK Microbial Consortia',
    description:
        'This product present in NPK Microbial Consortia releases organic acids and growth hormones resulting in better Growth, higher Yield, Disease and Stress Resistance.',
    manufacturer: {
        name: 'Sahyadri Agritech',
        address: 'C103, MIDC, Musalgaon, Tal - Sinnar, Dist - Nashik',
        licenseNo: 'LCBWD0220260078',
        licenseIssuedBy: 'Central Government of Maharashtra',
    },
    composition: [
        {
            name: 'Microbial Consortia',
            percentage: '78%',
            note: '% by min weight',
        },
        {
            name: 'Humic Acid',
            percentage: '22%',
            note: '% by min weight',
        },
    ],
    pH: '6 - 7 (1% Aqueous Solution)',
    bulkDensity: '0.8 - 0.9',
    recommendations: [
        'Mix 5 kg with 200 liters of water for Drenching',
        'Mix 2 kg with 200 liters of water for Foliar Spray',
        'For seed treatment use 2.5 kg for 10 liters of water',
    ],
    crops: [
        'Ginger',
        'Potato',
        'Watermelon',
        'Musk Melon',
        'All Vegetables',
        'Horticultural Crops',
    ],
    image: 'the-great-samrat.jpg',
};

async function seed(): Promise<void> {
    try {
        await connectDatabase();

        // Idempotent check
        const existing = await Product.findOne({ name: seedProduct.name });
        if (existing) {
            console.log('⚠️  Product "The Great Samrat" already exists. Skipping seed.');
            await disconnectDatabase();
            return;
        }

        const product = new Product(seedProduct);
        await product.save();
        console.log('🌱 Seeded "The Great Samrat" product successfully!');
        console.log(`   Product ID: ${String(product._id)}`);

        await disconnectDatabase();
        console.log('✅ Done!');
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Seed error:', message);
        process.exit(1);
    }
}

seed();
