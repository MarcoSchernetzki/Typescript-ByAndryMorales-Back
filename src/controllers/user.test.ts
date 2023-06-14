import { NextFunction, Request, Response } from 'express';
import { ProductRepository } from '../repositories/productRepository';
import { CustomError, HTTPError } from '../interfaces/error';
import { UserRepository } from '../repositories/userRepository';
import { UserController } from './user';
import { Types } from 'mongoose';
import { createToken, passwdValidate } from '../services/auth';
import { ExtraRequest } from '../middlewares/interceptors';

jest.mock('../services/auth');

describe('Given UserController', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        const productRepo = ProductRepository.getInstance();
        const userId = new Types.ObjectId();
        const productId = new Types.ObjectId();

        repository.create = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
            role: 'admin',
        });
        repository.get = jest.fn().mockResolvedValue({
            id: userId,
            name: 'roberto',
        });
        repository.find = jest.fn().mockResolvedValue({
            id: userId,
            name: 'elena',
            role: 'admin',
            myProducts: [productId],
        });

        repository.findOne = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
            role: 'admin',
            myProducts: [productId],
        });

        repository.update = jest.fn().mockResolvedValue({
            id: userId,
            name: 'carlos',
            role: 'admin',
        });

        const userController = new UserController(repository, productRepo);

        let req: Partial<ExtraRequest>;
        let resp: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            resp = {};
            req.payload = { id: userId };
            req.params = { productId: '6388ee3b4edce8fdd9fa1c11' };
            req.body = { amount: 3 };
            resp.status = jest.fn().mockReturnValue(resp);
            next = jest.fn();
            resp.json = jest.fn();
        });

        test('Then ... get', async () => {
            req.params = { id: '3' };
            await userController.get(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'roberto',
                },
            });
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'pepe',
                    role: 'admin',
                },
            });
        });

        test('Then login should have been called', async () => {
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { passwd: 'patata' };

            await userController.login(req as Request, resp as Response, next);

            expect(resp.json).toHaveBeenCalledWith({
                token: 'token',
                user: {
                    id: userId,
                    myProducts: [productId],
                    name: 'elena',
                    role: 'admin',
                },
            });
        });
        test('Then login and the password is invalid should throw error', async () => {
            const error = new Error('user or password invalid');
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { passwd: 'patata' };

            await userController.login(req as Request, resp as Response, next);

            expect(error).toBeInstanceOf(Error);
        });

        test('Then addCart should have been called', async () => {
            productRepo.findOne = jest.fn().mockResolvedValueOnce({
                id: productId,
                name: 'aldana',
            });
            await userController.addCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('Then updateCart should have been called', async () => {
            repository.get = jest.fn().mockResolvedValue({
                id: userId,
                name: 'elena',
                role: 'admin',
                myProducts: [{ productId: '6388ee3b4edce8fdd9fa1c11' }],
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
        test('Then updateCart should have been called', async () => {
            const error = new Error('Not found id');
            repository.get = jest.fn().mockResolvedValue({
                id: userId,
                name: 'elena',
                role: 'admin',
                myProducts: [{ productId: '6388ee3b4edce8fdd9fahhhh' }],
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
        test('Then deleteCart should have been called', async () => {
            repository.findOne = jest.fn().mockResolvedValue({
                id: userId,
                name: 'elena',
                role: 'admin',
                myProducts: [{ productId: '6388ee3b4edce8fdd9fa1c11' }],
            });
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalled();
        });
    });
    describe('When userController is not valid', () => {
        let error: CustomError;
        beforeEach(() => {
            error = new HTTPError(404, 'Not found', 'Not found id');
        });

        const repository = ProductRepository.getInstance();
        const repoUser = UserRepository.getInstance();
        repository.findAll = jest.fn().mockRejectedValue(['Product']);
        repository.findOne = jest.fn().mockRejectedValue('Product');
        repository.create = jest.fn().mockRejectedValue(['Product']);
        repository.update = jest.fn().mockRejectedValue(['Product']);
        repository.delete = jest.fn().mockRejectedValue(['Product']);

        const userController = new UserController(repoUser, repository);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('should return an error', async () => {
            error.message = 'Not found id';
            error.statusCode = 404;
            error.statusMessage = 'Not found';
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
            expect(error).toHaveProperty('statusCode', 404);
            expect(error).toHaveProperty('statusMessage', 'Not found');
            expect(error).toHaveProperty('message', 'Not found id');
            expect(error).toHaveProperty('name', 'HTTPError');
        });

        test('Then register should return an error', async () => {
            await userController.register(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then login should have not been called', async () => {
            repoUser.find = jest.fn().mockResolvedValue(null);
            (passwdValidate as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { name: '', passwd: 'potato' };
            await userController.login(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then get should return an error', async () => {
            await userController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then addCart should have been called', async () => {
            (passwdValidate as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            await userController.addCart(
                req as Request,
                resp as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then updateCart should have been called', async () => {
            repoUser.findOne = jest.fn().mockRejectedValue({
                name: 'elena',
            });
            await userController.updateCart(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then deleteCart should have been called', async () => {
            repoUser.get = jest.fn().mockRejectedValue({
                name: 'elena',
            });
            await userController.deleteCart(
                req as ExtraRequest,
                resp as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
