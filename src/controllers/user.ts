import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { ProductI } from '../entities/product.js';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptors.js';
import { Repo, UserRepo } from '../repositories/data.js';
import { createToken, passwdValidate } from '../services/auth.js';
const debug = createDebug('MS:controllers:user');

export class UserController {
    constructor(
        public readonly repository: UserRepo<UserI>,
        public readonly productRepo: Repo<ProductI>
    ) {
        debug('instance');
    }

    async register(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('register');
            const user = await this.repository.create(req.body);
            resp.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('login', req.body.name);
            const user = await this.repository.find({ name: req.body.name });
            const isPasswdValid = await passwdValidate(
                req.body.passwd,
                user.passwd
            );
            if (!isPasswdValid) throw new Error();
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
            });
            resp.json({ token, user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            debug('get');
            const user = await this.repository.get(req.params.id);
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async addCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('addCart');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.repository.findOne(req.payload.id);
            user.myProducts.push({
                productId: req.params.productId,
                amount: req.body.amount,
            });
            const updateUser = await this.repository.update(
                user.id.toString(),
                {
                    myProducts: user.myProducts,
                }
            );
            resp.json({ user: updateUser });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async updateCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('updateCart');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.repository.get(req.payload.id);

            const userProduct = await user.myProducts.find(
                (product) =>
                    product.productId.toString() === req.params.productId
            );
            if (!userProduct) {
                throw new Error('Not found id');
            }
            userProduct.amount = req.body.amount;

            await this.repository.update(user.id.toString(), {
                myProducts: [...user.myProducts],
            });
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async deleteCart(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('deleteCart');
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.repository.get(req.payload.id);

            const userProduct = user.myProducts.filter((product) => {
                product.productId !== req.params.productId;
            });

            user.myProducts = userProduct;

            await this.repository.update(user.id.toString(), {
                myProducts: user.myProducts,
            });
            resp.json({ user });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', 'error.message');
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
