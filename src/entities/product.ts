import { model, Schema, Types } from 'mongoose';

export type Category = { category: 'producto' | 'servicio' };
export type Area = { area: 'ceja' | 'pestaña' | 'manicura' };

export type ProtoProductI = {
    name?: string;
    image?: string;
    price?: number;
    category?: Category;
    area?: Area;
    description?: string;
    isAvailable?: boolean;
    clients?: Array<Types.ObjectId>;
};

export type ProductI = {
    id: Types.ObjectId;
    name: string;
    image: string;
    price: number;
    category: Category;
    area: Area;
    description: string;
    isAvailable: boolean;
    clients: Array<Types.ObjectId>;
};

export const productSchema = new Schema<ProductI>({
    id: Types.ObjectId,
    name: String,
    image: String,
    price: Number,
    category: String,
    area: String,
    description: String,
    isAvailable: Boolean,
    clients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

productSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const Product = model<ProductI>('Product', productSchema, 'products');
