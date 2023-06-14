import { model, Schema, Types } from 'mongoose';

export type ProtoUserI = {
    name?: string;
    email?: string;
    passwd?: string;
    isDelete?: boolean;
    role?: 'user' | 'admin';
    myProducts?: Array<{
        productId: string;
        amount: number;
        price: number;
    }>;
};
export type MyProducts = {
    productId: string;

    amount: number;
};
export type UserI = {
    id: Types.ObjectId;
    name: string;
    email: string;
    passwd: string;
    isDelete: boolean;
    role: 'user' | 'admin';
    myProducts: Array<MyProducts>;
};

export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: String,
    passwd: String,
    isDelete: Boolean,
    role: String,
    myProducts: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            amount: Number,
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
