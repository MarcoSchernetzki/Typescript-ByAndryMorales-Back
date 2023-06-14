import mongoose from 'mongoose';
import { dbConnect } from '../db.conect';
import { Product } from '../entities/product';
import { ProductRepository } from './productRepository';
import { UserRepository } from './userRepository';

describe('Given a singleton instance of the class "ProductRepository"', () => {
    const mockData = [{ name: 'PepeBot' }];
    const setUpCollection = async () => {
        await dbConnect();
        await Product.deleteMany();
        await Product.insertMany(mockData);
        const data = await Product.find();
        return [data[0]._id.toString()];
    };

    const repository = ProductRepository.getInstance();
    UserRepository.getInstance();

    const invalidId = '537b422da27b69c98b1916e1';
    const badFormattedId = '4';
    let testIds: Array<string>;
    beforeAll(async () => {
        testIds = await setUpCollection();
    });

    describe('When it has been run findAll and it has called Model.find', () => {
        test('Then it returns the Products in the collection', async () => {
            const spyModel = jest.spyOn(Product, 'find');
            const result = await repository.findAll();
            expect(spyModel).toHaveBeenCalled();
            expect(result[0].name).toEqual(mockData[0].name);
        });
    });

    describe('When it has been run findOne and it has called Model.findById', () => {
        const spyModel = jest.spyOn(Product, 'findById');
        test('Then, if the ID has been valid, it should be returned the Product', async () => {
            const result = await repository.findOne(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then, if the ID has been bad formatted, it should be thrown an Cast error', async () => {
            expect(async () => {
                await repository.findOne(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });

        test('Then, if the ID has been invalid, it should be thrown a Validation error', async () => {
            expect(async () => {
                await repository.findOne(invalidId);
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run create and it has called Model.create', () => {
        test('Then it returns the new product in the collection', async () => {
            const productMock = { name: 'Miguel', price: 200 };
            const result = await repository.create(productMock);
            expect(result.name).toEqual(productMock.name);
        });
    });

    describe('When it has been run find and it has called Model.findOne', () => {
        const spyModel = jest.spyOn(Product, 'findOne');
        test('Then, if the data has been valid, it should be returned the found Product ', async () => {
            const result = await repository.find(mockData[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toBe(mockData[0].name);
        });

        test('Then, if the data has been invalid, it should be throw an error', async () => {
            expect(async () => {
                await repository.find({ name: 'NoBot' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run update and it has called Model.findByIdAndUpdate', () => {
        const spyModel = jest.spyOn(Product, 'findByIdAndUpdate');
        test('Then, if the ID has been valid, it should be returned the updated Product', async () => {
            const updateName = 'updateError';
            const result = await repository.update(testIds[0], {
                name: updateName,
            });
            expect(spyModel).toHaveBeenCalled();
            expect(result.name).toEqual(updateName);
        });

        test('Then, if the ID has been invalid, it should be thrown an error', async () => {
            expect(async () => {
                await repository.update(invalidId, { name: '' });
            }).rejects.toThrowError(mongoose.MongooseError);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    describe('When it has been run delete and it has called Model.findByIdAndDelete', () => {
        const spyModel = jest.spyOn(Product, 'findByIdAndDelete');
        test('Then, if the ID has been valid, it should be returned the deleted Product', async () => {
            const result = await repository.delete(testIds[0]);
            expect(spyModel).toHaveBeenCalled();
            expect(result).toEqual(testIds[0]);
        });
        test('Then if the ID has been bad formatted, it should be thrown a CastError error', async () => {
            expect(async () => {
                await repository.delete(badFormattedId);
            }).rejects.toThrowError(mongoose.Error.CastError);
            expect(spyModel).toHaveBeenCalled();
        });
        test('Then if the ID has been invalid, it should be thrown an error', async () => {
            expect(async () => {
                await repository.delete(invalidId);
            }).rejects.toThrowError(Error);
            expect(spyModel).toHaveBeenCalled();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
