import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db.conect';

describe('Given an "app" with "/Products" route', () => {
    describe('When I have connection to mongoDB', () => {
        beforeEach(async () => {
            await dbConnect();
        });

        afterEach(async () => {
            await mongoose.disconnect();
        });

        test('Then the get to url / should sent status 200', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        });

        test('Then the get to url /Products/:id with invalid id should sent status 404', async () => {
            const response = await request(app).get(
                '/Products/637d232badb33f47c88058b5'
            );
            expect(response.status).toBe(404);
        });
    });
});
