import mongoose from 'mongoose';
import { dbConnect } from '../db.conect';
import { User } from '../entities/user';
import { ProductRepository } from './productRepository';
import { UserRepository } from './userRepository';

describe('Given a singleton instance of the class "UserRepository"', () => {
    const mockData = [{ name: 'PepeBot', myProducts: [] }, { name: 'LuluBot' }];
    const setUpCollection = async () => {
        await dbConnect();
        await User.deleteMany();
        await User.insertMany(mockData);
        const data = await User.find();
        return [data[0].id, data[1].id];
    };

    const repository = UserRepository.getInstance();
    ProductRepository.getInstance();

    const invalidId = '537b422da27b69c98b1916e1';
    let testIds: Array<string>;

    beforeAll(async () => {
        testIds = await setUpCollection();
    });
    describe('When it has been run findOne and it has called findOne', () => {
        test('Then it returns the user in the collection', async () => {
            const result = await repository.findOne(testIds[0]);

            expect(result.name).toEqual(mockData[0].name);
        });
        test('Then not returns the user', async () => {
            expect(async () => {
                await repository.findOne(invalidId);
            }).rejects.toThrowError('Not found id');
        });
    });

    describe('When it has been run findOne and it has called findOne', () => {
        test('Then it returns the user in the collection', async () => {
            const result = await repository.get(testIds[0]);

            expect(result.name).toEqual(mockData[0].name);
        });

        test('Then not returns the user', async () => {
            expect(async () => {
                await repository.get(invalidId);
            }).rejects.toThrowError('Not found id');
        });
    });

    describe('When it has been run create and it has called create', () => {
        test('Then it returns the new user in the collection', async () => {
            const userMock = { name: 'Carlos', passwd: '1234' };
            const result = await repository.create(userMock);
            expect(result.name).toEqual(userMock.name);
        });
        test('hen return not found id', async () => {
            expect(async () => {
                await repository.create({ passwd: testIds[4] });
            }).rejects.toThrowError();
        });
    });

    describe('When it has been run update and it has called Model.findOne', () => {
        //test a solucionar
        test('Then it returns update user in the collection', async () => {
            const result = await repository.update(testIds[1], {
                name: 'update',
            });
            expect(result.name).toBe('update');
        });
        test('Then return not found id in function update', async () => {
            expect(async () => {
                await repository.update(invalidId, mockData[0]);
            }).rejects.toThrowError();
        });
    });

    describe('When it has been run find and it has called find', () => {
        test('Then it returns the user in the collection', async () => {
            const result = await repository.find({ name: mockData[0].name });
            expect(result.name).toEqual(mockData[0].name);
        });
        test('Then return not found id', async () => {
            expect(async () => {
                await repository.find({ name: invalidId });
            }).rejects.toThrowError();
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
