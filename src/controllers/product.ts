import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repo, UserRepo } from '../repositories/data.js';
import { ProductI } from '../entities/product.js';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
const debug = createDebug('MS:controllers:product');

export class ProductController {
    constructor(
        public repository: Repo<ProductI>,
        public userRepo: UserRepo<UserI>
    ) {
        debug('instance');
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('getAll');
            const products = await this.repository.findAll();
            resp.json({ products });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('get');
            if (req.params.id.length < 20) {
                throw new Error('Not found id');
            }
            const product = await this.repository.findOne(req.params.id);
            resp.json({ product });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }

    async createProduct(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('createProduct');
            const product = await this.repository.create(req.body);
            resp.status(201).json({ product });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async updateProduct(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('updateProduct');
            const product = await this.repository.update(
                req.params.id,
                req.body
            );
            resp.json({ product });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('delete');
            await this.repository.delete(req.params.id);
            resp.json({});
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
