import { NextFunction, Request, Response } from 'express';
import { CustomError, HTTPError } from '../interfaces/error';
import { ExtraRequest } from '../middlewares/interceptors';
import { ProductRepository } from '../repositories/productRepository';
import { UserRepository } from '../repositories/userRepository';
import { ProductController } from './product';

jest.mock('../services/auth');
const mockResponse = { products: [{ id: '5' }] };
describe('Given productController', () => {
    describe('Given productController', () => {
        const repository = ProductRepository.getInstance();
        const userRepo = UserRepository.getInstance();
        repository.findAll = jest.fn().mockResolvedValue([{ id: '5' }]);
        repository.findOne = jest.fn().mockResolvedValue(mockResponse);
        repository.update = jest.fn().mockResolvedValue(mockResponse);
        repository.create = jest.fn().mockResolvedValue(mockResponse);
        repository.delete = jest.fn().mockResolvedValue({});

        const productController = new ProductController(repository, userRepo);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
            status: jest.fn(),
        };

        const next: NextFunction = jest.fn();

        test('Then ... getAll', async () => {
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });
        test('Then ... get', async () => {
            req.params = { id: '6388ee3b4edce8fdd9fahhhh' };
            await productController.get(req as Request, resp as Response, next);
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });
        test('Then get should return an error', async () => {
            const error = new Error('Not found id');
            req.params = { id: '0' };
            repository.findOne = jest.fn().mockResolvedValue({
                product: { id: '6388ee3b4edce8fdd9fahhhh' },
            });
            await productController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test('Then ... post', async () => {
            await productController.createProduct(
                req as ExtraRequest,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });

        test('Then ... patch', async () => {
            req.params = { id: '3' };
            req.body = { name: 'new name' };
            await productController.updateProduct(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });

        test('Then ... delete', async () => {
            await productController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(resp.json).toHaveBeenCalledWith(mockResponse);
        });
    });

    describe('When productController is not valid', () => {
        let error: CustomError;
        beforeEach(() => {
            error = new HTTPError(404, 'Not found', 'Not found id');
        });
        ProductRepository.prototype.findAll = jest
            .fn()
            .mockRejectedValue(['product']);

        const repository = ProductRepository.getInstance();
        const repoUser = UserRepository.getInstance();
        const productController = new ProductController(repository, repoUser);
        const req: Partial<Request> = {};
        const resp: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then getAll should return an error', async () => {
            repository.findAll = jest.fn().mockRejectedValue('');
            error = new HTTPError(
                503,
                'Service unavailable',
                'Not found service'
            );
            await productController.getAll(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then get should return an error', async () => {
            const error = new Error('Not found id');
            await productController.get(req as Request, resp as Response, next);
            expect(error).toBeInstanceOf(Error);
        });

        test('Then post should return an error', async () => {
            await productController.createProduct(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then patch should return an error', async () => {
            await productController.updateProduct(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(HTTPError);
        });

        test('Then delete should return an error', async () => {
            const error = new Error('Not found id');
            await productController.delete(
                req as Request,
                resp as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
    });
});
