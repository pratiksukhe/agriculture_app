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

export interface IProduct {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
}
