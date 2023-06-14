import { dbConnect } from './db.conect';
import mongoose from 'mongoose';

describe('Given db.connect', () => {
    describe('When db.connect is for test', () => {
        test('must connect to ProductsTesting', async () => {
            const result = await dbConnect();
            expect(typeof result).toBe(typeof mongoose);
            mongoose.disconnect();
        });
        describe('When db.connect is not for test', () => {
            test('must connect to Products', async () => {
                process.env.NODE_ENV = 'Products';
                const result = await dbConnect();
                expect(typeof result).toBe(typeof mongoose);
                mongoose.disconnect();
            });
        });
    });
});
