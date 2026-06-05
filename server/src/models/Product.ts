import mongoose, { Schema, Document } from 'mongoose';

export interface IComposition {
    name: string;
    percentage: string;
    note?: string;
}

export interface IManufacturer {
    name: string;
    address: string;
    licenseNo: string;
    licenseIssuedBy: string;
}

export interface IProduct extends Document {
    name: string;
    tagline: string;
    description: string;
    manufacturer: IManufacturer;
    composition: IComposition[];
    pH?: string;
    bulkDensity?: string;
    recommendations: string[];
    crops: string[];
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CompositionSchema = new Schema<IComposition>({
    name: { type: String, required: true },
    percentage: { type: String, required: true },
    note: { type: String, default: '' },
});

const ManufacturerSchema = new Schema<IManufacturer>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    licenseNo: { type: String, required: true },
    licenseIssuedBy: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        tagline: { type: String, required: true },
        description: { type: String, required: true },
        manufacturer: { type: ManufacturerSchema, required: true },
        composition: { type: [CompositionSchema], required: true },
        pH: { type: String, default: '' },
        bulkDensity: { type: String, default: '' },
        recommendations: { type: [String], required: true },
        crops: { type: [String], required: true },
        image: { type: String, default: '' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
